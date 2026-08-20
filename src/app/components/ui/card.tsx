import * as React from 'react'

import { cn } from '@/utils/cn'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-card text-card-foreground shadow-xs',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-3', className)} {...props} />
}

export { Card, CardContent }
