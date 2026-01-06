// Components
export { AppShell } from './components/AppShell'
export { Sidebar } from './components/Sidebar'
export { PageTree } from './components/PageTree'
export { PageTreeItem } from './components/PageTreeItem'
export { PageView } from './components/PageView'

// Hooks
export { usePageTree } from './hooks/usePageTree'
export type { PageTreeNode } from './hooks/usePageTree'

// Store
export { usePageStore } from './stores/pageStore'

// API (for advanced use cases)
export {
  usePages,
  usePage,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  pageKeys,
} from './api/queries'
