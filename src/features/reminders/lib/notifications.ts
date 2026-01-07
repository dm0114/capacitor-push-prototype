import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'
import type { ReminderConfig } from '../types'
import { REMINDER_NOTIFICATION_ID } from '../types'

/**
 * 알림 권한 요청
 */
export async function requestPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Reminder] 웹 환경 - 알림 권한 스킵')
    return true
  }

  const { display } = await LocalNotifications.requestPermissions()
  return display === 'granted'
}

/**
 * 회고 알림 예약
 */
export async function scheduleReminder(config: ReminderConfig): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Reminder] 웹 환경 - 알림 예약 스킵', config)
    return
  }

  // 기존 알림 취소
  await cancelReminder()

  if (!config.enabled || config.days.length === 0) {
    return
  }

  // 각 요일별로 알림 예약
  const notifications = config.days.map((day, index) => ({
    id: REMINDER_NOTIFICATION_ID + index,
    title: config.title,
    body: config.body,
    schedule: {
      on: {
        weekday: day === 0 ? 7 : day, // iOS: 1=월, 7=일
        hour: config.hour,
        minute: config.minute,
      },
      repeats: true,
      allowWhileIdle: true,
    },
    extra: {
      type: 'reflection',
    },
  }))

  await LocalNotifications.schedule({ notifications })
  console.log('[Reminder] 알림 예약 완료:', notifications.length, '개')
}

/**
 * 알림 취소
 */
export async function cancelReminder(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  // 모든 요일 알림 취소 (최대 7개)
  const ids = Array.from({ length: 7 }, (_, i) => ({
    id: REMINDER_NOTIFICATION_ID + i,
  }))

  await LocalNotifications.cancel({ notifications: ids })
}

/**
 * 예약된 알림 조회
 */
export async function getScheduledReminders() {
  if (!Capacitor.isNativePlatform()) {
    return []
  }

  const { notifications } = await LocalNotifications.getPending()
  return notifications.filter((n) => n.id >= REMINDER_NOTIFICATION_ID)
}

/**
 * 알림 탭 리스너 등록
 */
export function onReminderTapped(
  callback: (data: { type: string }) => void,
): () => void {
  if (!Capacitor.isNativePlatform()) {
    return () => {}
  }

  const listener = LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (action) => {
      const extra = action.notification.extra as { type?: string } | undefined
      if (extra?.type === 'reflection') {
        callback({ type: 'reflection' })
      }
    },
  )

  // cleanup 함수 반환
  return () => {
    listener.then((l) => l.remove())
  }
}

/**
 * 테스트 알림 (즉시 발송)
 */
export async function sendTestNotification(config: ReminderConfig): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('[Reminder] 테스트 알림:', config.title, config.body)
    alert(`테스트 알림: ${config.title}\n${config.body}`)
    return
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_NOTIFICATION_ID + 100, // 테스트용 별도 ID
        title: config.title,
        body: config.body,
        schedule: { at: new Date(Date.now() + 1000) }, // 1초 후
        extra: { type: 'reflection' },
      },
    ],
  })
}
