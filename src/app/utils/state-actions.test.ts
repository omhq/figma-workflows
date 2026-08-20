import assert from 'node:assert/strict'
import test from 'node:test'
import {
  dedupeNodeTree,
  mergeRootNodesWithLatestChildren,
  replaceNodeChildren
} from './state-actions'

const node = (id, name = 'BlendMixin', children: any[] = []) => ({
  id,
  name,
  prettyName: name,
  data: {},
  children
})

test('keeps the nested copy when Sortable reports the same action twice', () => {
  const duplicate = node(42)
  const tree = [
    node(1, 'Start'),
    duplicate,
    node(2, 'BaseNode', [node(3, 'Start'), duplicate])
  ]

  const deduped = dedupeNodeTree(tree)
  const container = deduped.find(item => item.id === 2)

  assert.equal(
    deduped.some(item => item.id === 42),
    false
  )
  assert.equal(
    container.children.some(item => item.id === 42),
    true
  )
})

test('replaces nested children by container ID instead of a stale index', () => {
  const tree = [
    node(1, 'Start'),
    node(2, 'BaseNode', [node(3, 'Start')]),
    node(4)
  ]
  const replacement = [node(3, 'Start'), node(5)]
  const updated = replaceNodeChildren(tree, 2, replacement)
  const container = updated.find(item => item.id === 2)

  assert.deepEqual(container.children, replacement)
})

test('preserves a destination update when the root removal arrives afterward', () => {
  const action = node(42)
  const original = [
    node(1, 'Start'),
    action,
    node(2, 'BaseNode', [node(3, 'Start')])
  ]

  const destinationUpdate = replaceNodeChildren(original, 2, [
    node(3, 'Start'),
    action
  ])
  const sourceUpdate = [original[0], original[2]]
  const merged = mergeRootNodesWithLatestChildren(
    sourceUpdate,
    destinationUpdate
  )
  const deduped = dedupeNodeTree(merged)
  const container = deduped.find(item => item.id === 2)

  assert.equal(
    deduped.some(item => item.id === 42),
    false
  )
  assert.equal(
    container.children.some(item => item.id === 42),
    true
  )
})

test('preserves a nested removal when the root addition arrives afterward', () => {
  const action = node(42)
  const original = [
    node(1, 'Start'),
    node(2, 'BaseNode', [node(3, 'Start'), action])
  ]

  const sourceUpdate = replaceNodeChildren(original, 2, [node(3, 'Start')])
  const destinationUpdate = [original[0], action, original[1]]
  const merged = dedupeNodeTree(
    mergeRootNodesWithLatestChildren(destinationUpdate, sourceUpdate)
  )
  const container = merged.find(item => item.id === 2)

  assert.equal(
    merged.some(item => item.id === 42),
    true
  )
  assert.equal(
    container.children.some(item => item.id === 42),
    false
  )
})
