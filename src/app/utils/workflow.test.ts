import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeWorkflowWithKeys } from './workflow'

const startNode = {
  id: 100,
  name: 'Start',
  prettyName: 'Start',
  data: { loadFonts: true },
  inputs: {},
  outputs: {}
}

const setMaskNode = {
  id: 200,
  name: 'BlendMixin',
  prettyName: 'Set mask',
  data: {
    api: 'figma',
    args: [true],
    argDefinitions: [{ operator: 'isMask', type: 'boolean' }]
  },
  inputs: {
    input: {
      connections: [{ node: 999, output: 'output' }]
    }
  },
  outputs: {}
}

test('repairs stale workflow connections before a run', () => {
  const normalized = normalizeWorkflowWithKeys([startNode, setMaskNode])

  assert.deepEqual(normalized['200'].inputs.input.connections, [
    { node: 100, output: 'output' }
  ])
  assert.deepEqual(normalized['100'].outputs.output.connections, [
    { node: 200, input: 'input' }
  ])
})

test('adds a fresh Start node when a legacy workflow only contains an action', () => {
  const normalized = normalizeWorkflowWithKeys([setMaskNode])
  const nodes = Object.values(normalized) as any[]
  const start = nodes.find(node => node.name === 'Start')
  const action = nodes.find(node => node.id === setMaskNode.id)

  assert.ok(start)
  assert.equal(action.inputs.input.connections[0].node, start.id)
})
