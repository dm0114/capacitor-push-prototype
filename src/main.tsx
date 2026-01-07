// Temporal API polyfill (Schedule-X 캘린더에 필요)
import { Temporal } from 'temporal-polyfill'
;(globalThis as Record<string, unknown>).Temporal = Temporal

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Providers } from '@/app/providers'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 모킹 초기화
async function enableMocking() {
  // Capacitor 네이티브 환경 체크
  const isNative = window.location.protocol === 'capacitor:'

  if (isNative) {
    // 네이티브 앱: fetch 인터셉터 사용
    const { setupNativeMocking } = await import('./mocks/native')
    setupNativeMocking()
    return
  }

  if (import.meta.env.DEV) {
    // 웹 개발 환경: MSW Service Worker 사용
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

// 앱 렌더링
enableMocking().then(() => {
  const rootElement = document.getElementById('app')
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </StrictMode>,
    )
  }
})
