export type ConditionMatch = 'all' | 'any'

export type ConditionValueType = 'boolean' | 'enum' | 'number' | 'string'

export interface ConditionOption {
  label: string
  value: string
}

export interface ConditionProperty {
  group: 'Current layer' | 'Workflow'
  label: string
  value: string
  type: ConditionValueType
  defaultOperator: string
  defaultValue: string
  options?: ConditionOption[]
}

export interface WorkflowCondition {
  property: string
  operator: string
  value?: unknown
  not?: boolean
}

export interface WorkflowConditionGroup {
  version: 2
  match: ConditionMatch
  conditions: WorkflowCondition[]
}

export interface ConditionValidation {
  valid: boolean
  message: string | null
}

export const CUSTOM_CONDITION_PROPERTY = '__custom__'

const NODE_TYPE_OPTIONS: ConditionOption[] = [
  'BOOLEAN_OPERATION',
  'COMPONENT',
  'COMPONENT_SET',
  'ELLIPSE',
  'FRAME',
  'GROUP',
  'INSTANCE',
  'LINE',
  'POLYGON',
  'RECTANGLE',
  'SECTION',
  'SLICE',
  'STAR',
  'TEXT',
  'VECTOR'
].map(value => ({
  label: value
    .toLowerCase()
    .split('_')
    .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' '),
  value
}))

export const CONDITION_PROPERTIES: ConditionProperty[] = [
  {
    group: 'Current layer',
    label: 'Type',
    value: '{{item.type}}',
    type: 'enum',
    defaultOperator: 'equal',
    defaultValue: 'RECTANGLE',
    options: NODE_TYPE_OPTIONS
  },
  {
    group: 'Current layer',
    label: 'Name',
    value: '{{item.name}}',
    type: 'string',
    defaultOperator: 'equal',
    defaultValue: ''
  },
  {
    group: 'Current layer',
    label: 'Visible',
    value: '{{item.visible}}',
    type: 'boolean',
    defaultOperator: 'is-true',
    defaultValue: ''
  },
  {
    group: 'Current layer',
    label: 'Locked',
    value: '{{item.locked}}',
    type: 'boolean',
    defaultOperator: 'is-true',
    defaultValue: ''
  },
  {
    group: 'Current layer',
    label: 'Opacity',
    value: '{{item.opacity}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '1'
  },
  {
    group: 'Current layer',
    label: 'Width',
    value: '{{item.width}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '100'
  },
  {
    group: 'Current layer',
    label: 'Height',
    value: '{{item.height}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '100'
  },
  {
    group: 'Current layer',
    label: 'X position',
    value: '{{item.x}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '0'
  },
  {
    group: 'Current layer',
    label: 'Y position',
    value: '{{item.y}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '0'
  },
  {
    group: 'Current layer',
    label: 'Rotation',
    value: '{{item.rotation}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '0'
  },
  {
    group: 'Workflow',
    label: 'Loop index',
    value: '{{env.index}}',
    type: 'number',
    defaultOperator: 'equal',
    defaultValue: '0'
  }
]

export const CONDITION_OPERATORS: Record<
  ConditionValueType | 'custom',
  ConditionOption[]
> = {
  boolean: [
    { label: 'is true', value: 'is-true' },
    { label: 'is false', value: 'is-false' }
  ],
  enum: [
    { label: 'is', value: 'equal' },
    { label: 'is not', value: 'not-equal' }
  ],
  number: [
    { label: 'equals', value: 'equal' },
    { label: 'does not equal', value: 'not-equal' },
    { label: 'is greater than', value: 'greater-than' },
    {
      label: 'is greater than or equal to',
      value: 'greater-than-or-equal'
    },
    { label: 'is less than', value: 'less-than' },
    { label: 'is less than or equal to', value: 'less-than-or-equal' }
  ],
  string: [
    { label: 'is', value: 'equal' },
    { label: 'is not', value: 'not-equal' },
    { label: 'contains', value: 'contains' },
    { label: 'does not contain', value: 'not-contains' },
    { label: 'starts with', value: 'starts-with' },
    { label: 'ends with', value: 'ends-with' }
  ],
  custom: [
    { label: 'equals', value: 'equal' },
    { label: 'does not equal', value: 'not-equal' },
    { label: 'strictly equals', value: 'strict-equal' },
    { label: 'does not strictly equal', value: 'strict-not-equal' },
    { label: 'is greater than', value: 'greater-than' },
    {
      label: 'is greater than or equal to',
      value: 'greater-than-or-equal'
    },
    { label: 'is less than', value: 'less-than' },
    { label: 'is less than or equal to', value: 'less-than-or-equal' },
    { label: 'contains', value: 'contains' },
    { label: 'does not contain', value: 'not-contains' },
    { label: 'starts with', value: 'starts-with' },
    { label: 'ends with', value: 'ends-with' },
    { label: 'is true', value: 'is-true' },
    { label: 'is false', value: 'is-false' },
    { label: 'exists', value: 'exists' },
    { label: 'does not exist', value: 'not-exists' }
  ]
}

