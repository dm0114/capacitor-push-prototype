# Phase 1: MSW 설정 + 인증 모킹

## Task 1.1: MSW 브라우저 설정

### 작업 내용
- [ ] MSW 서비스 워커 초기화
- [ ] 개발 환경에서만 활성화
- [ ] main.tsx에 초기화 코드 추가

### 산출물
- `public/mockServiceWorker.js` (npx msw init public/)
- `src/mocks/browser.ts`
- `src/mocks/handlers/index.ts`
- `src/main.tsx` 수정

### 코드
```typescript
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

```typescript
// src/main.tsx
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(...)
})
```

---

## Task 1.2: 인증 Mock 핸들러

### 작업 내용
- [ ] POST /api/auth/login (소셜 로그인 시뮬레이션)
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me (현재 사용자)
- [ ] sessionStorage 기반 상태 유지

### 산출물
- `src/mocks/handlers/auth.ts`
- `src/mocks/data/users.ts`

### 코드
```typescript
// src/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { provider } = await request.json()
    const user = { id: '1', email: 'user@example.com', name: 'Test User' }
    sessionStorage.setItem('user', JSON.stringify(user))
    return HttpResponse.json(user)
  }),

  http.post('/api/auth/logout', () => {
    sessionStorage.removeItem('user')
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', () => {
    const user = sessionStorage.getItem('user')
    if (!user) return HttpResponse.json(null, { status: 401 })
    return HttpResponse.json(JSON.parse(user))
  }),
]
```

---

## Task 1.3: Auth Feature 구조

### 작업 내용
- [ ] authStore (Zustand) 생성
- [ ] useAuth 훅 + TanStack Query
- [ ] 타입 정의

### 산출물
- `src/features/auth/stores/authStore.ts`
- `src/features/auth/api/queries.ts`
- `src/features/auth/models/useAuthModel.ts`
- `src/features/auth/types/index.ts`
- `src/features/auth/index.ts`

---

## Task 1.4: 로그인 페이지 UI

### 작업 내용
- [ ] LoginPage 컴포넌트
- [ ] 소셜 로그인 버튼 (Google, GitHub - 모킹)
- [ ] 로딩 상태 처리

### 산출물
- `src/features/auth/components/LoginPage.tsx`
- `src/routes/auth/login.tsx`

---

## Task 1.5: AuthGuard 컴포넌트

### 작업 내용
- [ ] 인증 여부 체크
- [ ] 미인증 시 /auth/login 리다이렉트
- [ ] 로딩 상태 처리

### 산출물
- `src/features/auth/components/AuthGuard.tsx`
- `src/routes/_authenticated.tsx`
