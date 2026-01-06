import { authHandlers } from './auth'
import { pageHandlers } from './pages'
import { blockHandlers } from './blocks'
import { databaseHandlers } from './database'

export const handlers = [
  ...authHandlers,
  ...pageHandlers,
  ...blockHandlers,
  ...databaseHandlers,
]
