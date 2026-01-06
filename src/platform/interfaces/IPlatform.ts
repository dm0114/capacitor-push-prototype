export type PlatformType = 'web' | 'ios' | 'android' | 'electron'

export interface IPlatform {
  type: PlatformType
  isNative: boolean
  isMobile: boolean
  isDesktop: boolean

  // Safe Area
  getSafeAreaInsets(): Promise<SafeAreaInsets>

  // Storage
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>

  // Haptics (optional)
  hapticFeedback?(type: 'light' | 'medium' | 'heavy'): Promise<void>
}

export interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}
