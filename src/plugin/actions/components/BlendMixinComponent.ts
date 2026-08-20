import { WorkflowComponent } from '../engine'
import { publishWorkflowMessage } from './../workflow'
import {
  normalizeArgs,
  generateErrorMessage,
  parseExpression
} from '../../utils'

class BlendMixinComponent extends WorkflowComponent {
  constructor() {
    super('BlendMixin')
  }

  worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const { api, args, argDefinitions } = data

    const operateOn = inputData.input.operateOn
    const env = inputData.input.env
    let operator = data['operator']
    let isFunction = false

    if (operateOn) {
      if (api == 'figma') {
        if (operator) {
          isFunction = typeof operateOn[operator] === 'function'
        }

        const normalizedArgs = normalizeArgs(args, argDefinitions, isFunction)

        if (isFunction) {
          const normalizedValues = []

          for (const value of normalizedArgs) {
            parseExpression(operateOn, env, value)
              .then(ret => {
                if (ret !== null) {
                  normalizedValues.push(ret)
                }
              })
              .catch(e => {
                publishWorkflowMessage(
                  2,
                  generateErrorMessage(e.message, operateOn)
                )
              })
              .then(() => {
                try {
                  operateOn[operator].apply(operateOn, normalizedValues)
                } catch (e) {
                  publishWorkflowMessage(
                    2,
                    generateErrorMessage(e.message, operateOn)
                  )
                }
              })
          }
        } else {
          try {
            normalizedArgs.forEach(function (value, i) {
              parseExpression(operateOn, env, value)
                .then(ret => {
                  if (ret !== null) {
                    operator = argDefinitions[i]['operator']
                    operateOn[operator] = ret
                  }
                })
                .catch(e => {
                  publishWorkflowMessage(
                    2,
                    generateErrorMessage(e.message, operateOn)
                  )
                })
            })
          } catch (e) {
            publishWorkflowMessage(
              2,
              generateErrorMessage(e.message, operateOn)
            )
          }
        }
      }
    }

    if ('outputs' in node) {
      outputObj.input.operateOn = operateOn
      outputs['output'] = outputObj
    }
  }
}

export default BlendMixinComponent
