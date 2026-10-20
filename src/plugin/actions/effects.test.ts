import assert from 'node:assert/strict'
import test from 'node:test'
import run from './runner'
import EffectsComponent from './components/EffectsComponent'
import {
  WorkflowComponent,
  WorkflowEngine,
  type WorkflowNode,
  type WorkflowOutputs
} from './engine'
import { createEffect, defaultEffectSettings } from '../../shared/effects'
import effects from '../../app/schema/actions/effects'
import { addNode, normalizeNodes } from '../../app/utils/state-actions'
import { workflowHasEmptyValues } from '../../app/utils/workflow'

const existingEffect: BlurEffect = {
  type: 'LAYER_BLUR',
  radius: 8,
  visible: true,
  blurType: 'NORMAL'
}

const action = (
  operator: string,
  settings = defaultEffectSettings
): WorkflowNode => ({
  id: 2,
  name: 'Effects',
  data: { operator, args: [JSON.stringify(settings)] },
  inputs: { input: { connections: [{ node: 1, output: 'output' }] } },
  outputs: {}
})

test('adds to a frozen effects array and passes the layer and environment downstream', () => {
  const original = Object.freeze([existingEffect])
  const target = { effects: original }
  const inputData = { input: { operateOn: target, env: { index: 2 } } }
  const outputs: WorkflowOutputs = {}
  new EffectsComponent().worker(action('add'), { input: [inputData] }, outputs)

  assert.deepEqual(target.effects, [
    existingEffect,
    createEffect(defaultEffectSettings)
  ])
  assert.notEqual(target.effects, original)
  assert.equal(original.length, 1)
  assert.equal(outputs.output, inputData)
})

test('set replaces all effects and clear removes them without an argument', () => {
  const target = { effects: [existingEffect, existingEffect] }
  const inputs = { input: [{ input: { operateOn: target } }] }
  const component = new EffectsComponent()
  component.worker(action('set'), inputs, {})
  assert.deepEqual(target.effects, [createEffect(defaultEffectSettings)])

  const clear = action('clear')
  clear.data.args = []
  component.worker(clear, inputs, {})
  assert.deepEqual(target.effects, [])
})

test('fails without modifying the layer for invalid settings or unsupported targets', () => {
  const component = new EffectsComponent()
  const target = { type: 'RECTANGLE', name: 'Card', effects: [existingEffect] }
  const inputs = { input: [{ input: { operateOn: target } }] }
  const invalid = action('set', { ...defaultEffectSettings, radius: -1 })
  assert.throws(
    () => component.worker(invalid, inputs, {}),
    /Blur must be 0 or greater.*RECTANGLE node Card/
  )
  assert.deepEqual(target.effects, [existingEffect])

  invalid.data.args = ['{invalid json']
  assert.throws(() => component.worker(invalid, inputs, {}))
  assert.deepEqual(target.effects, [existingEffect])
  assert.throws(
    () => component.worker(action('unknown'), inputs, {}),
    /Unknown effect action/
  )

  for (const operateOn of [null, { type: 'SLICE', name: 'Slice' }]) {
    assert.throws(
      () =>
        component.worker(
          action('add'),
          { input: [{ input: { operateOn } }] },
          {}
        ),
      /Choose a layer that supports effects/
    )
  }
})

test('invalid effects stop the workflow before a downstream action runs', async () => {
  const target = { effects: [existingEffect] }
  let downstreamRan = false
  class Start extends WorkflowComponent {
    constructor() {
      super('Start')
    }
    worker(_node, _inputs, outputs) {
      outputs.output = { input: { operateOn: target } }
    }
  }
  class Next extends WorkflowComponent {
    constructor() {
      super('Next')
    }
    worker() {
      downstreamRan = true
    }
  }
  const next = action('add')
  next.id = 3
  next.name = 'Next'
  next.inputs.input.connections = [{ node: 2, output: 'output' }]
  const engine = new WorkflowEngine()
  engine.register(new Start())
  engine.register(new EffectsComponent())
  engine.register(new Next())

  await assert.rejects(
    engine.process({
      id: 'effects',
      nodes: {
        1: { id: 1, name: 'Start' },
        2: action('set', { ...defaultEffectSettings, opacity: 101 }),
        3: next
      }
    }),
    /Workflow action "Effects" failed: Opacity/
  )
  assert.equal(downstreamRan, false)
  assert.deepEqual(target.effects, [existingEffect])
})

test('catalog defaults survive saving and run through the registered plugin component', async () => {
  const target = {
    id: 'target',
    type: 'RECTANGLE',
    name: 'Card',
    effects: [existingEffect]
  }
  const messages = []
  const globals = globalThis as typeof globalThis & { figma?: PluginAPI }
  const previousFigma = globals.figma
  globals.figma = {
    getNodeByIdAsync: async () => target,
    ui: { postMessage: message => messages.push(message) }
  } as unknown as PluginAPI

  try {
    for (const item of effects[0].items) {
      const nodes = normalizeNodes(addNode([], item))
      // Match the JSON round trip through Figma client storage.
      const saved = JSON.parse(JSON.stringify(nodes))
      assert.deepEqual(workflowHasEmptyValues(saved), {})
      const workflowNodes = Object.fromEntries(
        Object.values(saved).map((node: WorkflowNode) => [node.id, node])
      )
      await run(
        { id: 'effects', nodes: workflowNodes },
        { operateOn: target, env: {} }
      )
      assert.equal(messages.at(-2).data.message, 'Workflow finished!')
      const expected =
        item.data.operator === 'clear'
          ? []
          : item.data.operator === 'set'
            ? [createEffect(defaultEffectSettings)]
            : [existingEffect, createEffect(defaultEffectSettings)]
      assert.deepEqual(target.effects, expected)
    }
  } finally {
    globals.figma = previousFigma
  }
})
