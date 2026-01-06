// ===== Page =====
export interface Page {
  id: string
  user_id: string
  parent_id: string | null
  database_id: string | null
  title: string
  icon?: string
  cover_image?: string
  is_database: boolean
  archived: boolean
  position: string
  created_at: string
  updated_at: string
}

export interface CreatePageDto {
  parent_id?: string | null
  database_id?: string | null
  title?: string
  icon?: string
  is_database?: boolean
}

export interface UpdatePageDto {
  title?: string
  icon?: string
  cover_image?: string
  archived?: boolean
  position?: string
}

// ===== Block =====
export type BlockType =
  | 'text'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list'
  | 'numbered_list'
  | 'todo'
  | 'toggle'
  | 'quote'
  | 'divider'
  | 'callout'
  | 'code'
  | 'image'
  | 'database_reference'

export interface Block {
  id: string
  page_id: string
  parent_block_id: string | null
  type: BlockType
  content: Record<string, unknown>
  position: string
  created_at: string
  updated_at: string
}

export interface CreateBlockDto {
  page_id: string
  parent_block_id?: string | null
  type: BlockType
  content?: Record<string, unknown>
  position?: string
}

export interface UpdateBlockDto {
  type?: BlockType
  content?: Record<string, unknown>
  position?: string
}

// ===== User =====
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

// ===== Property =====
export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'relation'

export interface Property {
  id: string
  database_id: string
  name: string
  type: PropertyType
  config: Record<string, unknown>
  position: string
}

// ===== View =====
export type ViewType = 'table' | 'board' | 'calendar' | 'gallery' | 'list'

export interface View {
  id: string
  database_id: string
  name: string
  type: ViewType
  config: Record<string, unknown>
  position: string
  created_at: string
}
