import { useId } from 'react'
import {
  defaultEffectSettings,
  effectTypes,
  getEffectError,
  type EffectSettings
} from '../../../shared/effects'

interface EffectComponentProps {
  value: string | null
  onChange: (value: string) => void
}

const EffectComponent = ({ value, onChange }: EffectComponentProps) => {
  const id = useId()
  const settings: EffectSettings = value
    ? JSON.parse(value)
    : defaultEffectSettings
  const error = getEffectError(settings)
  const isShadow =
    settings.type === 'DROP_SHADOW' || settings.type === 'INNER_SHADOW'
  const inputClass =
    'w-full min-w-0 rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs focus-visible:outline-2 focus-visible:outline-indigo-600'

  const update = (name: keyof EffectSettings, value: string | boolean) => {
    const next = { ...settings, [name]: value }
    onChange(
      JSON.stringify({
        ...next,
        validation: { valid: getEffectError(next) === null }
      })
    )
  }

  const numberField = (
    name: 'radius' | 'offsetX' | 'offsetY' | 'spread' | 'opacity',
    label: string,
    min?: number,
    max?: number
  ) => (
    <div>
      <label
        className="text-xs text-gray-900 mb-1 block"
        htmlFor={`${id}-${name}`}
      >
        {label}
      </label>
      <input
        id={`${id}-${name}`}
        type="number"
        step="any"
        min={min}
        max={max}
        className={inputClass}
        value={settings[name]}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={event => update(name, event.target.value)}
      />
    </div>
  )

  return (
    <div className="px-2 my-2 space-y-3">
      <div>
        <label
          className="text-xs text-gray-900 mb-1 block"
          htmlFor={`${id}-type`}
        >
          Effect type
        </label>
        <select
          id={`${id}-type`}
          className={inputClass}
          value={settings.type}
          onChange={event => update('type', event.target.value)}
        >
          {effectTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {isShadow && (
        <div className="grid grid-cols-2 gap-2">
          {numberField('offsetX', 'X offset (px)')}
          {numberField('offsetY', 'Y offset (px)')}
        </div>
      )}

      <div className={isShadow ? 'grid grid-cols-2 gap-2' : ''}>
        {numberField('radius', 'Blur (px)', 0)}
        {isShadow && numberField('spread', 'Spread (px)')}
      </div>

      {isShadow && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                className="text-xs text-gray-900 mb-1 block"
                htmlFor={`${id}-color`}
              >
                Color (hex)
              </label>
              <input
                id={`${id}-color`}
                className={inputClass}
                type="text"
                spellCheck={false}
                value={settings.color}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={event => update('color', event.target.value)}
              />
            </div>
            {numberField('opacity', 'Opacity (%)', 0, 100)}
          </div>
          <p className="text-xs text-gray-600">
            Spread applies to rectangles, ellipses, and filled frames with
            clipped content.
          </p>
        </>
      )}

      <label
        className="flex items-center gap-2 text-xs text-gray-900"
        htmlFor={`${id}-visible`}
      >
        <input
          id={`${id}-visible`}
          type="checkbox"
          checked={settings.visible}
          onChange={event => update('visible', event.target.checked)}
        />
        Visible
      </label>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default EffectComponent
