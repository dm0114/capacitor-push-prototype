import { ChevronRight, File, Folder, Database, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/button'
import type { PageTreeNode } from '../hooks/usePageTree'

interface PageTreeItemProps {
  node: PageTreeNode
  isSelected: boolean
  isExpanded: boolean
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onAddSubpage: (parentId: string) => void
  onDelete: (id: string) => void
}

export function PageTreeItem({
  node,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
  onAddSubpage,
  onDelete,
}: PageTreeItemProps) {
  const hasChildren = node.children.length > 0
  const paddingLeft = 12 + node.depth * 16

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    onSelect(node.id)
  }

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    onToggle(node.id)
  }

  function handleAddSubpage(e: React.MouseEvent) {
    e.stopPropagation()
    onAddSubpage(node.id)
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    onDelete(node.id)
  }

  const Icon = node.is_database ? Database : hasChildren ? Folder : File

  return (
    <div>
      <div
        className={cn(
          'group flex items-center h-8 rounded-md cursor-pointer text-sm',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          isSelected && 'bg-neutral-100 dark:bg-neutral-800'
        )}
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {/* Expand/Collapse 버튼 */}
        <button
          className={cn(
            'flex items-center justify-center w-5 h-5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700',
            !hasChildren && 'invisible'
          )}
          onClick={handleToggle}
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 text-neutral-400 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
        </button>

        {/* 아이콘 */}
        <span className="flex items-center justify-center w-5 h-5 mr-1">
          {node.icon ? (
            <span className="text-sm">{node.icon}</span>
          ) : (
            <Icon className="h-4 w-4 text-neutral-400" />
          )}
        </span>

        {/* 제목 */}
        <span className="flex-1 truncate text-neutral-700 dark:text-neutral-300">
          {node.title || 'Untitled'}
        </span>

        {/* 액션 버튼들 (hover 시 표시) */}
        <div className="hidden group-hover:flex items-center gap-0.5 pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleAddSubpage}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-neutral-400 hover:text-red-500"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 자식 페이지들 (확장 시) */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <PageTreeItem
              key={child.id}
              node={child}
              isSelected={false} // 부모에서 전달
              isExpanded={false} // 부모에서 전달
              onSelect={onSelect}
              onToggle={onToggle}
              onAddSubpage={onAddSubpage}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
