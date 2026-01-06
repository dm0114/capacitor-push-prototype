import type { IBlockRepository } from '@/repositories/interfaces/IBlockRepository'
import type { Block, CreateBlockDto, UpdateBlockDto } from '@/shared/types'

export class MockBlockRepository implements IBlockRepository {
  private baseUrl = '/api/blocks'

  async findByPageId(pageId: string): Promise<Block[]> {
    const res = await fetch(`${this.baseUrl}?pageId=${pageId}`)
    if (!res.ok) throw new Error('Failed to fetch blocks')
    return res.json()
  }

  async findById(id: string): Promise<Block | null> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch block')
    return res.json()
  }

  async create(data: CreateBlockDto): Promise<Block> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create block')
    return res.json()
  }

  async update(id: string, data: UpdateBlockDto): Promise<Block> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update block')
    return res.json()
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete block')
  }

  async bulkUpdate(blocks: Array<{ id: string; data: UpdateBlockDto }>): Promise<Block[]> {
    const res = await fetch(`${this.baseUrl}/bulk`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
    if (!res.ok) throw new Error('Failed to bulk update blocks')
    return res.json()
  }
}
