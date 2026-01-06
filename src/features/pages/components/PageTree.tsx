import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { usePageTree } from '../hooks/usePageTree'
import { PageTreeItem } from './PageTreeItem'

export function PageTree() {
  const {
    rootPages,
    databases,
    isLoading,
    selectedPageId,
    setSelectedPageId,
    isExpanded,
    toggleExpanded,
    createPage,
    deletePage,
    isCreating,
  } = usePageTree()

  async function handleAddPage() {
    await createPage({ title: '' })
  }

  async function handleAddDatabase() {
    await createPage({ title: '', is_database: true })
  }

  async function handleAddSubpage(parentId: string) {
    await createPage({ parent_id: parentId })
  }

  async function handleDelete(id: string) {
    if (confirm('이 페이지를 삭제하시겠습니까?')) {
      await deletePage(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 페이지 섹션 */}
      <div className="px-2 py-2">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            페이지
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleAddPage}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        <div className="space-y-0.5">
          {rootPages.map((node) => (
            <PageTreeItem
              key={node.id}
              node={node}
              isSelected={selectedPageId === node.id}
              isExpanded={isExpanded(node.id)}
              onSelect={setSelectedPageId}
              onToggle={toggleExpanded}
              onAddSubpage={handleAddSubpage}
              onDelete={handleDelete}
            />
          ))}

          {rootPages.length === 0 && (
            <p className="px-2 py-4 text-sm text-neutral-400 text-center">
              페이지가 없습니다
            </p>
          )}
        </div>
      </div>

      {/* 데이터베이스 섹션 */}
      <div className="px-2 py-2 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            데이터베이스
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleAddDatabase}
            disabled={isCreating}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-0.5">
          {databases.map((db) => (
            <PageTreeItem
              key={db.id}
              node={{ ...db, children: [], depth: 0 }}
              isSelected={selectedPageId === db.id}
              isExpanded={false}
              onSelect={setSelectedPageId}
              onToggle={() => {}}
              onAddSubpage={() => {}}
              onDelete={handleDelete}
            />
          ))}

          {databases.length === 0 && (
            <p className="px-2 py-4 text-sm text-neutral-400 text-center">
              데이터베이스가 없습니다
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
