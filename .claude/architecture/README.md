# Arkilo 아키텍처 문서

## 목차
1. [개요](#개요)
2. [확장성 설계 원칙](#확장성-설계-원칙)
3. [레이어 아키텍처](#레이어-아키텍처)
4. [핵심 설계 결정](#핵심-설계-결정)
5. [관련 문서](#관련-문서)

---

## 개요

**Arkilo**는 노션 스타일의 플래닝/스케줄링 앱입니다.

| 항목 | 값 |
|------|-----|
| 플랫폼 | 웹 + iOS + Android + (향후) 데스크톱 |
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite 7 |
| 크로스플랫폼 | Capacitor (→ Electron/Tauri 확장 가능) |

---

## 확장성 설계 원칙

### 1. 플랫폼 확장성 (Ionic/Electron/Tauri)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Platform Abstraction Layer                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  src/platform/                                                  │
│  ├── index.ts          # Platform Detection & Factory           │
│  ├── types.ts          # Platform Interface 정의                │
│  ├── web/              # 웹 브라우저 구현                         │
│  │   └── WebPlatform.ts                                        │
│  ├── capacitor/        # 모바일 (iOS/Android)                    │
│  │   └── CapacitorPlatform.ts                                  │
│  └── electron/         # 데스크톱 (향후 확장)                     │
│      └── ElectronPlatform.ts                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Platform Interface 예시:**
```typescript
// src/platform/types.ts
export interface IPlatform {
  type: 'web' | 'ios' | 'android' | 'electron' | 'tauri'

  // 파일 시스템
  storage: IStorage

  // 알림
  notification: INotification

  // 키보드
  keyboard: IKeyboard

  // Safe Area
  safeArea: ISafeArea

  // 앱 생명주기
  lifecycle: ILifecycle
}
```

**확장 시나리오:**
- ✅ **Capacitor → Electron**: `src/platform/electron/` 추가만으로 데스크톱 지원
- ✅ **Capacitor → Tauri**: 동일한 패턴으로 Rust 기반 데스크톱 지원
- ✅ **Ionic Framework 추가**: 컴포넌트 레이어만 교체, 로직 재사용

---

### 2. 반응형 자동 적용 시스템

**목표**: 웹(데스크톱) 기준으로 작업해도 모바일/태블릿에서 자동으로 적절히 표시

#### 2.1 Tailwind Config에서 Screens 중앙 관리

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // Mobile First 기본값 오버라이드
      mobile: '320px',   // 모바일
      tablet: '768px',   // 태블릿
      desktop: '1024px', // 데스크톱
      wide: '1440px',    // 와이드 스크린
    },
    extend: {
      // 컨테이너 자동 반응형
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          tablet: '2rem',
          desktop: '4rem',
        },
      },
    },
  },
} satisfies Config
```

#### 2.2 반응형 레이아웃 컴포넌트

**ResponsiveStack** - 모바일: 세로 / 데스크톱: 가로

```tsx
// src/shared/components/layout/ResponsiveStack.tsx
import { cn } from '@/shared/lib/utils'

interface ResponsiveStackProps {
  children: React.ReactNode
  className?: string
  gap?: 'sm' | 'md' | 'lg'
  reverse?: boolean // 데스크톱에서 순서 반전
}

const gapMap = {
  sm: 'gap-2 tablet:gap-3',
  md: 'gap-4 tablet:gap-6',
  lg: 'gap-6 tablet:gap-8',
}

export function ResponsiveStack({
  children,
  className,
  gap = 'md',
  reverse = false,
}: ResponsiveStackProps) {
  return (
    <div
      className={cn(
        // 기본: 세로 정렬 (모바일)
        'flex flex-col',
        // 태블릿 이상: 가로 정렬
        'tablet:flex-row',
        // 순서 반전 옵션
        reverse && 'tablet:flex-row-reverse',
        // 간격
        gapMap[gap],
        className
      )}
    >
      {children}
    </div>
  )
}
```

**ResponsiveGrid** - 자동 컬럼 조절

```tsx
// src/shared/components/layout/ResponsiveGrid.tsx
import { cn } from '@/shared/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 // 데스크톱 기준 컬럼 수
}

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 tablet:grid-cols-2',
  3: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
  4: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4',
}

