import assert from 'node:assert/strict'
import test from 'node:test'
import {
  WorkflowComponent,
  WorkflowEngine,
  type WorkflowData,
  type WorkflowInputs,
  type WorkflowNode,
  type WorkflowOutputs
} from './engine'
import PluginStartComponent from './components/StartComponent'
import BlendMixinComponent from './components/BlendMixinComponent'

class StartComponent extends WorkflowComponent {
  constructor() {
    super('Start')
  }

  worker(
    _node: WorkflowNode,
    _inputs: WorkflowInputs,
    outputs: WorkflowOutputs
  ) {
    outputs.output = { input: { env: {}, operateOn: null } }
  }
}

class ActionComponent extends WorkflowComponent {
  constructor() {
    super('Action')
  }

  worker(
    _node: WorkflowNode,
    inputs: WorkflowInputs,
    outputs: WorkflowOutputs
  ) {
    outputs.output = inputs.input[0]
  }
}

const validWorkflow = (): WorkflowData => ({
  id: 'test@0.2.0',
  nodes: {
    '1': {
      id: 1,
      name: 'Start',
      inputs: {},
      outputs: {
        output: { connections: [{ node: 2, input: 'input' }] }
      }
    },
    '2': {
      id: 2,
      name: 'Action',
      inputs: {
        input: { connections: [{ node: 1, output: 'output' }] }
      },
      outputs: {}
    }
  }
})

test('processes a connected workflow', async () => {
  const engine = new WorkflowEngine()
  engine.register(new StartComponent())
  engine.register(new ActionComponent())

  await assert.doesNotReject(engine.process(validWorkflow()))
})

test('processes the simple Start to BlendMixin workflow that previously crashed', async () => {
  const workflow = validWorkflow()
  workflow.nodes['2'].name = 'BlendMixin'
  workflow.nodes['2'].prettyName = 'Set opacity'
  workflow.nodes['2'].data = {
    api: 'figma',
    args: ['50 / 100'],
    argDefinitions: [{ operator: 'opacity', type: 'number' }]
  }

  const engine = new WorkflowEngine()
  engine.register(new PluginStartComponent({ trigger: 'manual', env: {} }))
  engine.register(new BlendMixinComponent())

  await assert.doesNotReject(engine.process(workflow))
})

test('does not invoke a downstream action after its upstream worker fails', async () => {
  class BrokenStartComponent extends WorkflowComponent {
    constructor() {
      super('Start')
    }

    worker() {
      throw new Error('root failure')
    }
  }

  let actionRan = false
  class TrackingActionComponent extends ActionComponent {
    worker(
      node: WorkflowNode,
      inputs: WorkflowInputs,
      outputs: WorkflowOutputs
    ) {
      actionRan = true
      super.worker(node, inputs, outputs)
    }
  }

  const engine = new WorkflowEngine()
  engine.register(new BrokenStartComponent())
  engine.register(new TrackingActionComponent())

  await assert.rejects(
    engine.process(validWorkflow()),
    /Workflow action "Start" failed: root failure/
  )
  assert.equal(actionRan, false)
})

test('reports an unconnected action instead of passing undefined input', async () => {
  const workflow = validWorkflow()
  workflow.nodes['2'].inputs = { input: { connections: [] } }

  const engine = new WorkflowEngine()
  engine.register(new StartComponent())
  engine.register(new ActionComponent())

  await assert.rejects(
    engine.process(workflow),
    /Input "input" on "Action" is not connected/
  )
})
