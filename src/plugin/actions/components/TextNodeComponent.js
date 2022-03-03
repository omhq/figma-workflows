import Rete from 'rete'
import { publishWorkflowMessage } from './../workflow'
import { normalizeArgs, normalizeComplexArgs, generateErrorMessage, parseExpression } from '../../utils'


let context = []
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
function execFn(fnName, ctx, propValue, /*, args */)  {
  let args = Array.prototype.slice.call(arguments, 3)[0]
  let fullArgs = [propValue].concat(args)
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

class TextNodeComponent extends Rete.Component {
  constructor() {
    super('TextNode')
  }

  worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const { api, args, argDefinitions } = data

    let operateOn = inputData.input.operateOn
    let env = inputData.input.env
    let operator = data['operator']
    let isFunction = false

    if (operateOn && operateOn.type == 'TEXT') {
      if (api == 'figma') {
        if (operator) {
          isFunction = (typeof operateOn[operator] === 'function')
        }

        const normalizedArgs = normalizeArgs(args, argDefinitions, isFunction)

        if (isFunction) {
          let normalizedValues = []

          for (const [i, value] of normalizedArgs.entries()) {
            parseExpression(operateOn, env, value).then(ret => {
              if (ret !== null) {
                normalizedValues.push(ret)
              }
            }).catch(e => {
              publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
            }).then(() => {
              try {
                operateOn[operator].apply(operateOn, normalizedValues)
              } catch(e) {
                publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
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

              parseExpression(operateOn, env, value).then(ret => {
                if (ret !== null) {
                  operator = argDefinitions[i]['operator']

                  if (typeof originalValue === 'object') {
                    originalValue.value = ret
                    const normalizedComplex = normalizeComplexArgs(originalValue, argDefinitions[i])
                    operateOn[operator] = normalizedComplex
                  } else {
                    operateOn[operator] = ret
                  }
                }
              }).catch(e => {
                publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
              })
            })
          } catch(e) {
            publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
          }
        }
      }

      if (api == 'custom' && isFunction) {
        let normalizedValues = []

        for (const [i, value] of normalizedArgs.entries()) {
          parseExpression(operateOn, env, value).then(ret => {
            if (ret !== null) {
              normalizedValues.push(ret)
            }
          }).catch(e => {
            publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
          }).then(() => {
            try {
              applyCustomFunction(operateOn, data, operator, normalizedValues)
            } catch(e) {
              publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
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
