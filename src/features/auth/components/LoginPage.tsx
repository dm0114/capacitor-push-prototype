import { Github, Chrome, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login, isLoggingIn, error, clearError } = useAuth()

  async function handleSocialLogin(provider: string) {
    try {
      await login(provider)
    } catch {
      // 에러는 useAuth에서 처리됨
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Arkilo</CardTitle>
          <CardDescription>
            노션 스타일 플래닝 앱에 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 rounded-md">
              {error}
              <button
                onClick={clearError}
                className="ml-2 underline hover:no-underline"
              >
                닫기
              </button>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Chrome className="text-[#4285F4]" />
            )}
            Google로 로그인
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('github')}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Github />
            )}
            GitHub로 로그인
          </Button>

          <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 pt-4">
            로그인 시{' '}
            <a href="#" className="underline hover:no-underline">
              서비스 약관
            </a>
            과{' '}
            <a href="#" className="underline hover:no-underline">
              개인정보 처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
