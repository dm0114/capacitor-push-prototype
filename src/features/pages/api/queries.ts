import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Page, CreatePageDto, UpdatePageDto } from '@/shared/types'

// Query Keys
export const pageKeys = {
  all: ['pages'] as const,
  lists: () => [...pageKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...pageKeys.lists(), filters] as const,
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageKeys.details(), id] as const,
}

// API 함수
async function fetchPages(params?: { parentId?: string | null; databaseId?: string }): Promise<Page[]> {
  const searchParams = new URLSearchParams()

  if (params?.parentId !== undefined) {
    searchParams.set('parentId', params.parentId === null ? 'null' : params.parentId)
  }
  if (params?.databaseId) {
    searchParams.set('databaseId', params.databaseId)
  }

  const url = searchParams.toString() ? `/api/pages?${searchParams}` : '/api/pages'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch pages')
  }

  return response.json()
}

async function fetchPage(id: string): Promise<Page> {
  const response = await fetch(`/api/pages/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch page')
  }

  return response.json()
}

async function createPage(data: CreatePageDto): Promise<Page> {
  const response = await fetch('/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create page')
  }

  return response.json()
}

async function updatePage({ id, data }: { id: string; data: UpdatePageDto }): Promise<Page> {
  const response = await fetch(`/api/pages/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update page')
  }

  return response.json()
}

async function deletePage(id: string): Promise<void> {
  const response = await fetch(`/api/pages/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete page')
  }
}

// Queries
export function usePages(params?: { parentId?: string | null; databaseId?: string }) {
  return useQuery({
    queryKey: pageKeys.list(params ?? {}),
    queryFn: () => fetchPages(params),
  })
}

export function usePage(id: string) {
  return useQuery({
    queryKey: pageKeys.detail(id),
    queryFn: () => fetchPage(id),
    enabled: !!id,
  })
}

// Mutations
export function useCreatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPage,
    onSuccess: (newPage) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() })
      // 새 페이지 캐시에 추가
      queryClient.setQueryData(pageKeys.detail(newPage.id), newPage)
    },
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePage,
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: pageKeys.detail(id) })
      const previousPage = queryClient.getQueryData<Page>(pageKeys.detail(id))

      if (previousPage) {
        queryClient.setQueryData(pageKeys.detail(id), {
          ...previousPage,
          ...data,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousPage }
    },
    onError: (_, { id }, context) => {
      // Rollback on error
      if (context?.previousPage) {
        queryClient.setQueryData(pageKeys.detail(id), context.previousPage)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePage,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: pageKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: pageKeys.lists() })
    },
  })
}
