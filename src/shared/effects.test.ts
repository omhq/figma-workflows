import assert from 'node:assert/strict'
import test from 'node:test'
import { createEffect, defaultEffectSettings, getEffectError } from './effects'

test('converts shadow form values to Figma colors and numeric dimensions', () => {
  assert.deepEqual(
    createEffect({
      ...defaultEffectSettings,
      type: 'INNER_SHADOW',
      color: '#3366ff',
      opacity: '40',
      offsetX: '-2.5',
      offsetY: '0',
      radius: '0',
      spread: '-1',
      visible: false
    }),
    {
      type: 'INNER_SHADOW',
      color: { r: 0.2, g: 0.4, b: 1, a: 0.4 },
      offset: { x: -2.5, y: 0 },
      radius: 0,
      spread: -1,
      blendMode: 'NORMAL',
      visible: false
    }
  )
})

test('builds both blur types without shadow-only properties', () => {
  for (const type of ['LAYER_BLUR', 'BACKGROUND_BLUR']) {
    assert.deepEqual(createEffect({ type, radius: '12.5', visible: true }), {
      type,
      radius: 12.5,
      visible: true,
      blurType: 'NORMAL'
    })
  }
})

test('rejects invalid settings, including empty, negative, and non-finite numbers', () => {
  const invalidSettings = [
    { radius: '' },
    { radius: ' ' },
    { radius: -1 },
    { radius: Infinity },
    { offsetX: 'left' },
    { offsetY: null },
    { spread: false },
    { opacity: -1 },
    { opacity: 101 },
    { opacity: NaN },
    { color: '#xyzxyz' },
    { color: 'red' },
    { type: 'UNKNOWN' },
    { visible: 'false' }
  ]
  for (const invalid of invalidSettings) {
    assert.throws(() => createEffect({ ...defaultEffectSettings, ...invalid }))
  }
  assert.throws(() => createEffect(null))
  assert.equal(getEffectError(defaultEffectSettings), null)
  assert.equal(
    getEffectError({ ...defaultEffectSettings, radius: -1 }),
    'Blur must be 0 or greater.'
  )
})

test('preserves zero opacity and rejects malformed saved data', () => {
  const effect = createEffect({
    ...defaultEffectSettings,
    opacity: 0
  }) as DropShadowEffect
  assert.equal(effect.color.a, 0)
  assert.throws(() => createEffect({}))
  assert.throws(() => createEffect('not an effect'))
})