export function ResponsiveGrid({
  children,
  className,
  cols = 3,
}: ResponsiveGridProps) {
  return (
    <div className={cn('grid gap-4 tablet:gap-6', colsMap[cols], className)}>
      {children}
    </div>
  )
}
```

#### 2.3 CVA로 컴포넌트 변형 관리

```tsx
// src/shared/components/ui/Card.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const cardVariants = cva(
  // 기본 스타일 (모든 화면)
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      // 레이아웃 변형 - 자동 반응형
      layout: {
        // 기본: 수직 스택
        vertical: 'flex flex-col',
        // 가로 카드 (모바일에선 세로로)
        horizontal: 'flex flex-col tablet:flex-row',
      },
      // 패딩 변형 - 화면 크기별 자동 조절
      padding: {
        sm: 'p-3 tablet:p-4',
        md: 'p-4 tablet:p-6',
        lg: 'p-6 tablet:p-8',
      },
      // 전체 너비
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      layout: 'vertical',
      padding: 'md',
      fullWidth: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({
  className,
  layout,
  padding,
  fullWidth,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ layout, padding, fullWidth }), className)}
      {...props}
    />
  )
}
```

#### 2.4 사용 예시 - 웹 기준으로 작업하면 자동 적용

```tsx
// 개발자는 웹(데스크톱) 기준으로 작업
function TaskBoard() {
  return (
    // ResponsiveStack 사용 → 모바일에선 자동으로 세로 정렬
    <ResponsiveStack gap="lg">
      <Sidebar />
      <main className="flex-1">
        {/* ResponsiveGrid 사용 → 모바일에선 1컬럼, 태블릿 2컬럼, 데스크톱 3컬럼 */}
        <ResponsiveGrid cols={3}>
          <TaskColumn title="To Do" />
          <TaskColumn title="In Progress" />
          <TaskColumn title="Done" />
        </ResponsiveGrid>
      </main>
    </ResponsiveStack>
  )
}

// Card 사용 → layout="horizontal"이면 모바일에선 자동으로 세로
function TaskCard({ task }: { task: Task }) {
  return (
    <Card layout="horizontal" padding="md">
      <CardImage src={task.cover} />
      <CardContent>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </CardContent>
    </Card>
  )
}
```

#### 2.5 자동 반응형 유틸리티 훅

```tsx
// src/shared/hooks/useResponsive.ts
import { useMediaQuery } from './useMediaQuery'

export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return {
    isMobile,
    isTablet,
    isDesktop,
    // 현재 브레이크포인트
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  }
}
```

---

### 3. Repository 레이어 (백엔드 교체 용이)

**현재 문제**: API 호출이 컴포넌트/훅에 직접 작성되면 백엔드 교체 시 전체 수정 필요

**해결**: Repository 패턴으로 데이터 접근 추상화

```
┌─────────────────────────────────────────────────────────────────┐
│                     Repository Pattern                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐   │
│  │   Feature   │────►│ Repository  │────►│  Data Source    │   │
│  │   (Hook)    │     │ (Interface) │     │ (Implementation)│   │
│  └─────────────┘     └─────────────┘     └─────────────────┘   │
│                             │                     │             │
│                             │              ┌──────┴──────┐      │
│                             │              │             │      │
│                             ▼              ▼             ▼      │
│                      IPageRepository   MSW Mock    Supabase     │
│                      IBlockRepository  (Dev)      EC2 REST      │
│                      IAuthRepository              GraphQL       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**폴더 구조:**
```
src/
├── repositories/               # Repository 레이어 ⭐
│   ├── interfaces/             # 인터페이스 정의 (계약)
│   │   ├── IPageRepository.ts
│   │   ├── IBlockRepository.ts
│   │   ├── IAuthRepository.ts
│   │   └── IDatabaseRepository.ts
│   │
│   ├── implementations/        # 구현체
│   │   ├── supabase/           # Supabase 구현
│   │   │   ├── SupabasePageRepository.ts
│   │   │   ├── SupabaseBlockRepository.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── rest/               # REST API 구현 (EC2 등)
│   │   │   ├── RestPageRepository.ts
│   │   │   └── index.ts
│   │   │
│   │   └── mock/               # MSW Mock 구현
│   │       ├── MockPageRepository.ts
│   │       └── index.ts
│   │
│   └── index.ts                # Repository Factory
```

**Repository Interface 예시:**
```typescript
// src/repositories/interfaces/IPageRepository.ts
export interface IPageRepository {
  // Query
  findById(id: string): Promise<Page | null>
  findByParentId(parentId: string | null): Promise<Page[]>
  findAll(): Promise<Page[]>

  // Mutation
  create(data: CreatePageDto): Promise<Page>
  update(id: string, data: UpdatePageDto): Promise<Page>
  delete(id: string): Promise<void>

  // Realtime (optional)
  subscribe?(callback: (change: PageChange) => void): () => void
}
```

