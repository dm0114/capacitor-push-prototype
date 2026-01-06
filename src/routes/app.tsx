import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard, useAuth } from '@/features/auth'
import { AppShell } from '@/features/pages'
import { Loader2 } from 'lucide-react'

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthGuard />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

// /app 라우트 - 인증 + AppShell 레이아웃
export const Route = createFileRoute('/app')({
  component: AppLayout,
})
