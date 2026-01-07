import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ReminderConfig } from '../types'
import { DEFAULT_REMINDER_CONFIG } from '../types'
import { scheduleReminder, requestPermission } from '../lib/notifications'

const STORAGE_KEY = 'arkilo_reminder_config'

/**
 * Query Keys
 */
export const reminderKeys = {
  all: ['reminders'] as const,
  config: () => [...reminderKeys.all, 'config'] as const,
}

/**
 * localStorage에서 설정 읽기
 */
function getStoredConfig(): ReminderConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_REMINDER_CONFIG, ...JSON.parse(stored) }
    }
  } catch {
    // 파싱 실패 시 기본값
  }
  return DEFAULT_REMINDER_CONFIG
}

/**
 * localStorage에 설정 저장
 */
function saveConfig(config: ReminderConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

/**
 * 리마인더 설정 조회 훅
 */
export function useReminderConfig() {
  return useQuery({
    queryKey: reminderKeys.config(),
    queryFn: () => getStoredConfig(),
    staleTime: Infinity, // localStorage는 항상 최신
  })
}

/**
 * 리마인더 설정 업데이트 훅
 */
export function useUpdateReminderConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newConfig: Partial<ReminderConfig>) => {
      const currentConfig = getStoredConfig()
      const updatedConfig = { ...currentConfig, ...newConfig }

      // 알림 활성화 시 권한 요청
      if (updatedConfig.enabled && !currentConfig.enabled) {
        const granted = await requestPermission()
        if (!granted) {
          throw new Error('알림 권한이 거부되었습니다')
        }
      }

      // localStorage 저장
      saveConfig(updatedConfig)

      // OS 알림 스케줄 업데이트
      await scheduleReminder(updatedConfig)

      return updatedConfig
    },
    onSuccess: (updatedConfig) => {
      queryClient.setQueryData(reminderKeys.config(), updatedConfig)
    },
  })
}

/**
 * 리마인더 토글 (빠른 on/off)
 */
export function useToggleReminder() {
  const updateConfig = useUpdateReminderConfig()

  return useMutation({
    mutationFn: async () => {
      const currentConfig = getStoredConfig()
      return updateConfig.mutateAsync({ enabled: !currentConfig.enabled })
    },
  })
}
