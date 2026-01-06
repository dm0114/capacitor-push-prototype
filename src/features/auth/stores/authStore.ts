import { create } from 'zustand'

interface AuthUIState {
  // UI 상태만 관리 (서버 데이터는 TanStack Query)
  isLoggingIn: boolean
  loginError: string | null

  // 액션
  setLoggingIn: (isLoggingIn: boolean) => void
  setLoginError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthUIState>((set) => ({
  isLoggingIn: false,
  loginError: null,

  setLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
  setLoginError: (loginError) => set({ loginError }),
  clearError: () => set({ loginError: null }),
}))
