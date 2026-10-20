import { defaultEffectSettings } from '../../../shared/effects'

const effectArgument = {
  operator: 'effects',
  type: 'effect',
  name: 'effect',
  label: 'Effect',
  required: true,
  default: JSON.stringify({
    ...defaultEffectSettings,
    validation: { valid: true }
  })
}

export default [
  {
    category: 'Effects',
    items: [
      {
        prettyName: 'Add effect',
        name: 'Effects',
        icon: 'Drop',
        helper: 'Adds a shadow or blur and keeps existing effects.',
        data: { api: 'figma', operator: 'add', args: [effectArgument] }
      },
      {
        prettyName: 'Set effect',
        name: 'Effects',
        icon: 'Drop',
        helper: 'Replaces all existing effects with this shadow or blur.',
        data: { api: 'figma', operator: 'set', args: [effectArgument] }
      },
      {
        prettyName: 'Clear effects',
        name: 'Effects',
        icon: 'Drop',
        helper: 'Removes all effects from the layer.',
        data: { api: 'figma', operator: 'clear', args: [] }
      }
    ]
  }
]
