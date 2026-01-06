import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'

const boxVariants = cva('', {
  variants: {
    padding: {
      none: 'p-0',
      xs: 'p-1',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    paddingX: {
      none: 'px-0',
      xs: 'px-1',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
      xl: 'px-8',
    },
    paddingY: {
      none: 'py-0',
      xs: 'py-1',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
      xl: 'py-8',
    },
    margin: {
      none: 'm-0',
      auto: 'm-auto',
      xs: 'm-1',
      sm: 'm-2',
      md: 'm-4',
      lg: 'm-6',
      xl: 'm-8',
    },
    display: {
      block: 'block',
      inline: 'inline',
      'inline-block': 'inline-block',
      flex: 'flex',
      grid: 'grid',
      hidden: 'hidden',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
})

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  as?: React.ElementType
}

export function Box({
  padding,
  paddingX,
  paddingY,
  margin,
  display,
  className,
  as: Component = 'div',
  ...props
}: BoxProps) {
  return (
    <Component
      className={cn(boxVariants({ padding, paddingX, paddingY, margin, display }), className)}
      {...props}
    />
  )
}
