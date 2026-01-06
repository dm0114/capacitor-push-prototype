import type { Block, CreateBlockDto, UpdateBlockDto } from '@/shared/types'

export interface IBlockRepository {
  findByPageId(pageId: string): Promise<Block[]>
  findById(id: string): Promise<Block | null>
  create(data: CreateBlockDto): Promise<Block>
  update(id: string, data: UpdateBlockDto): Promise<Block>
  delete(id: string): Promise<void>
  bulkUpdate(blocks: Array<{ id: string; data: UpdateBlockDto }>): Promise<Block[]>
}
