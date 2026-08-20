import assert from 'node:assert/strict'
import test from 'node:test'
import {
  cloneNodeTree,
  dedupeNodeTree,
  finalizeNodeDrop,
  inspectNodeTree,
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

test('moves a nested child above its parent and then back inside it', () => {
  const action = node(42)
  const forEach = node(3, 'BaseNode', [action])
  const selectionStart = node(2, 'Start')
  const selection = node(1, 'BaseNode', [selectionStart, forEach])
  const original = [node(0, 'Start'), selection]

  const nestedRemoval = replaceNodeChildren(original, forEach.id, [])
  const movedAbove = replaceNodeChildren(nestedRemoval, selection.id, [
    selectionStart,
    action,
    forEach
  ])
  const selectionAfterMove = movedAbove.find(item => item.id === selection.id)
  const forEachAfterMove = selectionAfterMove.children.find(
    item => item.id === forEach.id
  )

  assert.deepEqual(
    selectionAfterMove.children.map(item => item.id),
    [selectionStart.id, action.id, forEach.id]
  )
  assert.deepEqual(forEachAfterMove.children, [])

  // Sortable can add to the destination before its stale parent-list removal.
  const nestedAddition = replaceNodeChildren(movedAbove, forEach.id, [action])
  const movedBackInside = replaceNodeChildren(nestedAddition, selection.id, [
    selectionStart,
    forEachAfterMove
  ])
  const selectionAfterReturn = movedBackInside.find(
    item => item.id === selection.id
  )
  const forEachAfterReturn = selectionAfterReturn.children.find(
    item => item.id === forEach.id
  )

  assert.deepEqual(
    selectionAfterReturn.children.map(item => item.id),
    [selectionStart.id, forEach.id]
  )
  assert.deepEqual(
    forEachAfterReturn.children.map(item => item.id),
    [action.id]
  )
})

test('rolls back when an ambiguous drop loses the dragged action', () => {
  const snapshot = [node(1, 'Start'), node(42)]
  const result = finalizeNodeDrop([node(1, 'Start')], snapshot, 42)

  assert.equal(result.accepted, false)
  assert.deepEqual(result.nodes, cloneNodeTree(snapshot))
})

test('rejects a container dropped into its own descendant', () => {
  const container = node(2, 'BaseNode')
  container.children = [container]

  const inspection = inspectNodeTree([container])
  const result = finalizeNodeDrop([container], [node(2, 'BaseNode')], 2)

  assert.equal(inspection.cyclic, true)
  assert.equal(result.accepted, false)
})
