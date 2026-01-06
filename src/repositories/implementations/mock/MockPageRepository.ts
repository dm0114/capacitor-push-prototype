import type { IPageRepository } from '@/repositories/interfaces/IPageRepository'
import type { Page, CreatePageDto, UpdatePageDto } from '@/shared/types'

export class MockPageRepository implements IPageRepository {
  private baseUrl = '/api/pages'

  async findAll(): Promise<Page[]> {
    const res = await fetch(this.baseUrl)
    if (!res.ok) throw new Error('Failed to fetch pages')
    return res.json()
  }

  async findById(id: string): Promise<Page | null> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch page')
    return res.json()
  }

  async findByParentId(parentId: string | null): Promise<Page[]> {
    const param = parentId ?? 'null'
    const res = await fetch(`${this.baseUrl}?parentId=${param}`)
    if (!res.ok) throw new Error('Failed to fetch pages')
    return res.json()
  }

  async findByDatabaseId(databaseId: string): Promise<Page[]> {
    const res = await fetch(`${this.baseUrl}?databaseId=${databaseId}`)
    if (!res.ok) throw new Error('Failed to fetch pages')
    return res.json()
  }

  async create(data: CreatePageDto): Promise<Page> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create page')
    return res.json()
  }

  async update(id: string, data: UpdatePageDto): Promise<Page> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update page')
    return res.json()
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete page')
  }
}
