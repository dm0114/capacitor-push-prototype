# Phase 5: 캘린더 뷰

## Task 5.1: Schedule-X 설치

### 작업 내용
```bash
pnpm add @schedule-x/react @schedule-x/calendar @schedule-x/drag-and-drop
```

### 산출물
- 의존성 설치 완료

---

## Task 5.2: CalendarView 컴포넌트

### 작업 내용
- [ ] Schedule-X 캘린더 통합
- [ ] Date 속성 기반 이벤트 표시
- [ ] 월/주/일 뷰 전환
- [ ] 노션 스타일 테마

### 산출물
- `src/features/calendar/components/CalendarView.tsx`
- `src/features/calendar/config/calendarConfig.ts`

### 코드
```tsx
// src/features/calendar/components/CalendarView.tsx
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

export function CalendarView({ databaseId }: { databaseId: string }) {
  const { events, updateEvent } = useCalendarModel(databaseId)

  const calendar = useCalendarApp({
    events,
    plugins: [createDragAndDropPlugin()],
    callbacks: {
      onEventUpdate: (event) => {
        updateEvent(event)
      },
    },
  })

  return <ScheduleXCalendar calendarApp={calendar} />
}
```

---

## Task 5.3: useCalendarModel

### 작업 내용
- [ ] DB 데이터 → 캘린더 이벤트 변환
- [ ] 이벤트 CRUD
- [ ] 날짜 변경 핸들러

### 산출물
- `src/features/calendar/models/useCalendarModel.ts`

---

## Task 5.4: EventModal 컴포넌트

### 작업 내용
- [ ] 이벤트 상세/편집 모달
- [ ] 날짜/시간 선택
- [ ] 속성 편집

### 산출물
- `src/features/calendar/components/EventModal.tsx`

---

## Task 5.5: DatabaseView에 CalendarView 통합

### 작업 내용
- [ ] ViewTabs에 Calendar 탭 추가
- [ ] date_property 설정 UI

### 산출물
- `src/features/database/components/DatabaseView.tsx` 수정
