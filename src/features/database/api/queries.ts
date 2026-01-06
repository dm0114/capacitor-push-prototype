import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Property, View } from '@/shared/types'

// ===== Types =====
export interface SelectOption {
  id: string
  name: string
  color: string
}

export interface PropertyWithOptions extends Property {
  options?: SelectOption[]
}

export interface DatabaseRow {
  id: string
  database_id: string
  title: string
  values: Record<string, unknown>
}

// ===== Query Keys =====
export const databaseKeys = {
  all: ['database'] as const,
  properties: (dbId: string) => [...databaseKeys.all, 'properties', dbId] as const,
  rows: (dbId: string) => [...databaseKeys.all, 'rows', dbId] as const,
  views: (dbId: string) => [...databaseKeys.all, 'views', dbId] as const,
}

// ===== API Functions =====
async function fetchProperties(dbId: string): Promise<PropertyWithOptions[]> {
  const response = await fetch(`/api/databases/${dbId}/properties`)
  if (!response.ok) throw new Error('Failed to fetch properties')
  return response.json()
}

async function fetchRows(dbId: string): Promise<DatabaseRow[]> {
  const response = await fetch(`/api/databases/${dbId}/rows`)
  if (!response.ok) throw new Error('Failed to fetch rows')
  return response.json()
}

async function fetchViews(dbId: string): Promise<View[]> {
  const response = await fetch(`/api/databases/${dbId}/views`)
  if (!response.ok) throw new Error('Failed to fetch views')
  return response.json()
}

async function createRow(params: { dbId: string; title?: string; values?: Record<string, unknown> }): Promise<DatabaseRow> {
  const response = await fetch(`/api/databases/${params.dbId}/rows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: params.title, values: params.values }),
  })
  if (!response.ok) throw new Error('Failed to create row')
  return response.json()
}

async function updateRow(params: { rowId: string; values: Record<string, unknown> }): Promise<DatabaseRow> {
  const response = await fetch(`/api/rows/${params.rowId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: params.values }),
  })
  if (!response.ok) throw new Error('Failed to update row')
  return response.json()
}

async function deleteRow(rowId: string): Promise<void> {
  const response = await fetch(`/api/rows/${rowId}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete row')
}

// ===== Queries =====
export function useProperties(dbId: string) {
  return useQuery({
    queryKey: databaseKeys.properties(dbId),
    queryFn: () => fetchProperties(dbId),
    enabled: !!dbId,
  })
}

export function useRows(dbId: string) {
  return useQuery({
    queryKey: databaseKeys.rows(dbId),
    queryFn: () => fetchRows(dbId),
    enabled: !!dbId,
  })
}

export function useViews(dbId: string) {
  return useQuery({
    queryKey: databaseKeys.views(dbId),
    queryFn: () => fetchViews(dbId),
    enabled: !!dbId,
  })
}

// ===== Mutations =====
export function useCreateRow(dbId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { title?: string; values?: Record<string, unknown> }) =>
      createRow({ dbId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(dbId) })
    },
  })
}

export function useUpdateRow(dbId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRow,
    onMutate: async ({ rowId, values }) => {
      await queryClient.cancelQueries({ queryKey: databaseKeys.rows(dbId) })

      const previousRows = queryClient.getQueryData<DatabaseRow[]>(databaseKeys.rows(dbId))

      // Optimistic update
      queryClient.setQueryData<DatabaseRow[]>(databaseKeys.rows(dbId), (old) =>
        old?.map((row) =>
          row.id === rowId ? { ...row, values: { ...row.values, ...values } } : row
        )
      )

      return { previousRows }
    },
    onError: (_, __, context) => {
      if (context?.previousRows) {
        queryClient.setQueryData(databaseKeys.rows(dbId), context.previousRows)
      }
    },
  })
}

export function useDeleteRow(dbId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: databaseKeys.rows(dbId) })
    },
  })
}
