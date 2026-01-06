import { useMemo, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

import { useProperties, useRows, useUpdateRow } from '@/features/database'

interface CalendarViewProps {
  databaseId: string
  datePropertyId?: string
}

export function CalendarView({ databaseId, datePropertyId }: CalendarViewProps) {
  const { data: properties = [] } = useProperties(databaseId)
  const { data: rows = [] } = useRows(databaseId)
  const updateRow = useUpdateRow(databaseId)

  // Date 속성 찾기
  const dateProperty = useMemo(() => {
    if (datePropertyId) {
      return properties.find((p) => p.id === datePropertyId)
    }
    return properties.find((p) => p.type === 'date')
  }, [properties, datePropertyId])

  // Title 속성 찾기
  const titleProperty = useMemo(() => {
    return properties.find((p) => p.type === 'title')
  }, [properties])

  // 이벤트 데이터 생성
  const events = useMemo(() => {
    if (!dateProperty || !titleProperty) return []

    return rows
      .filter((row) => row.values[dateProperty.id])
      .map((row) => {
        const dateValue = String(row.values[dateProperty.id])
        const title = String(row.values[titleProperty.id] ?? 'Untitled')

        return {
          id: row.id,
          title,
          start: dateValue,
          end: dateValue,
        }
      })
  }, [rows, dateProperty, titleProperty])

  // Schedule-X 캘린더 설정
  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewWeek()],
    events,
    callbacks: {
      onEventUpdate: (updatedEvent) => {
        if (dateProperty) {
          updateRow.mutate({
            rowId: String(updatedEvent.id),
            values: { [dateProperty.id]: updatedEvent.start },
          })
        }
      },
    },
  })

  // events가 변경되면 캘린더 업데이트
  useEffect(() => {
    if (calendar && events.length > 0) {
      calendar.events.set(events)
    }
  }, [calendar, events])

  if (!dateProperty) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-400">
        캘린더 뷰를 표시하려면 Date 타입 속성이 필요합니다.
      </div>
    )
  }

  return (
    <div className="h-full min-h-[500px]">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
