import { Navigate, Outlet } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthGuardProps {
  children?: React.ReactNode
}

/**
 * 인증이 필요한 라우트를 보호하는 가드 컴포넌트
 * - 로딩 중: 스피너 표시
 * - 미인증: /auth/login으로 리다이렉트
 * - 인증됨: children 또는 Outlet 렌더
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />
  }

  return children ?? <Outlet />
}
