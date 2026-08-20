import { WorkflowComponent } from '../engine'
import { publishWorkflowMessage } from './../workflow'
import {
  normalizeArgs,
  normalizeComplexArgs,
  generateErrorMessage,
  parseExpression
} from '../../utils'

const context = []
context['searchReplace'] = searchReplace

/**
 * string.replace wrapper.
 *
 * @param {string} string Original string.
 * @param {string} search String to search for.
 * @param {string} replace String to replace with.
 * @returns {string} Final replaced string.
 */
function searchReplace(string, search, replace) {
  return string.replace(search, replace)
}

/**
 * Execute custom function.
 *
 * @param {string} fnName Function name to apply.
 * @param {object} ctx Figma node context.
 * @param {string} propValue Figma targeted property value.
 * @returns {*} Returns the executed result.
 */
function execFn(fnName, ctx, propValue, args) {
  const fullArgs = [propValue].concat(args)
  return ctx[fnName].apply(ctx, fullArgs)
}

/**
 * Prepare a custom function.
 *
 * @param {object} fnode Figma node that is being passed around as a reference.
 * @param {object} data Full instructions object. function, api, args, etc...
 * @param {string} operator Name of the function to call, or property to set.
 * @param {string} args Function arguments.
 */
function applyCustomFunction(fnode, data, operator, args) {
  const prop = data['property']
  const propValue = fnode[prop]
  const ret = execFn(operator, context, propValue, args)
  fnode[prop] = ret
}

class TextNodeComponent extends WorkflowComponent {
  constructor() {
    super('TextNode')
  }

  worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const { api, args, argDefinitions } = data

    const operateOn = inputData.input.operateOn
    const env = inputData.input.env
    let operator = data['operator']
    const isFunction =
      api === 'custom'
        ? typeof context[operator] === 'function'
        : typeof operateOn?.[operator] === 'function'
    const normalizedArgs = normalizeArgs(args, argDefinitions, isFunction)

    if (operateOn && operateOn.type == 'TEXT') {
      if (api == 'figma') {
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
              const originalValue = value

              if (typeof value === 'object') {
                value = originalValue.value
              }

              parseExpression(operateOn, env, value)
                .then(ret => {
                  if (ret !== null) {
                    operator = argDefinitions[i]['operator']

                    if (typeof originalValue === 'object') {
                      originalValue.value = ret
                      const normalizedComplex = normalizeComplexArgs(
                        originalValue,
                        argDefinitions[i]
                      )
                      operateOn[operator] = normalizedComplex
                    } else {
                      operateOn[operator] = ret
                    }
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

      if (api == 'custom' && isFunction) {
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
                applyCustomFunction(operateOn, data, operator, normalizedValues)
              } catch (e) {
                publishWorkflowMessage(
                  2,
                  generateErrorMessage(e.message, operateOn)
                )
              }
            })
        }
      }
    }

    if ('outputs' in node) {
      outputObj.input.operateOn = operateOn
      outputs['output'] = outputObj
    }
  }
}

export default TextNodeComponent
