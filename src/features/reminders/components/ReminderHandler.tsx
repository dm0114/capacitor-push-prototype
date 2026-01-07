import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { onReminderTapped } from '../lib/notifications'
import { createReflectionPage } from '../lib/createReflectionPage'
import { pageKeys } from '@/features/pages'

/**
 * 알림 탭 핸들러
 * 앱 전역에서 알림 탭 이벤트를 처리
 */
export function ReminderHandler() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    const cleanup = onReminderTapped(async (data) => {
      if (data.type === 'reflection') {
        try {
          // 회고 페이지 생성
          const pageId = await createReflectionPage()

          // 페이지 캐시 무효화 (새 페이지 반영)
          await queryClient.invalidateQueries({ queryKey: pageKeys.all })

          // 생성된 페이지로 이동
          navigate({ to: '/app', search: { pageId } })
        } catch (error) {
          console.error('회고 페이지 생성 실패:', error)
        }
      }
    })

    return cleanup
  }, [navigate, queryClient])

  return null
}
