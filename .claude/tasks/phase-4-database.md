# Phase 4: 데이터베이스 + 칸반보드

## Task 4.1: Database Mock 핸들러

### 작업 내용
- [ ] Properties CRUD (/api/properties)
- [ ] PropertyValues CRUD (/api/property-values)
- [ ] Views CRUD (/api/views)
- [ ] 초기 샘플 데이터

### 산출물
- `src/mocks/handlers/database.ts`
- `src/mocks/data/properties.ts`
- `src/mocks/data/views.ts`

---

## Task 4.2: Database Repositories

### 작업 내용
- [ ] IPropertyRepository
- [ ] IPropertyValueRepository
- [ ] IViewRepository
- [ ] Mock 구현체들

### 산출물
- `src/repositories/interfaces/IPropertyRepository.ts`
- `src/repositories/interfaces/IViewRepository.ts`
- `src/repositories/implementations/mock/MockPropertyRepository.ts`
- `src/repositories/implementations/mock/MockViewRepository.ts`

---

## Task 4.3: Database Queries & Mutations

### 작업 내용
- [ ] useProperties, useViews 쿼리
- [ ] useCreateProperty, useUpdateProperty 뮤테이션
- [ ] usePropertyValues 쿼리

### 산출물
- `src/features/database/api/queries.ts`
- `src/features/database/api/mutations.ts`

---

## Task 4.4: useDatabaseModel (훅 오케스트레이션)

### 작업 내용
- [ ] Properties + Views + Rows 조합
- [ ] 필터/정렬 로직
- [ ] 뷰 전환 로직

### 산출물
- `src/features/database/models/useDatabaseModel.ts`

---

## Task 4.5: TanStack Table 설치 + 통합

### 작업 내용
```bash
pnpm add @tanstack/react-table
```

- [ ] TanStack Table 설치
- [ ] 기본 테이블 컴포넌트

### 산출물
- `src/features/database/components/TableView.tsx`

---

## Task 4.6: TableView 컴포넌트

### 작업 내용
- [ ] TanStack Table 설정
- [ ] 동적 컬럼 (Properties 기반)
- [ ] 셀 렌더러 (타입별)
- [ ] 인라인 편집

### 산출물
- `src/features/database/components/TableView.tsx`
- `src/features/database/components/PropertyCell.tsx`
- `src/features/database/components/cells/TextCell.tsx`
- `src/features/database/components/cells/SelectCell.tsx`
- `src/features/database/components/cells/DateCell.tsx`

---

## Task 4.7: dnd-kit 설치 + 설정

### 작업 내용
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 산출물
- 의존성 설치 완료

---

## Task 4.8: KanbanBoard 컴포넌트

### 작업 내용
- [ ] dnd-kit DndContext 설정
- [ ] KanbanBoard 레이아웃
- [ ] KanbanColumn (Select 옵션별)
- [ ] KanbanCard
- [ ] 카드 DnD (컬럼 간 이동)

### 산출물
- `src/features/kanban/components/KanbanBoard.tsx`
- `src/features/kanban/components/KanbanColumn.tsx`
- `src/features/kanban/components/KanbanCard.tsx`
- `src/features/kanban/hooks/useDragAndDrop.ts`

---

## Task 4.9: useKanbanModel

### 작업 내용
- [ ] 칸반 데이터 구조화 (컬럼별 카드)
- [ ] 드래그 핸들러
- [ ] 위치 업데이트 로직

### 산출물
- `src/features/kanban/models/useKanbanModel.ts`

---

## Task 4.10: ViewTabs + ViewSwitcher

### 작업 내용
- [ ] 뷰 탭 UI
- [ ] 뷰 전환 (Table ↔ Board)
- [ ] 뷰 생성/편집 UI

### 산출물
- `src/features/database/components/ViewTabs.tsx`
- `src/features/database/components/DatabaseView.tsx`

---

## Task 4.11: FilterBar 컴포넌트

### 작업 내용
- [ ] 필터 조건 UI
- [ ] 정렬 UI
- [ ] URL 상태 연동 (TanStack Router search)

### 산출물
- `src/features/database/components/FilterBar.tsx`
- `src/features/database/components/SortMenu.tsx`
