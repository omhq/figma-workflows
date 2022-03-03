import Rete from 'rete'
import { publishWorkflowMessage, publishWorkflowMData } from './../workflow'
import { normalizeArgs, generateErrorMessage, parseExpression } from '../../utils'


class BaseNodePropertiesComponent extends Rete.Component {
  constructor() {
    super('BaseNode')
  }

  async worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const children = node.children
    const { api, args, argDefinitions } = data

    let operateOn = inputData.input.operateOn
    let env = inputData.input.env
    let output = null
    let operator = data['operator']
    let isFunction = false

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
          for (const [i, value] of normalizedArgs.entries()) {
            operator = argDefinitions[i]['operator']

            if (operator === 'create') {
              switch(value) {
                case 'rectangle':
                  output = figma.createRectangle()
                  break

                case 'line':
                  output = figma.createLine()
                  break

                case 'ellipse':
                  output = figma.createEllipse()
                  break

                case 'polygon':
                  output = figma.createPolygon()
                  break

                case 'star':
                  output = figma.createStar()
                  break

                case 'text':
                  output = figma.createText()
                  await figma.loadFontAsync({
                    family: output.fontName.family,
                    style: output.fontName.style
                  })
                  output.characters = 'new text node!'
                  break

                case 'frame':
                  output = figma.createFrame()
                  break

                default:
                  break
              }

              if (operateOn && operateOn.type === 'FRAME') {
                operateOn.insertChild(0, output)
              }
            } else {
              parseExpression(operateOn, env, value).then(ret => {
                if (ret !== null) {
                  operator = argDefinitions[i]['operator']
                  operateOn[operator] = ret
                }
              }).catch(e => {
                publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
              })
            }
          }
        } catch (e) {
          publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
        }
      }
    } else {
      if (operator === 'selection-current') {
        if (figma.currentPage.selection.length > 0) {
          output = figma.currentPage.selection
        }
      }

      if (operator === 'loop') {
        if (operateOn && Object.keys(operateOn).length) {
          for (const [i, value] of operateOn.entries()) {
            if (children && children.length) {
              publishWorkflowMData({
                output: {
                  operateOn: value,
                  env: {...env, index: i}
                },
                children
              })
            }
          }
        }
      }

      if (operator === 'remove') {
        const fnode = operateOn
        fnode.remove()
        operateOn = null
      }

      if (operator === 'if') {
        const fnode = operateOn
        const normalizedConditioalIf = normalizeArgs(args, argDefinitions, isFunction)[0]

        if (normalizedConditioalIf) {
          const conditioalIfProperty = normalizedConditioalIf.property
          const conditioalIfOperator = normalizedConditioalIf.operator
          const conditioalIfValue = normalizedConditioalIf.value
          let okToRun = false

          function loop(conditioalIfProperty, conditioalIfValue) {
            let normalizedValues = []
            return new Promise(resolve => {
              for (const [i, value] of [conditioalIfProperty, conditioalIfValue].entries()) {
                parseExpression(fnode, env, value).then(ret => {
                  if (ret !== null) {
                    normalizedValues.push(ret)
                  }
                }).catch(e => {
                  publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
                })
              }

              resolve(normalizedValues)
            })
          }

          loop(conditioalIfProperty, conditioalIfValue).then(normalizedValues => {
            switch(conditioalIfOperator) {
              case 'equal':
                if (normalizedValues[0] == normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'not-equal':
                if (normalizedValues[0] != normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'strict-equal':
                if (normalizedValues[0] === normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'strict-not-equal':
                if (normalizedValues[0] !== normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'greater-than':
                if (normalizedValues[0] > normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'greater-than-or-equal':
                if (normalizedValues[0] >= normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'less-than':
                if (normalizedValues[0] < normalizedValues[1]) {
                  okToRun = true
                }
                break
              case 'less-than-or-equal':
                if (normalizedValues[0] <= normalizedValues[1]) {
                  okToRun = true
                }
                break
              default:
                break
            }

            if (okToRun) {
              publishWorkflowMData({
                output: {
                  operateOn: fnode,
                  env: {...env}
                },
                children
              })
            }
          })
        }
      }

      if (operator === 'repeat') {
        const fnode = operateOn
        const value = normalizeArgs(args, argDefinitions, isFunction)[0]

        parseExpression(operateOn, env, value).then(ret => {
          if (ret !== null) {
            for (let i = 0; i < parseInt(ret); i++) {
              publishWorkflowMData({
                output: {
                  operateOn: fnode,
                  env: {...env, index: i}
                },
                children
              })
            }
          }
        }).catch(e => {
          publishWorkflowMessage(2, generateErrorMessage(e.message, operateOn))
        })
      }
    }

    // Run sub workflow if there are children nodes in this one.
    // The output from this step becomes the new operateOn object
    // if it is set or else it stays the same.
    if (!['loop', 'if', 'else', 'repeat'].includes(operator)) {
      if (children && children.length) {
        publishWorkflowMData({
          output: {
            operateOn: output ? output : operateOn,
            env: {...env}
          },
          children
        })
      }
    }

    if ('outputs' in node) {
      outputObj.input.operateOn = operateOn
      outputs['output'] = outputObj
    }
  }
}

export default BaseNodePropertiesComponent
