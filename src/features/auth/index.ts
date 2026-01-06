// Components
export { LoginPage } from './components/LoginPage'
export { AuthGuard } from './components/AuthGuard'

// Hooks
export { useAuth } from './hooks/useAuth'

// Store
export { useAuthStore } from './stores/authStore'

// API (for advanced use cases)
export { useCurrentUser, useLogin, useLogout, authKeys } from './api/queries'
