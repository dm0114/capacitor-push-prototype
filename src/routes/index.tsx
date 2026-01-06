import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: RootRedirect,
})

/**
 * 루트 경로는 인증 상태에 따라 리다이렉트
 * - 인증됨: /_authenticated/ (메인 앱)
 * - 미인증: /auth/login
 */
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app" />
  }

  return <Navigate to="/auth/login" />
}
