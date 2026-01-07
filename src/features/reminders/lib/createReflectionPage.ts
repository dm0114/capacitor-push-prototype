import { format } from 'date-fns'

/**
 * 오늘 날짜로 회고 페이지 생성
 * @returns 생성된 페이지 ID
 */
export async function createReflectionPage(): Promise<string> {
  const today = format(new Date(), 'yyyy-MM-dd')
  const title = `${today} 회고`

  // MSW 또는 실제 API 호출
  const response = await fetch('/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      icon: '📝',
      parent_id: null,
    }),
  })

  if (!response.ok) {
    throw new Error('회고 페이지 생성 실패')
  }

  const page = await response.json()
  return page.id
}
