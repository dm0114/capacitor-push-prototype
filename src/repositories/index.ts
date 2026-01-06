import { MockPageRepository } from './implementations/mock/MockPageRepository'
import { MockBlockRepository } from './implementations/mock/MockBlockRepository'

// 환경별 Repository 선택
const useMock = import.meta.env.VITE_USE_MSW !== 'false'

// Repository 인스턴스 (싱글톤)
export const pageRepository = useMock
  ? new MockPageRepository()
  : new MockPageRepository() // TODO: SupabasePageRepository

export const blockRepository = useMock
  ? new MockBlockRepository()
  : new MockBlockRepository() // TODO: SupabaseBlockRepository

// Types
export type { IPageRepository } from './interfaces/IPageRepository'
export type { IBlockRepository } from './interfaces/IBlockRepository'
