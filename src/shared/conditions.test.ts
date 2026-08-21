import assert from 'node:assert/strict'
import test from 'node:test'
import {
  evaluateComparison,
  evaluateConditionGroup,
  normalizeConditionGroup,
  validateConditionGroup
} from './conditions'

const values = {
  '{{item.type}}': 'TEXT',
  '{{item.visible}}': true,
  '{{item.opacity}}': 0.5,
  '{{item.name}}': 'Primary Button'
}

const resolveValue = async value =>
  typeof value === 'string' && value in values ? values[value] : value

test('normalizes the original single If condition', () => {
  const group = normalizeConditionGroup({
    property: '{{item.type}}',
    operator: 'equal',
    value: 'TEXT'
  })

  assert.equal(group.version, 2)
  assert.equal(group.match, 'all')
  assert.deepEqual(group.conditions, [
    {
      property: '{{item.type}}',
      operator: 'equal',
      value: 'TEXT',
      not: false
    }
  ])
})

test('requires a value only for comparisons that use one', () => {
  assert.equal(
    validateConditionGroup({
      version: 2,
      match: 'all',
      conditions: [
        {
          property: '{{item.visible}}',
          operator: 'is-true',
          value: ''
        }
      ]
    }).valid,
    true
  )

  assert.equal(
    validateConditionGroup({
      version: 2,
      match: 'all',
      conditions: [
        { property: '{{item.name}}', operator: 'contains', value: '' }
      ]
    }).valid,
    false
  )
})

test('coerces form values to the property type for friendly comparisons', () => {
  assert.equal(evaluateComparison(0.5, 'equal', '0.5'), true)
  assert.equal(evaluateComparison(true, 'equal', 'true'), true)
  assert.equal(evaluateComparison('Primary Button', 'contains', 'Button'), true)
})

test('matches all conditions as AND', async () => {
  const result = await evaluateConditionGroup(
    {
      version: 2,
      match: 'all',
      conditions: [
        {
          property: '{{item.type}}',
          operator: 'equal',
          value: 'TEXT'
        },
        {
          property: '{{item.visible}}',
          operator: 'is-true'
        }
      ]
    },
    resolveValue
  )

  assert.equal(result, true)
})

test('matches any condition as OR', async () => {
  const result = await evaluateConditionGroup(
    {
      version: 2,
      match: 'any',
      conditions: [
        {
          property: '{{item.type}}',
          operator: 'equal',
          value: 'RECTANGLE'
        },
        {
          property: '{{item.opacity}}',
          operator: 'less-than',
          value: '1'
        }
      ]
    },
    resolveValue
  )

  assert.equal(result, true)
})

test('inverts an individual condition as NOT', async () => {
  const result = await evaluateConditionGroup(
    {
      version: 2,
      match: 'all',
      conditions: [
        {
          property: '{{item.visible}}',
          operator: 'is-true',
          not: true
        }
      ]
    },
    resolveValue
  )

  assert.equal(result, false)
})
