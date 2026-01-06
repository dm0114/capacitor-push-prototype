import { createFileRoute } from '@tanstack/react-router'
import { usePageStore, PageView } from '@/features/pages'

export const Route = createFileRoute('/app/')({
  component: AppHome,
})

function AppHome() {
  const { selectedPageId } = usePageStore()

  if (selectedPageId) {
    return <PageView pageId={selectedPageId} />
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
        페이지를 선택하세요
      </h2>
      <p className="text-neutral-500 max-w-sm">
        왼쪽 사이드바에서 페이지를 선택하거나 새 페이지를 만들어보세요.
      </p>
    </div>
  )
}
