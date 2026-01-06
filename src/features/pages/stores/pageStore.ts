import { create } from 'zustand'

interface PageUIState {
  // 선택된 페이지
  selectedPageId: string | null

  // 사이드바 상태
  isSidebarOpen: boolean
  sidebarWidth: number

  // 확장된 폴더 (중첩 페이지)
  expandedPageIds: Set<string>

  // 드래그 상태
  draggingPageId: string | null

  // 액션
  setSelectedPageId: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarWidth: (width: number) => void
  toggleExpanded: (pageId: string) => void
  setExpanded: (pageId: string, expanded: boolean) => void
  setDraggingPageId: (id: string | null) => void
}

export const usePageStore = create<PageUIState>((set) => ({
  selectedPageId: null,
  isSidebarOpen: true,
  sidebarWidth: 240,
  expandedPageIds: new Set(),
  draggingPageId: null,

  setSelectedPageId: (selectedPageId) => set({ selectedPageId }),

  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

  toggleExpanded: (pageId) =>
    set((state) => {
      const newSet = new Set(state.expandedPageIds)
      if (newSet.has(pageId)) {
        newSet.delete(pageId)
      } else {
        newSet.add(pageId)
      }
      return { expandedPageIds: newSet }
    }),

  setExpanded: (pageId, expanded) =>
    set((state) => {
      const newSet = new Set(state.expandedPageIds)
      if (expanded) {
        newSet.add(pageId)
      } else {
        newSet.delete(pageId)
      }
      return { expandedPageIds: newSet }
    }),

  setDraggingPageId: (draggingPageId) => set({ draggingPageId }),
}))
