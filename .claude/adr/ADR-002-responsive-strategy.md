# ADR-002: 반응형 전략 + 디자인 시스템

**Status**: Accepted
**Date**: 2025-01-06
**Deciders**: dm0114

---

## Context

- 웹 기준 개발 시 모바일/태블릿 자동 반응형 적용 필요
- 마진/패딩/여백을 매번 신경 쓰지 않는 시스템 필요
- 8px 단위 그리드로 일관된 디자인 유지

## Decision

**8px 그리드 + CSS-first 반응형 + 레이아웃 컴포넌트 + CVA**

### 분기 우선순위

```
1. CSS 반응형 (Tailwind) - 기본
2. 훅 분기 (useMediaQuery) - CSS 불가 시
3. 컴포넌트 분리 - 완전히 다른 UX일 때만
```

---

## 1. Tailwind 설정

### 브레이크포인트

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      mobile: '320px',   // 모바일 최소
      tablet: '768px',   // 태블릿
      desktop: '1024px', // 데스크톱
      wide: '1440px',    // 와이드 모니터
    },
  },
}
```

### Spacing (8px Grid)

```typescript
// tailwind.config.ts
export default {
  theme: {
    spacing: {
      0: '0px',
      1: '4px',     // 0.5x
      2: '8px',     // 1x   ★
      3: '12px',    // 1.5x
      4: '16px',    // 2x   ★
      5: '20px',    // 2.5x
      6: '24px',    // 3x   ★
      8: '32px',    // 4x   ★
      10: '40px',   // 5x
      12: '48px',   // 6x   ★
      16: '64px',   // 8x
      20: '80px',   // 10x
      24: '96px',   // 12x
    },
  },
}
```

---

## 2. 레이아웃 컴포넌트

### Stack (세로/가로 배치)

```tsx
// shared/components/layout/Stack.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const stackVariants = cva('flex', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
      responsive: 'flex-col tablet:flex-row',  // 반응형 자동
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',           // 4px
      sm: 'gap-2',           // 8px
      md: 'gap-4',           // 16px
      lg: 'gap-6',           // 24px
      xl: 'gap-8',           // 32px
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
})

export function Stack({ direction, gap, align, justify, children, className }) {
  return (
    <div className={cn(stackVariants({ direction, gap, align, justify }), className)}>
      {children}
    </div>
  )
}
```

### Box (패딩/마진)

```tsx
// shared/components/layout/Box.tsx
const boxVariants = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      xs: 'p-1',             // 4px
      sm: 'p-2',             // 8px
      md: 'p-4',             // 16px
      lg: 'p-6',             // 24px
      xl: 'p-8',             // 32px
    },
    paddingX: {
      none: 'px-0',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
    },
    paddingY: {
      none: 'py-0',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
})

export function Box({ padding, paddingX, paddingY, children, className }) {
  return (
    <div className={cn(boxVariants({ padding, paddingX, paddingY }), className)}>
      {children}
    </div>
  )
}
```

### Container (페이지 래퍼)

```tsx
// shared/components/layout/Container.tsx
const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-screen-tablet',    // 768px
      md: 'max-w-screen-desktop',   // 1024px
      lg: 'max-w-screen-wide',      // 1440px
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4 tablet:px-6',
      md: 'px-4 tablet:px-8 desktop:px-12',  // 반응형 자동
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
})

export function Container({ size, padding, children, className }) {
  return (
    <div className={cn(containerVariants({ size, padding }), className)}>
      {children}
    </div>
  )
}
```

### Grid (반응형 그리드)

```tsx
// shared/components/layout/Grid.tsx
const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 tablet:grid-cols-2',
      3: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
      4: 'grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2 tablet:gap-4',        // 반응형 gap
      md: 'gap-4 tablet:gap-6',
      lg: 'gap-6 tablet:gap-8',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
  },
})

export function Grid({ cols, gap, children, className }) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)}>
      {children}
    </div>
  )
}
```

---

## 3. 사용 예시

개발자는 **반응형/spacing 고려 불필요**:

```tsx
function PageContent() {
  return (
    <Container>
      <Stack gap="lg">
        <PageHeader />

        <Grid cols={3} gap="md">
          <Card>...</Card>
          <Card>...</Card>
          <Card>...</Card>
        </Grid>

        {/* 모바일: 세로, 태블릿+: 가로 - 자동 */}
        <Stack direction="responsive" gap="md">
          <Sidebar />
          <MainContent />
        </Stack>
      </Stack>
    </Container>
  )
}
```

---

## 4. Spacing 가이드라인

| 위치 | 권장 | 예시 |
|------|------|------|
| 컴포넌트 내부 패딩 | `sm` ~ `md` | `<Box padding="md">` |
| 라벨-입력 간격 | `xs` ~ `sm` | `<Stack gap="sm">` |
| 컴포넌트 간 간격 | `md` ~ `lg` | `<Stack gap="md">` |
| 섹션 간 간격 | `xl` | `<Stack gap="xl">` |
| 페이지 여백 | Container 자동 | `<Container>` |

---

## 5. Storybook 설정

```typescript
// .storybook/preview.ts
export const parameters = {
  viewport: {
    viewports: {
      mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
      tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
    },
  },
}
```

---

## Consequences

### Positive

- 개발 시 반응형/spacing 고민 불필요
- 8px 그리드로 일관된 시각적 리듬
- 레이아웃 컴포넌트로 반응형 자동 처리
- Storybook viewport 테스트 용이

### Negative

- 초기 레이아웃 컴포넌트 구현 비용
- 특수 케이스는 인라인 Tailwind 필요

---

## References

- [8pt Grid System](https://spec.fm/specifics/8-pt-grid)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [CVA Documentation](https://cva.style/docs)
