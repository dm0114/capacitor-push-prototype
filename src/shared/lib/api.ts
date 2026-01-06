import { supabase, isSupabaseConfigured } from './supabase'

// 환경 변수로 MSW 사용 여부 결정
const useMsw = import.meta.env.VITE_USE_MSW === 'true' || !isSupabaseConfigured

/**
 * API 추상화 레이어
 * - MSW 모드: fetch로 /api/* 호출 (MSW가 인터셉트)
 * - Supabase 모드: Supabase 클라이언트 직접 사용
 */

// ===== Auth API =====
export const authApi = {
  async getCurrentUser() {
    if (useMsw) {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return null
      return res.json()
    }
    const { data } = await supabase.auth.getUser()
    return data.user
  },

  async login(provider: 'google' | 'github') {
    if (useMsw) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })
      return res.json()
    }
    return supabase.auth.signInWithOAuth({ provider })
  },

  async logout() {
    if (useMsw) {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      return res.json()
    }
    return supabase.auth.signOut()
  },
}

// ===== Pages API =====
export const pagesApi = {
  async list() {
    if (useMsw) {
      const res = await fetch('/api/pages')
      return res.json()
    }
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('position')
    if (error) throw error
    return data
  },

  async get(pageId: string) {
    if (useMsw) {
      const res = await fetch(`/api/pages/${pageId}`)
      if (!res.ok) throw new Error('Page not found')
      return res.json()
    }
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single()
    if (error) throw error
    return data
  },

  async create(page: { title?: string; parent_id?: string | null }) {
    if (useMsw) {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })
      return res.json()
    }
    const { data, error } = await supabase
      .from('pages')
      .insert(page)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(pageId: string, updates: Record<string, unknown>) {
    if (useMsw) {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.json()
    }
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(pageId: string) {
    if (useMsw) {
      const res = await fetch(`/api/pages/${pageId}`, { method: 'DELETE' })
      return res.json()
    }
    const { error } = await supabase.from('pages').delete().eq('id', pageId)
    if (error) throw error
    return { success: true }
  },
}

// ===== Blocks API =====
export const blocksApi = {
  async get(pageId: string) {
    if (useMsw) {
      const res = await fetch(`/api/pages/${pageId}/blocks`)
      if (!res.ok) return []
      return res.json()
    }
    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('position')
    if (error) throw error
    return data
  },

  async save(pageId: string, blocks: unknown) {
    if (useMsw) {
      const res = await fetch(`/api/pages/${pageId}/blocks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      })
      return res.json()
    }
    // Supabase: 페이지의 블록을 통째로 교체
    const { error: deleteError } = await supabase
      .from('blocks')
      .delete()
      .eq('page_id', pageId)
    if (deleteError) throw deleteError

    if (Array.isArray(blocks) && blocks.length > 0) {
      const { error: insertError } = await supabase.from('blocks').insert(
        blocks.map((block: unknown, index: number) => ({
          page_id: pageId,
          content: block,
          position: index,
        }))
      )
      if (insertError) throw insertError
    }
    return { success: true }
  },
}

// ===== Database API =====
export const databaseApi = {
  // Properties
  async getProperties(databaseId: string) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/properties`)
      return res.json()
    }
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('database_id', databaseId)
      .order('position')
    if (error) throw error
    return data
  },

  async createProperty(
    databaseId: string,
    property: { name: string; type: string; config?: Record<string, unknown> }
  ) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      })
      return res.json()
    }
    const { data, error } = await supabase
      .from('properties')
      .insert({ ...property, database_id: databaseId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Rows
  async getRows(databaseId: string) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/rows`)
      return res.json()
    }
    const { data, error } = await supabase
      .from('database_pages')
      .select('*, property_values(*)')
      .eq('database_id', databaseId)
    if (error) throw error
    // 값을 { propertyId: value } 형태로 변환
    return data.map((row) => ({
      ...row,
      values: Object.fromEntries(
        (row.property_values || []).map((pv: { property_id: string; value: unknown }) => [
          pv.property_id,
          pv.value,
        ])
      ),
    }))
  },

  async createRow(
    databaseId: string,
    row: { title?: string; values?: Record<string, unknown> }
  ) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/rows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      })
      return res.json()
    }
    // Supabase: database_pages + property_values 생성
    const { data: newRow, error: rowError } = await supabase
      .from('database_pages')
      .insert({ database_id: databaseId, title: row.title ?? '' })
      .select()
      .single()
    if (rowError) throw rowError

    if (row.values) {
      const { error: valuesError } = await supabase.from('property_values').insert(
        Object.entries(row.values).map(([propId, value]) => ({
          page_id: newRow.id,
          property_id: propId,
          value,
        }))
      )
      if (valuesError) throw valuesError
    }
    return { ...newRow, values: row.values ?? {} }
  },

  async updateRow(rowId: string, values: Record<string, unknown>) {
    if (useMsw) {
      const res = await fetch(`/api/rows/${rowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      })
      return res.json()
    }
    // Supabase: property_values upsert
    for (const [propId, value] of Object.entries(values)) {
      const { error } = await supabase.from('property_values').upsert(
        {
          page_id: rowId,
          property_id: propId,
          value,
        },
        { onConflict: 'page_id,property_id' }
      )
      if (error) throw error
    }
    return { id: rowId, values }
  },

  async deleteRow(rowId: string) {
    if (useMsw) {
      const res = await fetch(`/api/rows/${rowId}`, { method: 'DELETE' })
      return res.json()
    }
    const { error } = await supabase.from('database_pages').delete().eq('id', rowId)
    if (error) throw error
    return { success: true }
  },

  // Views
  async getViews(databaseId: string) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/views`)
      return res.json()
    }
    const { data, error } = await supabase
      .from('views')
      .select('*')
      .eq('database_id', databaseId)
      .order('position')
    if (error) throw error
    return data
  },

  async createView(
    databaseId: string,
    view: { name: string; type: string; config?: Record<string, unknown> }
  ) {
    if (useMsw) {
      const res = await fetch(`/api/databases/${databaseId}/views`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(view),
      })
      return res.json()
    }
    const { data, error } = await supabase
      .from('views')
      .insert({ ...view, database_id: databaseId })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateView(viewId: string, updates: Record<string, unknown>) {
    if (useMsw) {
      const res = await fetch(`/api/views/${viewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.json()
    }
    const { data, error } = await supabase
      .from('views')
      .update(updates)
      .eq('id', viewId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
