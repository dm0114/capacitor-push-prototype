# Phase 0: 프로젝트 기반 설정

## Task 0.1: 프로젝트 구조 리팩토링

### 작업 내용
- [ ] `src/app/` 폴더 생성 (providers.tsx, router.tsx)
- [ ] `src/features/` 폴더 구조 생성
- [ ] `src/shared/` 폴더 정리
- [ ] `src/repositories/` 폴더 생성
- [ ] `src/mocks/` 폴더 생성
- [ ] `src/platform/` 폴더 생성
- [ ] 기존 파일 이동

### 산출물
```
src/
├── app/
├── features/
├── shared/
├── repositories/
├── mocks/
├── platform/
└── routes/
```

---

## Task 0.2: 의존성 설치

### 작업 내용
```bash
# 상태 관리
pnpm add zustand @tanstack/react-query

# MSW (모킹)
pnpm add -D msw@latest

# 유틸리티
pnpm add nanoid date-fns zod immer
```

### 체크리스트
- [ ] zustand 설치
- [ ] @tanstack/react-query 설치
- [ ] msw 설치
- [ ] 유틸리티 라이브러리 설치
- [ ] package.json 확인

---

## Task 0.3: Tailwind 설정 (8px Grid + 반응형)

### 작업 내용
- [ ] `tailwind.config.ts` screens 설정
- [ ] spacing 토큰 설정 (8px grid)
- [ ] index.css 정리

### 산출물
- `tailwind.config.ts`

### 코드
```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
    },
  },
}
```

---

## Task 0.4: 레이아웃 컴포넌트 구현

### 작업 내용
- [ ] `Stack.tsx` 구현
- [ ] `Box.tsx` 구현
- [ ] `Container.tsx` 구현
- [ ] `Grid.tsx` 구현
- [ ] `cn` 유틸리티 확인

### 산출물
- `src/shared/components/layout/Stack.tsx`
- `src/shared/components/layout/Box.tsx`
- `src/shared/components/layout/Container.tsx`
- `src/shared/components/layout/Grid.tsx`
- `src/shared/components/layout/index.ts`

---

## Task 0.5: Repository 기반 구조 설정

### 작업 내용
- [ ] IPageRepository 인터페이스 정의
- [ ] IBlockRepository 인터페이스 정의
- [ ] MockPageRepository 스켈레톤
- [ ] repositories/index.ts 환경별 export

### 산출물
- `src/repositories/interfaces/IPageRepository.ts`
- `src/repositories/interfaces/IBlockRepository.ts`
- `src/repositories/implementations/mock/MockPageRepository.ts`
- `src/repositories/index.ts`

---

## Task 0.6: Platform 추상화 레이어 설정

### 작업 내용
- [ ] IPlatform 인터페이스 정의
- [ ] WebPlatform 구현
- [ ] PlatformProvider 설정
- [ ] usePlatform 훅

### 산출물
- `src/platform/interfaces/IPlatform.ts`
- `src/platform/implementations/WebPlatform.ts`
- `src/platform/PlatformProvider.tsx`
- `src/platform/index.ts`

---

## Task 0.7: App Providers 설정

### 작업 내용
- [ ] QueryClient 설정
- [ ] Providers 컴포넌트 (QueryClientProvider, PlatformProvider)
- [ ] main.tsx에 Providers 적용

### 산출물
- `src/app/providers.tsx`
- `src/main.tsx` 수정
