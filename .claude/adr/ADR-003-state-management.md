# ADR-003: 상태 관리 전략

**Status**: Accepted
**Date**: 2025-01-06
**Deciders**: dm0114

---

## Context

노션 스타일 앱에서 다양한 상태를 관리해야 함:
- 서버 데이터 (Pages, Blocks, Properties)
- UI 상태 (선택된 항목, 모달, 사이드바)
- 실시간 동기화 + 오프라인 지원

## Decision

**분산 상태관리 + 서버 캐시 분리** 전략 채택

| 상태 유형 | 저장소 | 예시 |
|----------|--------|------|
| 서버 데이터 | TanStack Query | Pages, Blocks |
| 전역 UI | Zustand (shared) | theme, sidebarOpen |
| Feature UI | Zustand (feature) | selectedPageId |
| 로컬 UI | useState | inputValue |
| URL 상태 | TanStack Router | filters, sort |

---

## Architecture

### 레이어 구조

```
UI Components
     ↓
Model Layer (훅 오케스트레이션)
     ↓
Query Layer (TanStack Query)  +  Store Layer (Zustand)
     ↓
Repository Layer (순수 클래스, 직접 import)
     ↓
DataSource (MSW / Supabase / REST)
```

### Model Layer

여러 Query, Mutation, Store를 조합하여 UI에 제공:

```typescript
// features/pages/models/usePageModel.ts
export function usePageModel(pageId?: string) {
  // Queries
  const pagesQuery = usePages()
  const pageQuery = usePage(pageId ?? '')

  // Mutations
  const createMutation = useCreatePage()

  // UI Store
  const store = usePageStore()

  // 복합 비즈니스 로직
  const createSubPage = useCallback(async (title: string) => {
    const newPage = await createMutation.mutateAsync({
      parent_id: store.selectedPageId,
      title,
    })
    if (store.selectedPageId) {
      store.setExpanded(store.selectedPageId, true)
    }
    return newPage
  }, [store.selectedPageId, createMutation])

  return {
    pages: pagesQuery.data ?? [],
    currentPage: pageQuery.data,
    selectedPageId: store.selectedPageId,
    isLoading: pagesQuery.isLoading,
    createSubPage,
    selectPage: store.selectPage,
  }
}
```

### Repository Layer

**Provider 없이 직접 export**:

```typescript
// repositories/index.ts
const useMock = import.meta.env.VITE_USE_MSW === 'true'

export const pageRepository = useMock
  ? new MockPageRepository()
  : new SupabasePageRepository(supabase)

// Query에서 직접 import
import { pageRepository } from '@/repositories'

export function usePages() {
  return useQuery({
    queryKey: ['pages'],
    queryFn: () => pageRepository.findAll(),
  })
}
```

---

## Tradeoffs

| 원하는 것 | 지불하는 대가 |
|----------|-------------|
| Feature 독립성 | 일부 코드 중복 |
| 서버/클라이언트 상태 분리 | 두 가지 상태 도구 학습 |
| 오프라인 우선 | IndexedDB + 충돌 해결 복잡도 |
| 빠른 UI 반응 | 롤백 로직 필요 |

---

## Consequences

### Positive

- 서버 상태 캐싱/동기화 자동화 (TanStack Query)
- Feature별 독립적 상태 관리 (Zustand)
- Repository 교체 용이 (MSW → Supabase → REST)
- 테스트 시 모듈 mock으로 간단히 교체

### Negative

- 두 가지 상태 도구 학습 필요
- Model 레이어 보일러플레이트
- Feature 간 상태 공유 시 의존성 관리 필요

---

## References

- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
