import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useReminderConfig, useUpdateReminderConfig } from '../api/queries'
import { sendTestNotification } from '../lib/notifications'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

interface ReminderSettingsProps {
  open: boolean
  onClose: () => void
}

export function ReminderSettings({ open, onClose }: ReminderSettingsProps) {
  const { data: config } = useReminderConfig()
  const updateConfig = useUpdateReminderConfig()

  const [hour, setHour] = useState(config?.hour ?? 21)
  const [minute, setMinute] = useState(config?.minute ?? 0)
  const [days, setDays] = useState<number[]>(config?.days ?? [1, 2, 3, 4, 5])
  const [enabled, setEnabled] = useState(config?.enabled ?? false)

  if (!open) return null

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        enabled,
        hour,
        minute,
        days,
      })
      onClose()
    } catch (error) {
      alert(error instanceof Error ? error.message : '설정 저장 실패')
    }
  }

  const handleTest = async () => {
    if (!config) return
    await sendTestNotification({
      ...config,
      hour,
      minute,
      days,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-sm mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="font-medium">회고 알림 설정</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 본문 */}
        <div className="p-4 space-y-4">
          {/* 활성화 토글 */}
          <div className="flex items-center justify-between">
            <span className="text-sm">알림 받기</span>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled(!enabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                enabled ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  enabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* 시간 선택 */}
          <div className="flex items-center justify-between">
            <span className="text-sm">시간</span>
            <div className="flex items-center gap-1">
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1 text-sm"
              >
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 요일 선택 */}
          <div>
            <span className="text-sm block mb-2">반복 요일</span>
            <div className="flex gap-1">
              {DAYS.map((label, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    days.includes(index)
                      ? 'bg-blue-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 테스트 버튼 */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleTest}
          >
            테스트 알림 보내기
          </Button>
        </div>

        {/* 푸터 */}
        <div className="flex gap-2 px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={updateConfig.isPending}
          >
            {updateConfig.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  )
}
