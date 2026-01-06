import { createContext, useContext, useMemo } from 'react'
import type { IPlatform } from './interfaces/IPlatform'
import { WebPlatform } from './implementations/WebPlatform'

const PlatformContext = createContext<IPlatform | null>(null)

function detectPlatform(): IPlatform {
  // TODO: Capacitor/Electron 감지 추가
  // if (Capacitor.isNativePlatform()) return new CapacitorPlatform()
  // if (window.electron) return new ElectronPlatform()
  return new WebPlatform()
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const platform = useMemo(() => detectPlatform(), [])

  return (
    <PlatformContext.Provider value={platform}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform(): IPlatform {
  const context = useContext(PlatformContext)
  if (!context) {
    throw new Error('usePlatform must be used within PlatformProvider')
  }
  return context
}
