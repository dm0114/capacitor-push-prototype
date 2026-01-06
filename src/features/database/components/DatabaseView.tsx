import { useState } from 'react'
import { Table, Columns, Calendar } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/button'
import { CalendarView } from '@/features/calendar'
import { useViews } from '../api/queries'
import { TableView } from './TableView'
import { KanbanBoard } from './KanbanBoard'

interface DatabaseViewProps {
  databaseId: string
}

export function DatabaseView({ databaseId }: DatabaseViewProps) {
  const { data: views = [] } = useViews(databaseId)
  const [activeViewId, setActiveViewId] = useState<string | null>(null)

  // 기본 뷰 설정
  const activeView = activeViewId
    ? views.find((v) => v.id === activeViewId)
    : views[0]

  const viewType = activeView?.type ?? 'table'

  return (
    <div className="flex flex-col h-full">
      {/* 뷰 탭 */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        {views.map((view) => (
          <Button
            key={view.id}
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2',
              activeView?.id === view.id && 'bg-neutral-100 dark:bg-neutral-800'
            )}
            onClick={() => setActiveViewId(view.id)}
          >
            {view.type === 'table' && <Table className="h-4 w-4" />}
            {view.type === 'board' && <Columns className="h-4 w-4" />}
            {view.type === 'calendar' && <Calendar className="h-4 w-4" />}
            {view.name}
          </Button>
        ))}
      </div>

      {/* 뷰 콘텐츠 */}
      <div className="flex-1 overflow-auto p-4">
        {viewType === 'table' && <TableView databaseId={databaseId} />}
        {viewType === 'board' && (
          <KanbanBoard
            databaseId={databaseId}
            groupByPropertyId={activeView?.config?.groupByProperty as string}
          />
        )}
        {viewType === 'calendar' && (
          <CalendarView
            databaseId={databaseId}
            datePropertyId={activeView?.config?.dateProperty as string}
          />
        )}
      </div>
    </div>
  )
}
