import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.arkilo.app',
  appName: 'Arkilo',
  webDir: 'dist',
  server: {
    // 개발 서버 연결 (개발 중에만 사용)
    // url: 'http://localhost:3004',
    // cleartext: true,
  },
  plugins: {
    // 키보드 설정
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
  },
  android: {
    backgroundColor: '#ffffff',
  },
}

export default config
