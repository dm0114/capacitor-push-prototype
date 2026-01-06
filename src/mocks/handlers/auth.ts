import { http, HttpResponse } from 'msw'
import type { User } from '@/shared/types'

const SESSION_KEY = 'arkilo_user'

// Mock user
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Test User',
  avatar_url: undefined,
  created_at: new Date().toISOString(),
}

export const authHandlers = [
  // 로그인
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { provider: string }
    console.log(`[MSW] Login with provider: ${body.provider}`)

    // 세션 저장
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(mockUser))

    return HttpResponse.json(mockUser)
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    sessionStorage.removeItem(SESSION_KEY)
    return HttpResponse.json({ success: true })
  }),

  // 현재 사용자 조회
  http.get('/api/auth/me', () => {
    const userJson = sessionStorage.getItem(SESSION_KEY)

    if (!userJson) {
      return HttpResponse.json(null, { status: 401 })
    }

    return HttpResponse.json(JSON.parse(userJson))
  }),
]
