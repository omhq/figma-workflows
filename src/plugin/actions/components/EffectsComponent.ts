import {
  WorkflowComponent,
  type WorkflowInputs,
  type WorkflowNode,
  type WorkflowOutputs
} from '../engine'
import { createEffect } from '../../../shared/effects'
import { generateErrorMessage } from '../../utils'

class EffectsComponent extends WorkflowComponent {
  constructor() {
    super('Effects')
  }

  worker(node: WorkflowNode, inputs: WorkflowInputs, outputs: WorkflowOutputs) {
    const inputData = inputs.input[0]
    const target = inputData.input.operateOn

    try {
      if (!target || !('effects' in target)) {
        throw new Error('Choose a layer that supports effects.')
      }

      switch (node.data?.operator) {
        case 'clear':
          target.effects = []
          break
        case 'add':
        case 'set': {
          const effect = createEffect(JSON.parse(node.data.args[0]))
          // Figma effect arrays are immutable: always assign a fresh array.
          target.effects =
            node.data.operator === 'add'
              ? [...target.effects, effect]
              : [effect]
          break
        }
        default:
          throw new Error('Unknown effect action.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(generateErrorMessage(message, target))
    }

    outputs.output = inputData
  }
}

export default EffectsComponent
