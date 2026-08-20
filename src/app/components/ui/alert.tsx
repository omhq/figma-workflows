import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 border-b px-3 py-2.5 text-xs has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-2 [&>svg]:size-4 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        warning: 'border-amber-200 bg-amber-50 text-amber-950',
        destructive: 'border-red-200 bg-red-50 text-red-900'
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('font-medium', className)} {...props} />
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('col-start-2 text-current/80', className)} {...props} />
  )
}

export { Alert, AlertDescription, AlertTitle }
