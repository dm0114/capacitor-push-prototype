import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-screen-tablet',
      md: 'max-w-screen-desktop',
      lg: 'max-w-screen-wide',
      full: 'max-w-full',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4 tablet:px-6',
      md: 'px-4 tablet:px-8 desktop:px-12',
      lg: 'px-6 tablet:px-12 desktop:px-16',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'md',
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

export function Container({
  size,
  padding,
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(containerVariants({ size, padding }), className)}
      {...props}
    />
  )
}
