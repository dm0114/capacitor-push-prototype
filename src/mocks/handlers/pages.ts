import { http, HttpResponse } from 'msw'
import { nanoid } from 'nanoid'
import type { Page, CreatePageDto, UpdatePageDto } from '@/shared/types'
import { initialPages } from '../data/pages'

// In-memory 데이터 저장소
let pages: Page[] = [...initialPages]

export const pageHandlers = [
  // 전체 페이지 목록
  http.get('/api/pages', ({ request }) => {
    const url = new URL(request.url)
    const parentId = url.searchParams.get('parentId')
    const databaseId = url.searchParams.get('databaseId')

    let result = pages.filter(p => !p.archived)

    if (parentId !== null) {
      result = result.filter(p =>
        parentId === 'null' ? p.parent_id === null : p.parent_id === parentId
      )
    }

    if (databaseId) {
      result = result.filter(p => p.database_id === databaseId)
    }

    // position 기준 정렬
    result.sort((a, b) => a.position.localeCompare(b.position))

    return HttpResponse.json(result)
  }),

  // 단일 페이지 조회
  http.get('/api/pages/:id', ({ params }) => {
    const page = pages.find(p => p.id === params.id)

    if (!page) {
      return HttpResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return HttpResponse.json(page)
  }),

  // 페이지 생성
  http.post('/api/pages', async ({ request }) => {
    const body = await request.json() as CreatePageDto

    // 같은 부모의 마지막 position 찾기
    const siblings = pages.filter(p => p.parent_id === (body.parent_id ?? null))
    const lastPosition = siblings.length > 0
      ? Math.max(...siblings.map(s => parseFloat(s.position) || 0))
      : 0

    const newPage: Page = {
      id: nanoid(),
      user_id: '1', // TODO: 실제 사용자 ID
      parent_id: body.parent_id ?? null,
      database_id: body.database_id ?? null,
      title: body.title ?? '',
      icon: body.icon,
      cover_image: undefined,
      is_database: body.is_database ?? false,
      archived: false,
      position: String(lastPosition + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    pages.push(newPage)
    return HttpResponse.json(newPage, { status: 201 })
  }),

  // 페이지 수정
  http.patch('/api/pages/:id', async ({ params, request }) => {
    const body = await request.json() as UpdatePageDto
    const index = pages.findIndex(p => p.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    pages[index] = {
      ...pages[index],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(pages[index])
  }),

  // 페이지 삭제
  http.delete('/api/pages/:id', ({ params }) => {
    const index = pages.findIndex(p => p.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // 실제 삭제 대신 archived 처리
    pages[index].archived = true
    pages[index].updated_at = new Date().toISOString()

    return HttpResponse.json({ success: true })
  }),
]
