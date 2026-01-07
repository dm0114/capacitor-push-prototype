import { useState } from 'react'
import { PanelLeftClose, PanelLeft, Search, LogOut, Bell } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/features/auth'
import { usePageStore } from '../stores/pageStore'
import { PageTree } from './PageTree'
import { ReminderSettings } from '@/features/reminders/components/ReminderSettings'

export function Sidebar() {
  const { user, logout, isLoggingOut } = useAuth()
  const { isSidebarOpen, sidebarWidth, toggleSidebar } = usePageStore()
  const [isReminderOpen, setReminderOpen] = useState(false)

  if (!isSidebarOpen) {
    return (
      <div className="fixed left-0 top-0 z-20 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900',
        'border-r border-neutral-200 dark:border-neutral-800'
      )}
      style={{ width: sidebarWidth }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 h-12 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name ?? ''}
              className="w-6 h-6 rounded"
            />
          ) : (
            <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-700" />
          )}
          <span className="text-sm font-medium truncate max-w-[140px]">
            {user?.name ?? user?.email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-7 w-7"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* 검색 */}
      <div className="px-2 py-2">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md">
          <Search className="h-4 w-4" />
          검색
          <kbd className="ml-auto text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 페이지 트리 */}
      <div className="flex-1 overflow-y-auto">
        <PageTree />
      </div>

      {/* 푸터 */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-2 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-neutral-500"
          onClick={() => setReminderOpen(true)}
        >
          <Bell className="h-4 w-4 mr-2" />
          회고 알림
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-neutral-500"
          onClick={() => logout()}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </div>

      {/* 알림 설정 모달 */}
      <ReminderSettings
        open={isReminderOpen}
        onClose={() => setReminderOpen(false)}
      />
    </aside>
  )
}
