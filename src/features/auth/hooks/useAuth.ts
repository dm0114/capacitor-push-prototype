import { useCurrentUser, useLogin, useLogout } from '../api/queries'
import { useAuthStore } from '../stores/authStore'

/**
 * Auth Model Hook - Query와 Store를 오케스트레이션
 * UI 컴포넌트는 이 훅만 사용하면 됨
 */
export function useAuth() {
  // Server State (TanStack Query)
  const { data: user, isLoading: isLoadingUser, error: userError } = useCurrentUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  // UI State (Zustand)
  const { isLoggingIn, loginError, setLoggingIn, setLoginError, clearError } = useAuthStore()

  // Derived State
  const isAuthenticated = !!user
  const isLoading = isLoadingUser || isLoggingIn

  // Actions
  async function handleLogin(provider: string) {
    try {
      setLoggingIn(true)
      clearError()
      await loginMutation.mutateAsync(provider)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error: loginError || (userError instanceof Error ? userError.message : null),

    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError,

    // Mutation States (for fine-grained UI control)
    isLoggingIn: loginMutation.isPending || isLoggingIn,
    isLoggingOut: logoutMutation.isPending,
  }
}
