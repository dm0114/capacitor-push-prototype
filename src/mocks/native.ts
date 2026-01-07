// FIXME: 제거 예정
/**
 * 네이티브 앱용 로컬 모킹
 * MSW가 작동하지 않는 Capacitor 환경에서 사용
 */

// 로컬 스토리지 기반 모킹 데이터
const STORAGE_KEYS = {
  USER: 'arkilo_user',
  PAGES: 'arkilo_pages',
}

// 초기 사용자 데이터
const mockUser = {
  id: 'user-1',
  email: 'demo@arkilo.app',
  name: 'Demo User',
  avatar_url: null,
}

// 초기 페이지 데이터
const initialPages = [
  {
    id: 'page-1',
    parent_id: null,
    title: 'Welcome to Arkilo',
    icon: '👋',
    is_database: false,
    archived: false,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'db-1',
    parent_id: null,
    title: 'Task Database',
    icon: '📋',
    is_database: true,
    archived: false,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Fetch 인터셉터 설정
export function setupNativeMocking() {
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()

    // Auth endpoints
    if (url.includes('/api/auth/me')) {
      const user = localStorage.getItem(STORAGE_KEYS.USER)
      if (user) {
        return new Response(user, { status: 200 })
      }
      return new Response(null, { status: 401 })
    }

    if (url.includes('/api/auth/login') && init?.method === 'POST') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser))
      return new Response(JSON.stringify(mockUser), { status: 200 })
    }

    if (url.includes('/api/auth/logout') && init?.method === 'POST') {
      localStorage.removeItem(STORAGE_KEYS.USER)
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    // Pages endpoints - GET
    if (url.includes('/api/pages') && (!init?.method || init.method === 'GET')) {
      let pages = localStorage.getItem(STORAGE_KEYS.PAGES)
      if (!pages) {
        localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(initialPages))
        pages = JSON.stringify(initialPages)
      }
      return new Response(pages, { status: 200 })
    }

    // Pages endpoints - POST (페이지 생성)
    if (url.includes('/api/pages') && init?.method === 'POST') {
      const body = JSON.parse(init.body as string)
      const pages = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGES) || '[]')

      const newPage = {
        id: `page-${Date.now()}`,
        parent_id: body.parent_id ?? null,
        title: body.title ?? '',
        icon: body.icon ?? null,
        is_database: false,
        archived: false,
        position: pages.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      pages.push(newPage)
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages))

      return new Response(JSON.stringify(newPage), { status: 201 })
    }

    // 기타 요청은 원래 fetch로 전달 (실패할 수 있음)
    return originalFetch(input, init)
  }
}
