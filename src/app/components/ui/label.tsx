import * as React from 'react'

import { cn } from '@/utils/cn'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
