import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Safe Area 인셋을 반환하는 훅
 * - iOS 노치, 홈 인디케이터 영역 처리
 * - Android 시스템 바 영역 처리
 */
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    // 네이티브 플랫폼에서만 Safe Area 적용
    if (!Capacitor.isNativePlatform()) {
      return
    }

    // CSS env() 변수에서 Safe Area 값 읽기
    function updateSafeArea() {
      const computedStyle = getComputedStyle(document.documentElement)

      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10),
      })
    }

    // CSS 변수로 Safe Area 값 설정
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)')
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)')
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)')
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)')

    updateSafeArea()

    window.addEventListener('resize', updateSafeArea)
    return () => window.removeEventListener('resize', updateSafeArea)
  }, [])

  return insets
}

/**
 * 현재 플랫폼 정보
 */
export function usePlatform() {
  const platform = Capacitor.getPlatform()
  const isNative = Capacitor.isNativePlatform()

  return {
    platform, // 'ios' | 'android' | 'web'
    isNative,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    isWeb: platform === 'web',
  }
}
