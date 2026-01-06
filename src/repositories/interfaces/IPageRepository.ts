import type { Page, CreatePageDto, UpdatePageDto } from '@/shared/types'

export interface IPageRepository {
  findAll(): Promise<Page[]>
  findById(id: string): Promise<Page | null>
  findByParentId(parentId: string | null): Promise<Page[]>
  findByDatabaseId(databaseId: string): Promise<Page[]>
  create(data: CreatePageDto): Promise<Page>
  update(id: string, data: UpdatePageDto): Promise<Page>
  delete(id: string): Promise<void>
}
