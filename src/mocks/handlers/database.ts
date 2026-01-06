import { http, HttpResponse } from 'msw'
import { nanoid } from 'nanoid'
import type { Property, View } from '@/shared/types'

// ===== Property (컬럼 정의) =====
interface PropertyData extends Property {
  options?: Array<{ id: string; name: string; color: string }>
}

let properties: PropertyData[] = [
  {
    id: 'prop-title',
    database_id: 'db-1',
    name: 'Task',
    type: 'title',
    config: {},
    position: '1',
  },
  {
    id: 'prop-status',
    database_id: 'db-1',
    name: 'Status',
    type: 'select',
    config: {},
    position: '2',
    options: [
      { id: 'opt-1', name: 'Todo', color: 'gray' },
      { id: 'opt-2', name: 'In Progress', color: 'blue' },
      { id: 'opt-3', name: 'Done', color: 'green' },
    ],
  },
  {
    id: 'prop-priority',
    database_id: 'db-1',
    name: 'Priority',
    type: 'select',
    config: {},
    position: '3',
    options: [
      { id: 'pri-1', name: 'Low', color: 'gray' },
      { id: 'pri-2', name: 'Medium', color: 'yellow' },
      { id: 'pri-3', name: 'High', color: 'red' },
    ],
  },
  {
    id: 'prop-due',
    database_id: 'db-1',
    name: 'Due Date',
    type: 'date',
    config: {},
    position: '4',
  },
]

// ===== PropertyValue (셀 값) =====
interface PropertyValue {
  id: string
  page_id: string
  property_id: string
  value: unknown
}

let propertyValues: PropertyValue[] = [
  // Task 1
  { id: 'pv-1', page_id: 'task-1', property_id: 'prop-title', value: '프로젝트 기획서 작성' },
  { id: 'pv-2', page_id: 'task-1', property_id: 'prop-status', value: 'opt-2' },
  { id: 'pv-3', page_id: 'task-1', property_id: 'prop-priority', value: 'pri-3' },
  { id: 'pv-4', page_id: 'task-1', property_id: 'prop-due', value: '2025-01-15' },
  // Task 2
  { id: 'pv-5', page_id: 'task-2', property_id: 'prop-title', value: '디자인 시안 검토' },
  { id: 'pv-6', page_id: 'task-2', property_id: 'prop-status', value: 'opt-1' },
  { id: 'pv-7', page_id: 'task-2', property_id: 'prop-priority', value: 'pri-2' },
  { id: 'pv-8', page_id: 'task-2', property_id: 'prop-due', value: '2025-01-20' },
  // Task 3
  { id: 'pv-9', page_id: 'task-3', property_id: 'prop-title', value: '코드 리뷰' },
  { id: 'pv-10', page_id: 'task-3', property_id: 'prop-status', value: 'opt-3' },
  { id: 'pv-11', page_id: 'task-3', property_id: 'prop-priority', value: 'pri-1' },
  { id: 'pv-12', page_id: 'task-3', property_id: 'prop-due', value: '2025-01-10' },
  // Task 4
  { id: 'pv-13', page_id: 'task-4', property_id: 'prop-title', value: 'API 문서화' },
  { id: 'pv-14', page_id: 'task-4', property_id: 'prop-status', value: 'opt-1' },
  { id: 'pv-15', page_id: 'task-4', property_id: 'prop-priority', value: 'pri-2' },
  // Task 5
  { id: 'pv-16', page_id: 'task-5', property_id: 'prop-title', value: '테스트 작성' },
  { id: 'pv-17', page_id: 'task-5', property_id: 'prop-status', value: 'opt-2' },
  { id: 'pv-18', page_id: 'task-5', property_id: 'prop-priority', value: 'pri-3' },
]

// ===== View =====
let views: View[] = [
  {
    id: 'view-table',
    database_id: 'db-1',
    name: 'Table',
    type: 'table',
    config: {
      visibleProperties: ['prop-title', 'prop-status', 'prop-priority', 'prop-due'],
    },
    position: '1',
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'view-board',
    database_id: 'db-1',
    name: 'Board',
    type: 'board',
    config: {
      groupByProperty: 'prop-status',
    },
    position: '2',
    created_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'view-calendar',
    database_id: 'db-1',
    name: 'Calendar',
    type: 'calendar',
    config: {
      dateProperty: 'prop-due',
    },
    position: '3',
    created_at: '2025-01-01T00:00:00.000Z',
  },
]

// ===== Database Pages (rows) =====
// pages.ts의 initialPages에 추가해야 하지만, 여기서 별도 관리
let databasePages = [
  { id: 'task-1', database_id: 'db-1', title: '프로젝트 기획서 작성' },
  { id: 'task-2', database_id: 'db-1', title: '디자인 시안 검토' },
  { id: 'task-3', database_id: 'db-1', title: '코드 리뷰' },
  { id: 'task-4', database_id: 'db-1', title: 'API 문서화' },
  { id: 'task-5', database_id: 'db-1', title: '테스트 작성' },
]

