import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeNumberArgument } from './numeric-args'
import { normalizeArgs, parseExpression } from './utils'

test('evaluates the reported smoothing fraction and numeric action defaults', () => {
  for (const [value, expected] of [
    ['60/100', 0.6],
    ['60 / 100', 0.6],
    ['50 / 100', 0.5],
    ['0.6', 0.6],
    ['.6', 0.6],
    ['1.0', 1],
    ['0', 0],
    ['-2.5', -2.5],
    ['6e-1', 0.6]
  ] as const) {
    assert.equal(normalizeNumberArgument(value), expected)
  }
  assert.equal(normalizeNumberArgument(0), 0)
})

test('respects arithmetic precedence, parentheses, and unary signs', () => {
  assert.equal(normalizeNumberArgument('2 + 3 * 4'), 14)
  assert.equal(normalizeNumberArgument('(20 + 40) / 100'), 0.6)
  assert.equal(normalizeNumberArgument('-(2 + 3) * -2'), 10)
  assert.equal(normalizeNumberArgument('8 / 2 / 2'), 2)
})

test('numeric normalization keeps one argument per definition, including optional blanks', () => {
  const args = ['1.0', null, '60/100', '20', '0']
  assert.deepEqual(
    normalizeArgs(
      args,
      args.map(() => ({ type: 'number' })),
      false
    ),
    [1, null, 0.6, 20, 0]
  )
  for (const value of [null, undefined, '', '  '])
    assert.equal(normalizeNumberArgument(value), null)
})

test('preserves explicit expressions until the layer and environment are available', async () => {
  const expression = '{{item.width / env.scale}}'
  const normalized = normalizeArgs([expression], [{ type: 'number' }], false)
  assert.deepEqual(normalized, [expression])
  assert.equal(
    await parseExpression({ width: 120 }, { scale: 2 }, normalized[0]),
    60
  )
})

test('rejects invalid arithmetic and JavaScript instead of silently dropping the argument', () => {
  for (const value of [
    '1/0',
    '0/0',
    '1e999',
    '60/',
    '(60/100',
    '1 2',
    'NaN',
    'Infinity',
    'Math.random()',
    'fetch("https://example.com")',
    '1; throw 0',
    true,
    Infinity
  ]) {
    assert.throws(() => normalizeNumberArgument(value))
  }
})