**Repository Factory (환경에 따라 구현체 선택):**
```typescript
// src/repositories/index.ts
import { env } from '@/shared/lib/env'

export function createRepositories(): Repositories {
  const dataSource = env.VITE_DATA_SOURCE // 'mock' | 'supabase' | 'rest'

  switch (dataSource) {
    case 'mock':
      return createMockRepositories()
    case 'supabase':
      return createSupabaseRepositories()
    case 'rest':
      return createRestRepositories() // EC2 REST API
    default:
      throw new Error(`Unknown data source: ${dataSource}`)
  }
}
```

**Feature Hook에서 사용:**
```typescript
// src/features/pages/hooks/usePages.ts
import { useRepository } from '@/shared/hooks/useRepository'

export function usePages() {
  const { pageRepository } = useRepository()

  return useQuery({
    queryKey: ['pages'],
    queryFn: () => pageRepository.findAll(), // 구현체 무관
  })
}
```

**백엔드 교체 시나리오:**
| 시나리오 | 변경 사항 |
|----------|----------|
| MSW → Supabase | `.env`에서 `VITE_DATA_SOURCE=supabase` |
| Supabase → EC2 REST | `.env`에서 `VITE_DATA_SOURCE=rest` + `RestXxxRepository` 구현 |
| EC2 → GraphQL | `GraphQLXxxRepository` 추가 |

---

## 레이어 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation                            │
│  routes/ (TanStack Router)                                      │
│  └── 페이지 컴포넌트, 레이아웃                                    │
├─────────────────────────────────────────────────────────────────┤
│                          Features                               │
│  features/{domain}/                                             │
│  ├── components/    UI 컴포넌트                                  │
│  ├── hooks/         TanStack Query + Repository 연동            │
│  └── stores/        Zustand (UI 상태만)                          │
├─────────────────────────────────────────────────────────────────┤
│                         Repository                              │
│  repositories/                                                  │
│  ├── interfaces/    계약 정의                                    │
│  └── implementations/  구현체 (Supabase, REST, Mock)             │
├─────────────────────────────────────────────────────────────────┤
│                          Platform                               │
│  platform/                                                      │
│  └── 플랫폼별 기능 (Storage, Notification, SafeArea)             │
├─────────────────────────────────────────────────────────────────┤
│                          Shared                                 │
│  shared/                                                        │
│  ├── components/ui/   shadcn/ui 컴포넌트                         │
│  ├── components/layout/  ResponsiveStack, ResponsiveGrid 등     │
│  ├── hooks/           공용 훅                                    │
│  ├── lib/             유틸리티                                   │
│  └── types/           공용 타입                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 의존성 규칙

```
routes → features → repositories → platform
                 ↘              ↙
                    shared
```

- ✅ 상위 → 하위 의존 가능
- ✅ 모든 레이어 → shared 의존 가능
- ❌ 하위 → 상위 의존 금지
- ❌ 동일 레이어 간 순환 의존 금지

---

## 핵심 설계 결정

| 결정 | 근거 | Tradeoff |
|------|------|----------|
| Repository 패턴 | 백엔드 교체 용이 (EC2, Supabase, GraphQL) | 초기 보일러플레이트 증가 |
| Platform 추상화 | 데스크톱(Electron/Tauri) 확장 용이 | 추가 추상화 레이어 |
| tailwind.config.ts | 브레이크포인트 중앙 관리 | - |
| 반응형 레이아웃 컴포넌트 | 웹 기준 작업 → 자동 반응형 | 컴포넌트 추가 |
| CVA 변형 관리 | 반응형 변형 일관성 | CVA 학습 필요 |
| Feature-Sliced | 도메인별 독립성 | 일부 코드 중복 허용 |

---

## 관련 문서

- [폴더 구조](./folder-structure.md)
- [데이터 모델](./data-model.md)
- [상태 흐름](./state-flow.md)
- [ADR-001: 기술 스택 선정](../adr/ADR-001-tech-stack.md)
- [ADR-002: 반응형 전략](../adr/ADR-002-responsive-strategy.md)
- [ADR-003: 상태 관리 전략](../adr/ADR-003-state-management.md)
- [ADR-004: Repository 패턴](../adr/ADR-004-repository-pattern.md)
