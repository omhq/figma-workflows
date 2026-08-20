import { useEffect } from 'react'
import { CircleCheck, CircleX, TriangleAlert, X } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const icons = {
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleX
}

interface WorkflowAlertProps {
  autoCloseTime?: number
  message: string
  onAutoClose?: () => void
  onHide?: () => void
  variant: keyof typeof icons
}

export default function WorkflowAlert({
  autoCloseTime = 5000,
  message,
  onAutoClose = () => {},
  onHide = () => {},
  variant
}: WorkflowAlertProps) {
  const Icon = icons[variant]

  useEffect(() => {
    const timer = window.setTimeout(onAutoClose, autoCloseTime)
    return () => window.clearTimeout(timer)
  }, [autoCloseTime, message, onAutoClose])

  return (
    <Alert variant={variant}>
      <Icon aria-hidden="true" />
      <AlertDescription className="pr-7 font-medium">
        {message}
      </AlertDescription>
      <Button
        aria-label="Dismiss"
        className="absolute right-1.5 top-1.5 text-current hover:bg-black/5"
        onClick={onHide}
        size="icon-sm"
        variant="ghost"
      >
        <X className="size-3.5" />
      </Button>
    </Alert>
  )
}
