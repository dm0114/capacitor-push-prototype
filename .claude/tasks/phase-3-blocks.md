# Phase 3: 블록 에디터

## Task 3.1: 블록 Mock 핸들러

### 작업 내용
- [ ] GET /api/blocks?pageId=:id (페이지별 블록)
- [ ] POST /api/blocks (생성)
- [ ] PATCH /api/blocks/:id (수정)
- [ ] DELETE /api/blocks/:id (삭제)
- [ ] 초기 샘플 블록 데이터

### 산출물
- `src/mocks/handlers/blocks.ts`
- `src/mocks/data/blocks.ts`

---

## Task 3.2: Block Repository

### 작업 내용
- [ ] IBlockRepository 인터페이스
- [ ] MockBlockRepository 구현

### 산출물
- `src/repositories/interfaces/IBlockRepository.ts`
- `src/repositories/implementations/mock/MockBlockRepository.ts`

---

## Task 3.3: Block Queries & Mutations

### 작업 내용
- [ ] blockKeys 정의
- [ ] useBlocksByPage 쿼리
- [ ] useCreateBlock, useUpdateBlock, useDeleteBlock 뮤테이션
- [ ] Optimistic Update

### 산출물
- `src/features/blocks/api/queries.ts`
- `src/features/blocks/api/mutations.ts`

---

## Task 3.4: BlockNote 의존성 설치

### 작업 내용
```bash
pnpm add @blocknote/core @blocknote/react @blocknote/mantine @mantine/core
```

### 체크리스트
- [ ] BlockNote 패키지 설치
- [ ] Mantine 의존성 설치 (BlockNote 스타일용)
- [ ] CSS import 설정

---

## Task 3.5: BlockEditor 컴포넌트

### 작업 내용
- [ ] BlockNote 에디터 래퍼
- [ ] TanStack Query 연동 (저장)
- [ ] 디바운스 업데이트 (300ms)
- [ ] 노션 스타일 테마

### 산출물
- `src/features/blocks/components/BlockEditor.tsx`
- `src/features/blocks/config/theme.ts`

### 코드
```tsx
// src/features/blocks/components/BlockEditor.tsx
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'

export function BlockEditor({ pageId }: { pageId: string }) {
  const { data: blocks } = useBlocksByPage(pageId)
  const updateBlock = useUpdateBlock()

  const editor = useCreateBlockNote({
    initialContent: blocks,
  })

  const handleChange = useDebouncedCallback((content) => {
    updateBlock.mutate({ pageId, content })
  }, 300)

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => handleChange(editor.document)}
      theme="light"
    />
  )
}
```

---

## Task 3.6: useBlockModel (훅 오케스트레이션)

### 작업 내용
- [ ] Query + Mutation 조합
- [ ] 블록 CRUD 로직

### 산출물
- `src/features/blocks/models/useBlockModel.ts`

---

## Task 3.7: PageView에 BlockEditor 통합

### 작업 내용
- [ ] PageView에서 is_database 분기
- [ ] 일반 페이지: BlockEditor
- [ ] DB 페이지: DatabaseView (Phase 4)

### 산출물
- `src/features/pages/components/PageView.tsx` 수정
