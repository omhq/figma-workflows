import * as React from 'react'

import { cn } from '@/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
        className
      )}
      {...props}
    />
  )
}

export { Input }
