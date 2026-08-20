import type { ComponentType } from 'react'
import { Code2, Globe2, RefreshCw, Trash2, type LucideIcon } from 'lucide-react'

import * as FigmaIcons from '../components/icons/figma'

const lucideIcons: Record<string, LucideIcon> = {
  CodeIcon: Code2,
  GlobeIcon: Globe2,
  RefreshIcon: RefreshCw,
  TrashIcon: Trash2
}

export const getIconComponent = (iconName: string) => {
  const figmaIcons = FigmaIcons as Record<string, ComponentType<any>>
  return figmaIcons[iconName] ?? lucideIcons[iconName]
}
