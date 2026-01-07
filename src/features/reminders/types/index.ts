/**
 * 회고 리마인더 설정
 */
export interface ReminderConfig {
  /** 알림 활성화 여부 */
  enabled: boolean
  /** 알림 시간 (0-23) */
  hour: number
  /** 알림 분 (0-59) */
  minute: number
  /** 반복 요일 (0=일, 1=월, ..., 6=토) */
  days: number[]
  /** 알림 제목 */
  title: string
  /** 알림 본문 */
  body: string
}

/**
 * 예약된 알림 정보
 */
export interface ScheduledReminder {
  id: number
  config: ReminderConfig
  nextTrigger: Date
}

/**
 * 기본 리마인더 설정
 */
export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  enabled: false,
  hour: 21,
  minute: 0,
  days: [1, 2, 3, 4, 5], // 평일
  title: '오늘 하루 어땠나요?',
  body: '잠시 멈추고 오늘을 돌아보세요',
}

/**
 * 알림 ID 상수
 */
export const REMINDER_NOTIFICATION_ID = 1001
