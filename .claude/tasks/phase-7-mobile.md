# Phase 7: 모바일 빌드 (Capacitor)

## Task 7.1: Capacitor 설치 + 초기화

### 작업 내용
```bash
pnpm add @capacitor/core @capacitor/cli
npx cap init Arkilo com.arkilo.app --web-dir dist
pnpm add @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### 산출물
- `capacitor.config.ts`
- `ios/` 폴더
- `android/` 폴더

---

## Task 7.2: Safe Area 처리

### 작업 내용
- [ ] @capacitor/status-bar 설치
- [ ] CSS safe-area-inset 적용
- [ ] useSafeArea 훅

### 산출물
- `src/shared/hooks/useSafeArea.ts`
- CSS 업데이트

### 코드
```typescript
// src/shared/hooks/useSafeArea.ts
import { StatusBar } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

export function useSafeArea() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true })
    }
  }, [])
}
```

```css
/* Safe Area CSS */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Task 7.3: 키보드 처리

### 작업 내용
- [ ] @capacitor/keyboard 설치
- [ ] 키보드 올라올 때 레이아웃 조정
- [ ] useKeyboard 훅

### 산출물
- `src/shared/hooks/useKeyboard.ts`

### 코드
```typescript
// src/shared/hooks/useKeyboard.ts
import { Keyboard } from '@capacitor/keyboard'
import { Capacitor } from '@capacitor/core'

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    Keyboard.addListener('keyboardWillShow', (info) => {
      setKeyboardHeight(info.keyboardHeight)
    })

    Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0)
    })

    return () => {
      Keyboard.removeAllListeners()
    }
  }, [])

  return { keyboardHeight }
}
```

---

## Task 7.4: 터치 제스처 최적화

### 작업 내용
```bash
pnpm add @use-gesture/react
```

- [ ] dnd-kit 터치 센서 튜닝
- [ ] 스와이프 제스처 추가 (사이드바)
- [ ] 롱프레스 컨텍스트 메뉴

### 산출물
- `src/shared/hooks/useSwipeGesture.ts`
- dnd-kit 센서 설정 업데이트

---

## Task 7.5: CapacitorPlatform 구현

### 작업 내용
- [ ] CapacitorPlatform 클래스
- [ ] 네이티브 API 래핑 (Storage, Haptics 등)

### 산출물
- `src/platform/implementations/CapacitorPlatform.ts`

---

## Task 7.6: 빌드 + 테스트

### 작업 내용
```bash
pnpm build
npx cap sync
npx cap open ios
npx cap open android
```

### 체크리스트
- [ ] iOS 시뮬레이터 테스트
- [ ] Android 에뮬레이터 테스트
- [ ] Safe Area 확인
- [ ] 키보드 동작 확인
- [ ] DnD 터치 동작 확인

---

## Task 7.7: 앱 아이콘 + 스플래시

### 작업 내용
- [ ] @capacitor/splash-screen 설정
- [ ] 앱 아이콘 생성 (1024x1024)
- [ ] 스플래시 이미지

### 산출물
- `resources/icon.png`
- `resources/splash.png`
- `capacitor.config.ts` 업데이트
