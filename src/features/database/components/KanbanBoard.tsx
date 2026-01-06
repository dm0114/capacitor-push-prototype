import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, GripVertical } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import {
  useProperties,
  useRows,
  useCreateRow,
  useUpdateRow,
  type DatabaseRow,
  type SelectOption,
} from '../api/queries'

interface KanbanBoardProps {
  databaseId: string
  groupByPropertyId?: string
}

export function KanbanBoard({ databaseId, groupByPropertyId }: KanbanBoardProps) {
  const { data: properties = [] } = useProperties(databaseId)
  const { data: rows = [], isLoading } = useRows(databaseId)
  const createRow = useCreateRow(databaseId)
  const updateRow = useUpdateRow(databaseId)

  const [activeId, setActiveId] = useState<string | null>(null)

  // 그룹화할 속성 찾기 (기본: 첫 번째 select 타입)
  const groupProperty = useMemo(() => {
    if (groupByPropertyId) {
      return properties.find((p) => p.id === groupByPropertyId)
    }
    return properties.find((p) => p.type === 'select' && p.options?.length)
  }, [properties, groupByPropertyId])

  // 컬럼별로 그룹화
  const columns = useMemo(() => {
    if (!groupProperty?.options) return []

    const grouped: Array<{
      option: SelectOption
      rows: DatabaseRow[]
    }> = groupProperty.options.map((opt) => ({
      option: opt,
      rows: rows.filter((row) => row.values[groupProperty.id] === opt.id),
    }))

    // 값이 없는 항목들
    const unassigned = rows.filter(
      (row) => !row.values[groupProperty.id] ||
        !groupProperty.options?.some((opt) => opt.id === row.values[groupProperty.id])
    )

    if (unassigned.length > 0) {
      grouped.unshift({
        option: { id: '__unassigned__', name: 'No Status', color: 'gray' },
        rows: unassigned,
      })
    }

    return grouped
  }, [groupProperty, rows])

  // DnD 센서
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || !groupProperty) return

    const activeRow = rows.find((r) => r.id === active.id)
    if (!activeRow) return

    // over.id가 컬럼 ID인 경우 (카드를 컬럼에 드롭)
    const targetColumnId = String(over.id).startsWith('column-')
      ? String(over.id).replace('column-', '')
      : null

    // over.id가 카드 ID인 경우 (카드를 다른 카드 위에 드롭)
    const overRow = rows.find((r) => r.id === over.id)
    const newColumnId = targetColumnId || (overRow
      ? String(overRow.values[groupProperty.id] ?? '__unassigned__')
      : null)

    if (newColumnId && newColumnId !== '__unassigned__') {
      const currentValue = activeRow.values[groupProperty.id]
      if (currentValue !== newColumnId) {
        updateRow.mutate({
          rowId: activeRow.id,
          values: { [groupProperty.id]: newColumnId },
        })
      }
    }
  }

  const activeRow = activeId ? rows.find((r) => r.id === activeId) : null
  const titleProperty = properties.find((p) => p.type === 'title')

  if (isLoading) {
    return <div className="py-8 text-center text-neutral-400">로딩 중...</div>
  }

  if (!groupProperty) {
    return (
      <div className="py-8 text-center text-neutral-400">
        칸반 보드를 표시하려면 Select 타입 속성이 필요합니다.
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.option.id}
            option={column.option}
            rows={column.rows}
            titlePropertyId={titleProperty?.id}
            onAddCard={() => {
              createRow.mutate({
                values: column.option.id !== '__unassigned__'
                  ? { [groupProperty.id]: column.option.id }
                  : {},
              })
            }}
          />
        ))}
      </div>

      <DragOverlay>
        {activeRow && titleProperty && (
          <KanbanCard
            row={activeRow}
            titlePropertyId={titleProperty.id}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

// ===== Kanban Column =====
interface KanbanColumnProps {
  option: SelectOption
  rows: DatabaseRow[]
  titlePropertyId?: string
  onAddCard: () => void
}

function KanbanColumn({ option, rows, titlePropertyId, onAddCard }: KanbanColumnProps) {
  const columnId = `column-${option.id}`

  return (
    <div className="flex-shrink-0 w-72 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              option.color === 'gray' && 'bg-neutral-400',
              option.color === 'blue' && 'bg-blue-500',
              option.color === 'green' && 'bg-green-500',
              option.color === 'yellow' && 'bg-yellow-500',
              option.color === 'red' && 'bg-red-500'
            )}
          />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {option.name}
          </span>
          <span className="text-xs text-neutral-400">{rows.length}</span>
        </div>
      </div>

      {/* 카드 목록 */}
      <SortableContext
        id={columnId}
        items={rows.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="px-2 pb-2 space-y-2 min-h-[100px]">
          {rows.map((row) => (
            <KanbanCard
              key={row.id}
              row={row}
              titlePropertyId={titlePropertyId}
            />
          ))}
        </div>
      </SortableContext>

      {/* 새 카드 추가 */}
      <button
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-b-lg"
        onClick={onAddCard}
      >
        <Plus className="h-4 w-4" />
        Add
      </button>
    </div>
  )
}

// ===== Kanban Card =====
interface KanbanCardProps {
  row: DatabaseRow
  titlePropertyId?: string
  isDragging?: boolean
}

function KanbanCard({ row, titlePropertyId, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: row.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const title = titlePropertyId ? String(row.values[titlePropertyId] ?? '') : row.title

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white dark:bg-neutral-950 rounded-md border border-neutral-200 dark:border-neutral-800',
        'p-3 cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700',
        'group',
        isDragging && 'shadow-lg'
      )}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-neutral-400" />
        </div>
        <div className="flex-1 text-sm">
          {title || <span className="text-neutral-400">Untitled</span>}
        </div>
      </div>
    </div>
  )
}
