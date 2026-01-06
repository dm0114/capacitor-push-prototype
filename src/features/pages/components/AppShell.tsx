import { Outlet } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children?: React.ReactNode
}

/**
 * 앱의 메인 레이아웃 쉘
 * - 사이드바 + 메인 콘텐츠 영역
 * - 사이드바 열림/닫힘 상태 관리
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden',
          'transition-[margin] duration-200'
        )}
      >
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
