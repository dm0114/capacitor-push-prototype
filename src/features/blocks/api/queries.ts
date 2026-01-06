import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Block as BlockNoteBlock } from '@blocknote/core'

// Query Keys
export const blockKeys = {
  all: ['blocks'] as const,
  byPage: (pageId: string) => [...blockKeys.all, 'page', pageId] as const,
}

// API 함수
async function fetchBlocks(pageId: string): Promise<BlockNoteBlock[]> {
  const response = await fetch(`/api/pages/${pageId}/blocks`)

  if (!response.ok) {
    throw new Error('Failed to fetch blocks')
  }

  return response.json()
}

async function saveBlocks({ pageId, blocks }: { pageId: string; blocks: BlockNoteBlock[] }): Promise<void> {
  const response = await fetch(`/api/pages/${pageId}/blocks`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blocks),
  })

  if (!response.ok) {
    throw new Error('Failed to save blocks')
  }
}

// Queries
export function useBlocks(pageId: string) {
  return useQuery({
    queryKey: blockKeys.byPage(pageId),
    queryFn: () => fetchBlocks(pageId),
    enabled: !!pageId,
    staleTime: 1000 * 60 * 5, // 5분
  })
}

// Mutations
export function useSaveBlocks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveBlocks,
    onMutate: async ({ pageId, blocks }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: blockKeys.byPage(pageId) })
      const previousBlocks = queryClient.getQueryData<BlockNoteBlock[]>(blockKeys.byPage(pageId))

      queryClient.setQueryData(blockKeys.byPage(pageId), blocks)

      return { previousBlocks }
    },
    onError: (_, { pageId }, context) => {
      // Rollback
      if (context?.previousBlocks) {
        queryClient.setQueryData(blockKeys.byPage(pageId), context.previousBlocks)
      }
    },
    onSettled: () => {
      // Refetch 비활성화 (사용자 타이핑 중 방해 방지)
      // queryClient.invalidateQueries({ queryKey: blockKeys.byPage(pageId) })
    },
  })
}
