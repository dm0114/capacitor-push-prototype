import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/shared/types'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// API 함수
async function fetchCurrentUser(): Promise<User | null> {
  const response = await fetch('/api/auth/me')

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return response.json()
}

async function login(provider: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Logout failed')
  }
}

// Queries
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분
    retry: false,
  })
}

// Mutations
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      // 캐시 즉시 업데이트
      queryClient.setQueryData(authKeys.me(), user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 캐시 초기화
      queryClient.setQueryData(authKeys.me(), null)
      // 모든 쿼리 무효화
      queryClient.invalidateQueries()
    },
  })
}
