# Phase 2: 페이지 시스템

## Task 2.1: 페이지 Mock 핸들러

### 작업 내용
- [ ] GET /api/pages (목록)
- [ ] GET /api/pages/:id (상세)
- [ ] POST /api/pages (생성)
- [ ] PATCH /api/pages/:id (수정)
- [ ] DELETE /api/pages/:id (삭제)
- [ ] 초기 샘플 데이터

### 산출물
- `src/mocks/handlers/pages.ts`
- `src/mocks/data/pages.ts`

---

## Task 2.2: Page Repository

### 작업 내용
- [ ] MockPageRepository 구현
- [ ] 전체 CRUD 메서드

### 산출물
- `src/repositories/implementations/mock/MockPageRepository.ts`

### 코드
```typescript
export class MockPageRepository implements IPageRepository {
  private baseUrl = '/api/pages'

  async findAll(): Promise<Page[]> {
    const res = await fetch(this.baseUrl)
    return res.json()
  }

  async findById(id: string): Promise<Page | null> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (!res.ok) return null
    return res.json()
  }

  async findByParentId(parentId: string | null): Promise<Page[]> {
    const res = await fetch(`${this.baseUrl}?parentId=${parentId ?? 'null'}`)
    return res.json()
  }

  async create(data: CreatePageDto): Promise<Page> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async update(id: string, data: UpdatePageDto): Promise<Page> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' })
  }
}
```

---

## Task 2.3: Page Queries & Mutations

### 작업 내용
- [ ] pageKeys 정의
- [ ] usePages, usePage 쿼리
- [ ] useCreatePage, useUpdatePage, useDeletePage 뮤테이션
- [ ] Optimistic Update 패턴

### 산출물
- `src/features/pages/api/queries.ts`
- `src/features/pages/api/mutations.ts`

---

## Task 2.4: Page Store (Zustand)

### 작업 내용
- [ ] selectedPageId
- [ ] expandedIds (Set)
- [ ] renamingPageId
- [ ] 관련 액션들

### 산출물
- `src/features/pages/stores/pageStore.ts`

---

## Task 2.5: usePageModel (훅 오케스트레이션)

### 작업 내용
- [ ] Query + Store 조합
- [ ] 파생 상태 (rootPages, childPages)
- [ ] 복합 비즈니스 로직 (createSubPage, moveToTrash)

### 산출물
- `src/features/pages/models/usePageModel.ts`

---

## Task 2.6: 사이드바 UI

### 작업 내용
- [ ] AppShell 레이아웃
- [ ] Sidebar 컴포넌트
- [ ] 사이드바 토글 (반응형)

### 산출물
- `src/shared/components/layout/AppShell.tsx`
- `src/shared/components/layout/Sidebar.tsx`

---

## Task 2.7: PageTree 컴포넌트

### 작업 내용
- [ ] PageTree (재귀 트리)
- [ ] PageTreeItem (개별 항목)
- [ ] 클릭 선택
- [ ] 확장/축소
- [ ] 컨텍스트 메뉴 (추가 예정)

### 산출물
- `src/features/pages/components/PageTree.tsx`
- `src/features/pages/components/PageTreeItem.tsx`

---

## Task 2.8: PageView + 라우팅

### 작업 내용
- [ ] /page/:pageId 라우트
- [ ] PageView 컴포넌트
- [ ] PageHeader (제목, 아이콘)

### 산출물
- `src/routes/_authenticated/page.$pageId.tsx`
- `src/features/pages/components/PageView.tsx`
- `src/features/pages/components/PageHeader.tsx`
