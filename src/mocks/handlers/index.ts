import { authHandlers } from './auth'
import { pageHandlers } from './pages'
import { blockHandlers } from './blocks'

export const handlers = [
  ...authHandlers,
  ...pageHandlers,
  ...blockHandlers,
]
