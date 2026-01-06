import { http, HttpResponse } from 'msw'

// In-memory 데이터 저장소
// 실제로는 BlockNote의 JSON을 그대로 저장
let blocksContent: Record<string, unknown[]> = {
  // pageId: BlockNote JSON blocks array
  'page-1': [
    {
      id: 'block-1',
      type: 'heading',
      props: { level: 1 },
      content: [{ type: 'text', text: 'Arkilo에 오신 것을 환영합니다!', styles: {} }],
      children: [],
    },
    {
      id: 'block-2',
      type: 'paragraph',
      props: {},
      content: [{ type: 'text', text: '이것은 노션 스타일의 블록 에디터입니다. 자유롭게 편집해보세요.', styles: {} }],
      children: [],
    },
    {
      id: 'block-3',
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text: '리스트 아이템 1', styles: {} }],
      children: [],
    },
    {
      id: 'block-4',
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text: '리스트 아이템 2', styles: {} }],
      children: [],
    },
  ],
  'page-2': [
    {
      id: 'block-5',
      type: 'heading',
      props: { level: 1 },
      content: [{ type: 'text', text: '시작하기', styles: {} }],
      children: [],
    },
    {
      id: 'block-6',
      type: 'paragraph',
      props: {},
      content: [{ type: 'text', text: '이 페이지에서 기본적인 사용법을 알아보세요.', styles: {} }],
      children: [],
    },
  ],
  'page-3': [
    {
      id: 'block-7',
      type: 'heading',
      props: { level: 1 },
      content: [{ type: 'text', text: '빠른 시작 가이드', styles: {} }],
      children: [],
    },
    {
      id: 'block-8',
      type: 'numberedListItem',
      props: {},
      content: [{ type: 'text', text: '사이드바에서 새 페이지를 만드세요', styles: {} }],
      children: [],
    },
    {
      id: 'block-9',
      type: 'numberedListItem',
      props: {},
      content: [{ type: 'text', text: '/ 를 입력하여 블록 타입을 선택하세요', styles: {} }],
      children: [],
    },
    {
      id: 'block-10',
      type: 'numberedListItem',
      props: {},
      content: [{ type: 'text', text: '드래그로 블록 순서를 변경하세요', styles: {} }],
      children: [],
    },
  ],
}

export const blockHandlers = [
  // 페이지의 블록 내용 조회 (BlockNote JSON 형식)
  http.get('/api/pages/:pageId/blocks', ({ params }) => {
    const pageId = params.pageId as string
    const blocks = blocksContent[pageId] ?? []
    return HttpResponse.json(blocks)
  }),

  // 페이지의 블록 내용 저장 (전체 교체)
  http.put('/api/pages/:pageId/blocks', async ({ params, request }) => {
    const pageId = params.pageId as string
    const blocks = await request.json() as unknown[]

    blocksContent[pageId] = blocks

    return HttpResponse.json({ success: true })
  }),

  // 단일 블록 업데이트 (부분 업데이트용 - 선택적)
  http.patch('/api/blocks/:blockId', async ({ params, request }) => {
    const blockId = params.blockId as string
    const updates = await request.json() as Record<string, unknown>

    // 모든 페이지에서 해당 블록 찾아서 업데이트
    for (const pageId in blocksContent) {
      const blocks = blocksContent[pageId] as Array<Record<string, unknown>>
      const blockIndex = blocks.findIndex((b) => b.id === blockId)

      if (blockIndex !== -1) {
        blocks[blockIndex] = { ...blocks[blockIndex], ...updates }
        return HttpResponse.json(blocks[blockIndex])
      }
    }

    return HttpResponse.json({ error: 'Block not found' }, { status: 404 })
  }),
]