export const conditionPropertyFor = (value: string) =>
  CONDITION_PROPERTIES.find(property => property.value === value)

export const createDefaultCondition = (): WorkflowCondition => ({
  property: CONDITION_PROPERTIES[0].value,
  operator: CONDITION_PROPERTIES[0].defaultOperator,
  value: CONDITION_PROPERTIES[0].defaultValue,
  not: false
})

export const createDefaultConditionGroup = (): WorkflowConditionGroup => ({
  version: 2,
  match: 'all',
  conditions: [createDefaultCondition()]
})

const parseConditionValue = (value: unknown): any => {
  if (typeof value !== 'string') return value

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

/**
 * Reads both the original single-condition shape and the version 2 group shape.
 */
export const normalizeConditionGroup = (
  value: unknown
): WorkflowConditionGroup => {
  const parsed = parseConditionValue(value) || value

  if (
    parsed &&
    typeof parsed === 'object' &&
    Array.isArray(parsed.conditions)
  ) {
    return {
      version: 2,
      match: parsed.match === 'any' ? 'any' : 'all',
      conditions: parsed.conditions.map(condition => ({
        property: condition?.property || '',
        operator: condition?.operator || '',
        value: condition?.value ?? '',
        not: condition?.not === true
      }))
    }
  }

  if (parsed && typeof parsed === 'object' && 'property' in parsed) {
    return {
      version: 2,
      match: 'all',
      conditions: [
        {
          property: parsed.property || '',
          operator: parsed.operator || '',
          value: parsed.value ?? '',
          not: false
        }
      ]
    }
  }

  return createDefaultConditionGroup()
}

export const operatorNeedsValue = (operator: string) =>
  !['is-true', 'is-false', 'exists', 'not-exists'].includes(operator)

export const validateConditionGroup = (
  group: WorkflowConditionGroup
): ConditionValidation => {
  if (!group.conditions.length) {
    return { valid: false, message: 'Add at least one condition.' }
  }

  for (const [index, condition] of group.conditions.entries()) {
    const prefix = group.conditions.length > 1 ? `Condition ${index + 1}: ` : ''

    if (!condition.property) {
      return {
        valid: false,
        message: `${prefix}select a property to read.`
      }
    }

    if (!condition.operator) {
      return { valid: false, message: `${prefix}select a comparison.` }
    }

    if (
      operatorNeedsValue(condition.operator) &&
      (condition.value === '' ||
        condition.value === null ||
        condition.value === undefined)
    ) {
      return { valid: false, message: `${prefix}set a comparison value.` }
    }
  }

  return { valid: true, message: null }
}

const coerceRightValue = (left: unknown, right: unknown) => {
  if (typeof right !== 'string') return right

  if (typeof left === 'number' && right.trim() !== '') {
    const numberValue = Number(right)
    return Number.isNaN(numberValue) ? right : numberValue
  }

  if (typeof left === 'boolean') {
    if (right === 'true') return true
    if (right === 'false') return false
  }

  if (left === null && right === 'null') return null
  if (left === undefined && right === 'undefined') return undefined

  return right
}

export const evaluateComparison = (
  left: any,
  operator: string,
  rawRight?: any
) => {
  const right = coerceRightValue(left, rawRight)

  switch (operator) {
    case 'equal':
      return left === right
    case 'not-equal':
      return left !== right
    case 'strict-equal':
      return left === rawRight
    case 'strict-not-equal':
      return left !== rawRight
    case 'greater-than':
      return left > right
    case 'greater-than-or-equal':
      return left >= right
    case 'less-than':
      return left < right
    case 'less-than-or-equal':
      return left <= right
    case 'contains':
      return String(left ?? '').includes(String(right ?? ''))
    case 'not-contains':
      return !String(left ?? '').includes(String(right ?? ''))
    case 'starts-with':
      return String(left ?? '').startsWith(String(right ?? ''))
    case 'ends-with':
      return String(left ?? '').endsWith(String(right ?? ''))
    case 'is-true':
      return left === true
    case 'is-false':
      return left === false
    case 'exists':
      return left !== null && left !== undefined
    case 'not-exists':
      return left === null || left === undefined
    default:
      throw new Error(`Unknown condition operator "${operator}"`)
  }
}

export const evaluateConditionGroup = async (
  value: unknown,
  resolveValue: (value: unknown) => Promise<unknown>
) => {
  const group = normalizeConditionGroup(value)
  const validation = validateConditionGroup(group)

  if (!validation.valid) {
    throw new Error(validation.message || 'The condition is incomplete.')
  }

  const results = await Promise.all(
    group.conditions.map(async condition => {
      const left = await resolveValue(condition.property)
      const right = operatorNeedsValue(condition.operator)
        ? await resolveValue(condition.value)
        : undefined
      const result = evaluateComparison(left, condition.operator, right)

      return condition.not ? !result : result
    })
  )

  return group.match === 'any' ? results.some(Boolean) : results.every(Boolean)
}
