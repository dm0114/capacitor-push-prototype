import { useState, useEffect } from 'react'
import { Loader2, Smile } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { BlockEditor } from '@/features/blocks'
import { DatabaseView } from '@/features/database'
import { usePage, useUpdatePage } from '../api/queries'

interface PageViewProps {
  pageId: string
}

export function PageView({ pageId }: PageViewProps) {
  const { data: page, isLoading, error } = usePage(pageId)
  const updatePage = useUpdatePage()

  const [title, setTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  // 페이지 데이터로 초기화
  useEffect(() => {
    if (page) {
      setTitle(page.title)
    }
  }, [page])

  // 제목 저장 (debounce 또는 blur 시)
  function handleTitleBlur() {
    setIsEditingTitle(false)
    if (page && title !== page.title) {
      updatePage.mutate({ id: pageId, data: { title } })
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500">
        <p>페이지를 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* 커버 이미지 영역 (있을 경우) */}
      {page.cover_image && (
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.cover_image})` }}
        />
      )}

      {/* 페이지 헤더 */}
      <div className="max-w-3xl mx-auto w-full px-12 pt-12 pb-4">
        {/* 아이콘 */}
        <div className="mb-4">
          {page.icon ? (
            <span className="text-6xl">{page.icon}</span>
          ) : (
            <Button variant="ghost" size="sm" className="text-neutral-400 -ml-2">
              <Smile className="h-4 w-4 mr-1" />
              아이콘 추가
            </Button>
          )}
        </div>

        {/* 제목 */}
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="w-full text-4xl font-bold bg-transparent outline-none placeholder:text-neutral-300"
            placeholder="Untitled"
            autoFocus
          />
        ) : (
          <h1
            className="text-4xl font-bold cursor-text hover:bg-neutral-100 dark:hover:bg-neutral-800 -mx-2 px-2 py-1 rounded"
            onClick={() => setIsEditingTitle(true)}
          >
            {page.title || 'Untitled'}
          </h1>
        )}
      </div>

      {/* 페이지 본문 */}
      <div className={page.is_database ? 'flex-1 overflow-hidden' : 'max-w-3xl mx-auto w-full px-12 pb-24 flex-1'}>
        {page.is_database ? (
          <DatabaseView databaseId={pageId} />
        ) : (
          <BlockEditor pageId={pageId} />
        )}
      </div>
    </div>
  )
}
