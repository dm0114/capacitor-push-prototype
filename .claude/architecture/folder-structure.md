# 폴더 구조

## 레이어 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        레이어 흐름도                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   UI Layer (React Components)                                   │
│   └── features/*/components/                                    │
│              │                                                  │
│              ▼                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │           Model Layer (Hook Orchestration)               │  │
│   │           └── features/*/models/                         │  │
│   │                                                          │  │
│   │   • 여러 훅 조합 (Query + Mutation + Store)               │  │
│   │   • 비즈니스 로직 캡슐화                                   │  │
│   │   • UI에 필요한 데이터/액션 제공                           │  │
│   └─────────────────────────────────────────────────────────┘  │
│              │                                                  │
│              ▼                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │           Query Layer (TanStack Query)                   │  │
│   │           └── features/*/api/                            │  │
│   │                                                          │  │
│   │   • useQuery, useMutation 정의                           │  │
│   │   • Query Keys 관리                                      │  │
│   │   • Optimistic Update 처리                               │  │
│   └─────────────────────────────────────────────────────────┘  │
│              │                                                  │
│              ▼                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │           Repository Layer (순수 함수/클래스)              │  │
│   │           └── repositories/                              │  │
│   │                                                          │  │
│   │   • 상태 없음 (No Hooks)                                  │  │
│   │   • Interface + Implementation                           │  │
│   │   • 데이터 변환/정규화                                     │  │
│   └─────────────────────────────────────────────────────────┘  │
│              │                                                  │
│              ▼                                                  │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │           DataSource Layer                               │  │
│   │           └── datasources/                               │  │
│   │                                                          │  │
│   │   • MSW (개발)                                           │  │
│   │   • Supabase (프로덕션)                                   │  │
│   │   • REST API (EC2 전환 시)                               │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 전체 폴더 구조

```
src/
├── app/                          # 앱 전역 설정
│   ├── providers.tsx             # QueryClient, Router 등 Provider 조합
│   └── router.tsx                # TanStack Router 설정
│
├── repositories/                 # Repository Layer (순수 함수/클래스)
│   ├── interfaces/               # 인터페이스 정의
│   │   ├── IPageRepository.ts
│   │   ├── IBlockRepository.ts
│   │   └── IPropertyRepository.ts
│   │
│   ├── implementations/          # 구현체
│   │   ├── mock/                 # MSW용 Mock Repository
│   │   │   ├── MockPageRepository.ts
│   │   │   └── MockBlockRepository.ts
│   │   │
│   │   ├── supabase/             # Supabase Repository
│   │   │   ├── SupabasePageRepository.ts
│   │   │   └── SupabaseBlockRepository.ts
│   │   │
│   │   └── rest/                 # REST API Repository (EC2용)
│   │       └── RestPageRepository.ts
│   │
│   └── index.ts                  # Repository Factory (환경별 선택)
│
├── datasources/                  # DataSource Layer
│   ├── supabase/
│   │   └── client.ts             # Supabase 클라이언트
│   └── api/
│       └── httpClient.ts         # REST API 클라이언트
│
├── features/                     # Feature 모듈 (도메인별)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginPage.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── models/               # 훅 오케스트레이션
│   │   │   └── useAuthModel.ts
│   │   ├── api/                  # TanStack Query
│   │   │   └── queries.ts
│   │   ├── stores/               # Zustand (UI 상태)
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts              # Public API
│   │
│   ├── pages/
│   │   ├── components/
│   │   │   ├── PageTree.tsx
│   │   │   ├── PageTreeItem.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── PageView.tsx
│   │   ├── models/
│   │   │   └── usePageModel.ts   # 페이지 관련 훅 조합
│   │   ├── api/
│   │   │   ├── queries.ts        # usePages, usePage
│   │   │   └── mutations.ts      # useCreatePage, useUpdatePage
│   │   ├── stores/
│   │   │   └── pageStore.ts      # selectedPageId, expandedIds
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── blocks/
│   │   ├── components/
│   │   │   ├── BlockEditor.tsx
│   │   │   └── SlashMenu.tsx
│   │   ├── models/
│   │   │   └── useBlockModel.ts
│   │   ├── api/
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── config/
│   │   │   ├── theme.ts
│   │   │   └── blockTypes.ts
│   │   └── index.ts
│   │
│   ├── database/
│   │   ├── components/
│   │   │   ├── DatabaseView.tsx
│   │   │   ├── TableView.tsx
│   │   │   ├── PropertyCell.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── ViewTabs.tsx
│   │   ├── models/
│   │   │   └── useDatabaseModel.ts
│   │   ├── api/
│   │   │   └── queries.ts
│   │   └── index.ts
│   │
│   ├── kanban/
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── KanbanCard.tsx
│   │   ├── models/
│   │   │   └── useKanbanModel.ts
│   │   └── index.ts
│   │
│   └── calendar/
│       ├── components/
│       │   ├── CalendarView.tsx
│       │   └── EventModal.tsx
│       ├── models/
│       │   └── useCalendarModel.ts
│       └── index.ts
│
├── shared/                       # 공유 리소스
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── layout/               # 레이아웃 컴포넌트
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx
│   │       ├── ResponsiveStack.tsx
│   │       └── ResponsiveGrid.tsx
│   │
│   ├── hooks/                    # 범용 훅
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── usePlatform.ts
│   │
│   ├── stores/                   # 전역 Zustand Store
│   │   └── uiStore.ts            # theme, sidebarOpen
│   │
│   ├── lib/                      # 유틸리티
│   │   ├── cn.ts                 # clsx + tailwind-merge
│   │   └── fractionalIndex.ts
│   │
│   └── types/                    # 공유 타입
│       └── index.ts
│
├── platform/                     # Platform Abstraction Layer
│   ├── interfaces/
│   │   └── IPlatform.ts
│   ├── implementations/
│   │   ├── WebPlatform.ts
│   │   ├── CapacitorPlatform.ts
│   │   └── ElectronPlatform.ts
│   ├── PlatformProvider.tsx
│   └── index.ts
│
├── mocks/                        # MSW 핸들러
│   ├── handlers/
│   │   ├── auth.ts
│   │   ├── pages.ts
│   │   ├── blocks.ts
│   │   └── index.ts
│   ├── data/                     # Mock 데이터
│   │   ├── users.ts
│   │   ├── pages.ts
│   │   └── blocks.ts
│   └── browser.ts
│
├── routes/                       # TanStack Router
│   ├── __root.tsx
│   ├── _authenticated.tsx
│   ├── _authenticated/
│   │   ├── index.tsx
│   │   └── page.$pageId.tsx
│   └── auth/
│       └── login.tsx
│
├── main.tsx                      # 엔트리포인트
└── index.css                     # 전역 스타일
```

---

## 레이어별 상세 설명

### 1. Repository Layer (순수 함수/클래스)

Repository는 **훅이 아닌 순수 함수/클래스**로 구현합니다.

```typescript
// repositories/interfaces/IPageRepository.ts
export interface IPageRepository {
  findAll(): Promise<Page[]>
  findById(id: string): Promise<Page | null>
  findByParentId(parentId: string | null): Promise<Page[]>
  create(data: CreatePageDto): Promise<Page>
  update(id: string, data: UpdatePageDto): Promise<Page>
  delete(id: string): Promise<void>
}

// repositories/implementations/supabase/SupabasePageRepository.ts
export class SupabasePageRepository implements IPageRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(): Promise<Page[]> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .order('position')

    if (error) throw error
    return data
  }

  async findById(id: string): Promise<Page | null> {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  }

  // ... 나머지 메서드
}

// repositories/index.ts (Factory)
import { MockPageRepository } from './implementations/mock/MockPageRepository'
import { SupabasePageRepository } from './implementations/supabase/SupabasePageRepository'
import { supabase } from '@/datasources/supabase/client'

export function createRepositories() {
  const useMock = import.meta.env.VITE_USE_MSW === 'true'

  return {
    pageRepository: useMock
      ? new MockPageRepository()
      : new SupabasePageRepository(supabase),
    blockRepository: useMock
      ? new MockBlockRepository()
      : new SupabaseBlockRepository(supabase),
    // ...
  }
}

export type Repositories = ReturnType<typeof createRepositories>
```

---

### 2. Query Layer (TanStack Query)

Repository를 사용하여 Query/Mutation을 정의합니다.

```typescript
// features/pages/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import { useRepositories } from '@/shared/hooks/useRepositories'

export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (filters: PageFilters) => [...pageKeys.lists(), filters] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
}

export function usePages(parentId?: string) {
  const { pageRepository } = useRepositories()

  return useQuery({
    queryKey: pageKeys.list({ parentId }),
    queryFn: () => pageRepository.findByParentId(parentId ?? null),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePage(id: string) {
  const { pageRepository } = useRepositories()

  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => pageRepository.findById(id),
    enabled: !!id,
  })
}

// features/pages/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRepositories } from '@/shared/hooks/useRepositories'

export function useCreatePage() {
  const queryClient = useQueryClient()
  const { pageRepository } = useRepositories()

  return useMutation({
    mutationFn: (data: CreatePageDto) => pageRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}
```

---

### 3. Model Layer (훅 오케스트레이션)

여러 Query, Mutation, Store를 조합하여 UI에 필요한 형태로 제공합니다.

```typescript
// features/pages/models/usePageModel.ts
import { useCallback } from 'react'
import { usePages, usePage } from '../api/queries'
import { useCreatePage, useUpdatePage, useDeletePage } from '../api/mutations'
import { usePageStore } from '../stores/pageStore'

export function usePageModel(pageId?: string) {
  // Queries
  const pagesQuery = usePages()
  const pageQuery = usePage(pageId ?? '')

  // Mutations
  const createPageMutation = useCreatePage()
  const updatePageMutation = useUpdatePage()
  const deletePageMutation = useDeletePage()

  // UI Store
  const {
    selectedPageId,
    expandedIds,
    selectPage,
    toggleExpanded,
    setExpanded,
  } = usePageStore()

  // 비즈니스 로직 조합
  const createSubPage = useCallback(async (title: string) => {
    const newPage = await createPageMutation.mutateAsync({
      parent_id: selectedPageId,
      title,
    })
    // 부모 페이지 자동 확장
    if (selectedPageId) {
      setExpanded(selectedPageId, true)
    }
    return newPage
  }, [selectedPageId, createPageMutation, setExpanded])

  const moveToTrash = useCallback(async (id: string) => {
    await updatePageMutation.mutateAsync({
      id,
      data: { archived: true },
    })
    // 선택된 페이지가 삭제된 경우 선택 해제
    if (selectedPageId === id) {
      selectPage(null)
    }
  }, [selectedPageId, updatePageMutation, selectPage])

  // 파생 상태
  const rootPages = pagesQuery.data?.filter(p => !p.parent_id) ?? []
  const isLoading = pagesQuery.isLoading || pageQuery.isLoading
  const currentPage = pageQuery.data

  return {
    // 데이터
    pages: pagesQuery.data ?? [],
    rootPages,
    currentPage,

    // UI 상태
    selectedPageId,
    expandedIds,

    // 로딩 상태
    isLoading,
    isCreating: createPageMutation.isPending,
    isUpdating: updatePageMutation.isPending,

    // 액션 (단순)
    selectPage,
    toggleExpanded,

    // 액션 (복합 비즈니스 로직)
    createSubPage,
    moveToTrash,
    updatePage: updatePageMutation.mutateAsync,
    deletePage: deletePageMutation.mutateAsync,
  }
}
```

---

### 4. UI Layer (React Components)

Model에서 제공하는 데이터와 액션만 사용합니다.

```typescript
// features/pages/components/PageTree.tsx
import { usePageModel } from '../models/usePageModel'
import { PageTreeItem } from './PageTreeItem'

export function PageTree() {
  const {
    rootPages,
    selectedPageId,
    expandedIds,
    selectPage,
    toggleExpanded,
    createSubPage,
    moveToTrash,
    isLoading,
  } = usePageModel()

  if (isLoading) {
    return <PageTreeSkeleton />
  }

  return (
    <div className="space-y-1">
      {rootPages.map(page => (
        <PageTreeItem
          key={page.id}
          page={page}
          isSelected={selectedPageId === page.id}
          isExpanded={expandedIds.has(page.id)}
          onSelect={selectPage}
          onToggle={toggleExpanded}
          onCreateSub={createSubPage}
          onMoveToTrash={moveToTrash}
        />
      ))}
    </div>
  )
}
```

---

## 데이터 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User Interaction                               │
│                        (페이지 생성 버튼 클릭)                            │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  UI Component                                                           │
│  └── PageTree.tsx                                                       │
│      └── onClick={() => createSubPage('새 페이지')}                      │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Model Layer                                                            │
│  └── usePageModel.ts                                                    │
│      └── createSubPage()                                                │
│          ├── createPageMutation.mutateAsync({ parent_id, title })       │
│          └── setExpanded(parentId, true)  // UI 상태 업데이트            │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Query Layer                                                            │
│  └── useCreatePage (mutations.ts)                                       │
│      └── mutationFn: pageRepository.create(data)                        │
│      └── onSuccess: invalidateQueries(['pages', 'list'])                │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Repository Layer (순수 클래스)                                          │
│  └── SupabasePageRepository.create()                                    │
│      └── supabase.from('pages').insert(data)                            │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  DataSource Layer                                                       │
│  └── Supabase / MSW / REST API                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Feature 의존성 규칙

```
┌─────────────────────────────────────────────────────────────────┐
│                      의존성 방향 (단방향)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      shared/                              │  │
│  │        (components/ui, hooks, lib, types)                 │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   repositories/                           │  │
│  │        (순수 클래스, 훅 아님)                               │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│    ┌──────────────────────────┼──────────────────────────┐     │
│    │                          │                          │     │
│    ▼                          ▼                          ▼     │
│  ┌─────┐    ┌─────┐    ┌──────┐    ┌────────┐    ┌───────┐   │
│  │auth │    │pages│───►│blocks│    │database│───►│kanban │   │
│  └─────┘    └─────┘    └──────┘    └────────┘    └───────┘   │
│                │                         │            │        │
│                │                         ▼            │        │
│                │                   ┌──────────┐       │        │
│                └──────────────────►│ calendar │◄──────┘        │
│                                    └──────────┘                │
│                                                                 │
│  ✅ 허용:                                                       │
│     - shared → feature (O)                                     │
│     - repositories → feature (O)                               │
│     - feature A → feature B (단방향만, O)                       │
│                                                                 │
│  ❌ 금지:                                                       │
│     - feature A ↔ feature B (양방향, X)                         │
│     - feature → shared (X)                                     │
│     - feature → repositories (X, repositories 사용은 가능)      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository 직접 Export 패턴

Provider 없이 환경별 Repository 인스턴스를 직접 export합니다.

```typescript
// repositories/index.ts
import { MockPageRepository } from './implementations/mock/MockPageRepository'
import { MockBlockRepository } from './implementations/mock/MockBlockRepository'
import { SupabasePageRepository } from './implementations/supabase/SupabasePageRepository'
import { SupabaseBlockRepository } from './implementations/supabase/SupabaseBlockRepository'
import { supabase } from '@/datasources/supabase/client'

const useMock = import.meta.env.VITE_USE_MSW === 'true'

// 환경별 Repository 인스턴스 (싱글톤)
export const pageRepository = useMock
  ? new MockPageRepository()
  : new SupabasePageRepository(supabase)

export const blockRepository = useMock
  ? new MockBlockRepository()
  : new SupabaseBlockRepository(supabase)

export const propertyRepository = useMock
  ? new MockPropertyRepository()
  : new SupabasePropertyRepository(supabase)

// 타입 export
export type { IPageRepository } from './interfaces/IPageRepository'
export type { IBlockRepository } from './interfaces/IBlockRepository'
```

```typescript
// features/pages/api/queries.ts - 직접 import
import { pageRepository } from '@/repositories'

export function usePages(parentId?: string) {
  return useQuery({
    queryKey: pageKeys.list({ parentId }),
    queryFn: () => pageRepository.findByParentId(parentId ?? null),
  })
}
```

```typescript
// 테스트에서 모킹
// __tests__/pages.test.ts
vi.mock('@/repositories', () => ({
  pageRepository: {
    findAll: vi.fn().mockResolvedValue([mockPage]),
    findById: vi.fn().mockResolvedValue(mockPage),
  },
}))
```

---

## 요약: 레이어 책임

| 레이어 | 책임 | 상태 보유 | 훅 여부 |
|--------|------|----------|--------|
| **UI** | 렌더링, 이벤트 핸들링 | X | 컴포넌트 |
| **Model** | 훅 오케스트레이션, 비즈니스 로직 조합 | △ (조합만) | O |
| **Query** | 서버 캐시, Optimistic Update | O (Query Cache) | O |
| **Store** | 클라이언트 UI 상태 | O | O |
| **Repository** | 데이터 접근 추상화 | X | X |
| **DataSource** | 실제 API 호출 | X | X |
