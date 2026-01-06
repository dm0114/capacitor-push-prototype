import type { IPlatform, SafeAreaInsets } from '../interfaces/IPlatform'

export class WebPlatform implements IPlatform {
  type = 'web' as const
  isNative = false
  isMobile = false
  isDesktop = true

  constructor() {
    // 모바일 브라우저 감지
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    this.isDesktop = !this.isMobile
  }

  async getSafeAreaInsets(): Promise<SafeAreaInsets> {
    // CSS env() 값을 읽어옴
    const style = getComputedStyle(document.documentElement)
    return {
      top: parseInt(style.getPropertyValue('--sat') || '0', 10),
      bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
      left: parseInt(style.getPropertyValue('--sal') || '0', 10),
      right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    }
  }

  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
}