export const databaseHandlers = [
  // ===== Properties =====
  http.get('/api/databases/:dbId/properties', ({ params }) => {
    const dbId = params.dbId as string
    const result = properties.filter((p) => p.database_id === dbId)
    return HttpResponse.json(result)
  }),

  http.post('/api/databases/:dbId/properties', async ({ params, request }) => {
    const dbId = params.dbId as string
    const body = await request.json() as Partial<PropertyData>

    const newProp: PropertyData = {
      id: nanoid(),
      database_id: dbId,
      name: body.name ?? 'New Property',
      type: body.type ?? 'text',
      config: body.config ?? {},
      position: String(properties.length + 1),
      options: body.options,
    }

    properties.push(newProp)
    return HttpResponse.json(newProp, { status: 201 })
  }),

  http.patch('/api/properties/:propId', async ({ params, request }) => {
    const propId = params.propId as string
    const body = await request.json() as Partial<PropertyData>

    const index = properties.findIndex((p) => p.id === propId)
    if (index === -1) {
      return HttpResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    properties[index] = { ...properties[index], ...body }
    return HttpResponse.json(properties[index])
  }),

  // ===== Property Values =====
  http.get('/api/databases/:dbId/rows', ({ params }) => {
    const dbId = params.dbId as string
    const rows = databasePages.filter((p) => p.database_id === dbId)

    // 각 row에 propertyValues 첨부
    const result = rows.map((row) => {
      const values: Record<string, unknown> = {}
      propertyValues
        .filter((pv) => pv.page_id === row.id)
        .forEach((pv) => {
          values[pv.property_id] = pv.value
        })
      return { ...row, values }
    })

    return HttpResponse.json(result)
  }),

  http.post('/api/databases/:dbId/rows', async ({ params, request }) => {
    const dbId = params.dbId as string
    const body = await request.json() as { title?: string; values?: Record<string, unknown> }

    const newRow = {
      id: nanoid(),
      database_id: dbId,
      title: body.title ?? '',
    }

    databasePages.push(newRow)

    // PropertyValues 생성
    if (body.values) {
      Object.entries(body.values).forEach(([propId, value]) => {
        propertyValues.push({
          id: nanoid(),
          page_id: newRow.id,
          property_id: propId,
          value,
        })
      })
    }

    return HttpResponse.json({ ...newRow, values: body.values ?? {} }, { status: 201 })
  }),

  http.patch('/api/rows/:rowId', async ({ params, request }) => {
    const rowId = params.rowId as string
    const body = await request.json() as { values?: Record<string, unknown> }

    const row = databasePages.find((r) => r.id === rowId)
    if (!row) {
      return HttpResponse.json({ error: 'Row not found' }, { status: 404 })
    }

    // PropertyValues 업데이트
    if (body.values) {
      Object.entries(body.values).forEach(([propId, value]) => {
        const pvIndex = propertyValues.findIndex(
          (pv) => pv.page_id === rowId && pv.property_id === propId
        )
        if (pvIndex !== -1) {
          propertyValues[pvIndex].value = value
        } else {
          propertyValues.push({
            id: nanoid(),
            page_id: rowId,
            property_id: propId,
            value,
          })
        }
      })
    }

    // 응답에 현재 values 포함
    const values: Record<string, unknown> = {}
    propertyValues
      .filter((pv) => pv.page_id === rowId)
      .forEach((pv) => {
        values[pv.property_id] = pv.value
      })

    return HttpResponse.json({ ...row, values })
  }),

  http.delete('/api/rows/:rowId', ({ params }) => {
    const rowId = params.rowId as string
    const index = databasePages.findIndex((r) => r.id === rowId)

    if (index === -1) {
      return HttpResponse.json({ error: 'Row not found' }, { status: 404 })
    }

    databasePages.splice(index, 1)
    propertyValues = propertyValues.filter((pv) => pv.page_id !== rowId)

    return HttpResponse.json({ success: true })
  }),

  // ===== Views =====
  http.get('/api/databases/:dbId/views', ({ params }) => {
    const dbId = params.dbId as string
    const result = views.filter((v) => v.database_id === dbId)
    return HttpResponse.json(result)
  }),

  http.post('/api/databases/:dbId/views', async ({ params, request }) => {
    const dbId = params.dbId as string
    const body = await request.json() as Partial<View>

    const newView: View = {
      id: nanoid(),
      database_id: dbId,
      name: body.name ?? 'New View',
      type: body.type ?? 'table',
      config: body.config ?? {},
      position: String(views.length + 1),
      created_at: new Date().toISOString(),
    }

    views.push(newView)
    return HttpResponse.json(newView, { status: 201 })
  }),

  http.patch('/api/views/:viewId', async ({ params, request }) => {
    const viewId = params.viewId as string
    const body = await request.json() as Partial<View>

    const index = views.findIndex((v) => v.id === viewId)
    if (index === -1) {
      return HttpResponse.json({ error: 'View not found' }, { status: 404 })
    }

    views[index] = { ...views[index], ...body }
    return HttpResponse.json(views[index])
  }),
]
