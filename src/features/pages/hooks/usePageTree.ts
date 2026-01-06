import { useMemo } from 'react'
import type { Page } from '@/shared/types'
import { usePages, useCreatePage, useUpdatePage, useDeletePage } from '../api/queries'
import { usePageStore } from '../stores/pageStore'

export interface PageTreeNode extends Page {
  children: PageTreeNode[]
  depth: number
}

/**
 * 페이지 목록을 트리 구조로 변환
 */
function buildPageTree(pages: Page[], parentId: string | null = null, depth = 0): PageTreeNode[] {
  return pages
    .filter((page) => page.parent_id === parentId)
    .map((page) => ({
      ...page,
      depth,
      children: buildPageTree(pages, page.id, depth + 1),
    }))
}

/**
 * Page Tree Model Hook
 * - 페이지 목록을 트리 구조로 제공
 * - 페이지 CRUD 액션 제공
 * - UI 상태 (확장/선택) 연동
 */
export function usePageTree() {
  // Server State
  const { data: pages = [], isLoading, error } = usePages()
  const createPageMutation = useCreatePage()
  const updatePageMutation = useUpdatePage()
  const deletePageMutation = useDeletePage()

  // UI State
  const {
    selectedPageId,
    expandedPageIds,
    setSelectedPageId,
    toggleExpanded,
    setExpanded,
  } = usePageStore()

  // 트리 구조로 변환
  const pageTree = useMemo(() => buildPageTree(pages), [pages])

  // 루트 페이지만 (parent_id === null)
  const rootPages = useMemo(
    () => pageTree.filter((node) => !node.is_database),
    [pageTree]
  )

  // 데이터베이스만
  const databases = useMemo(
    () => pages.filter((page) => page.is_database),
    [pages]
  )

  // Actions
  async function createPage(data: { title?: string; parent_id?: string; is_database?: boolean }) {
    const newPage = await createPageMutation.mutateAsync({
      title: data.title ?? '',
      parent_id: data.parent_id,
      is_database: data.is_database,
    })

    // 부모가 있으면 확장
    if (data.parent_id) {
      setExpanded(data.parent_id, true)
    }

    // 새 페이지 선택
    setSelectedPageId(newPage.id)

    return newPage
  }

  async function updatePage(id: string, data: { title?: string; icon?: string; parent_id?: string }) {
    return updatePageMutation.mutateAsync({ id, data })
  }

  async function deletePage(id: string) {
    // 선택된 페이지가 삭제되면 선택 해제
    if (selectedPageId === id) {
      setSelectedPageId(null)
    }
    return deletePageMutation.mutateAsync(id)
  }

  function isExpanded(pageId: string) {
    return expandedPageIds.has(pageId)
  }

  return {
    // Data
    pages,
    pageTree,
    rootPages,
    databases,
    isLoading,
    error,

    // Selection
    selectedPageId,
    setSelectedPageId,

    // Expansion
    isExpanded,
    toggleExpanded,
    setExpanded,

    // Actions
    createPage,
    updatePage,
    deletePage,

    // Mutation States
    isCreating: createPageMutation.isPending,
    isUpdating: updatePageMutation.isPending,
    isDeleting: deletePageMutation.isPending,
  }
}
