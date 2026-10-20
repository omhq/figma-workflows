export const effectTypes = [
  { value: 'DROP_SHADOW', label: 'Drop shadow' },
  { value: 'INNER_SHADOW', label: 'Inner shadow' },
  { value: 'LAYER_BLUR', label: 'Layer blur' },
  { value: 'BACKGROUND_BLUR', label: 'Background blur' }
] as const

export interface EffectSettings {
  type: (typeof effectTypes)[number]['value']
  radius: number | string
  offsetX: number | string
  offsetY: number | string
  spread: number | string
  color: string
  opacity: number | string
  visible: boolean
}

export const defaultEffectSettings: EffectSettings = {
  type: 'DROP_SHADOW',
  radius: 4,
  offsetX: 0,
  offsetY: 4,
  spread: 0,
  color: '#000000',
  opacity: 25,
  visible: true
}

const numberValue = (value: unknown, label: string): number => {
  if (
    (typeof value !== 'string' && typeof value !== 'number') ||
    String(value).trim() === '' ||
    !Number.isFinite(Number(value))
  ) {
    throw new Error(`${label} must be a number.`)
  }

  return Number(value)
}

/** Validate saved form values again in the controller before writing to Figma. */
export function createEffect(value: unknown): Effect {
  if (!value || typeof value !== 'object') {
    throw new Error('Configure an effect before running this action.')
  }

  const settings = value as EffectSettings
  if (!effectTypes.some(effect => effect.value === settings.type)) {
    throw new Error('Choose a shadow or blur effect.')
  }

  const radius = numberValue(settings.radius, 'Blur')
  if (radius < 0) throw new Error('Blur must be 0 or greater.')
  if (typeof settings.visible !== 'boolean') {
    throw new Error('Effect visibility must be on or off.')
  }

  if (settings.type === 'LAYER_BLUR' || settings.type === 'BACKGROUND_BLUR') {
    return {
      type: settings.type,
      radius,
      visible: settings.visible,
      blurType: 'NORMAL'
    }
  }

  if (
    typeof settings.color !== 'string' ||
    !/^#[0-9a-f]{6}$/i.test(settings.color)
  ) {
    throw new Error('Enter a six-digit hex color, such as #000000.')
  }

  const opacity = numberValue(settings.opacity, 'Opacity')
  if (opacity < 0 || opacity > 100) {
    throw new Error('Opacity must be between 0 and 100%.')
  }

  const color = settings.color.slice(1)
  return {
    type: settings.type,
    radius,
    visible: settings.visible,
    color: {
      r: parseInt(color.slice(0, 2), 16) / 255,
      g: parseInt(color.slice(2, 4), 16) / 255,
      b: parseInt(color.slice(4, 6), 16) / 255,
      a: opacity / 100
    },
    offset: {
      x: numberValue(settings.offsetX, 'X offset'),
      y: numberValue(settings.offsetY, 'Y offset')
    },
    spread: numberValue(settings.spread, 'Spread'),
    blendMode: 'NORMAL'
  }
}

export function getEffectError(value: unknown): string | null {
  try {
    createEffect(value)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}
