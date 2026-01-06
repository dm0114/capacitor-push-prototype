import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 tablet:grid-cols-2',
      3: 'grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3',
      4: 'grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4',
      6: 'grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6',
      12: 'grid-cols-4 tablet:grid-cols-6 desktop:grid-cols-12',
      auto: 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1 tablet:gap-2',
      sm: 'gap-2 tablet:gap-4',
      md: 'gap-4 tablet:gap-6',
      lg: 'gap-6 tablet:gap-8',
      xl: 'gap-8 tablet:gap-10',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'md',
    align: 'stretch',
  },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: React.ElementType
}

export function Grid({
  cols,
  gap,
  align,
  className,
  as: Component = 'div',
  ...props
}: GridProps) {
  return (
    <Component
      className={cn(gridVariants({ cols, gap, align }), className)}
      {...props}
    />
  )
}
