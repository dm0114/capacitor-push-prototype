// Types
export { DEFAULT_REMINDER_CONFIG, REMINDER_NOTIFICATION_ID } from './types'
export type { ReminderConfig, ScheduledReminder } from './types'

// API
export {
  reminderKeys,
  useReminderConfig,
  useUpdateReminderConfig,
  useToggleReminder,
} from './api/queries'

// Components
export { ReminderSettings } from './components/ReminderSettings'
export { ReminderHandler } from './components/ReminderHandler'

// Lib
export {
  requestPermission,
  scheduleReminder,
  cancelReminder,
  getScheduledReminders,
  onReminderTapped,
  sendTestNotification,
} from './lib/notifications'
export { createReflectionPage } from './lib/createReflectionPage'
