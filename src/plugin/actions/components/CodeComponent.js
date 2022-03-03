import Rete from 'rete'
import { publishWorkflowMessage } from './../workflow'


const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

async function codeRunner(codeString, inputData, env) {
  return new Promise((resolve, reject) => {
    try {
      const F = new AsyncFunction(codeString).bind({
        env: env
      })
      const ret = F(inputData)

      if (ret) {
        if (typeof ret === 'function') {
          ret.then(e => {
            resolve(e)
          }).catch(e => {
            reject(e)
          })
        } else {
          resolve(ret)
        }
      }
    } catch(e) {
      resolve(e)
    }
  })
}

class CodeComponent extends Rete.Component {
  constructor() {
    super('Code')
  }

  async worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const userCodeString = data.args[0]

    let operateOn = inputData.input.operateOn
    let env = inputData.input.env
    let output = null
    let okToRun = true

    if (userCodeString && userCodeString.includes('figma.ui')) {
      okToRun = false
      publishWorkflowMessage(2, `Error in code: use of figma.ui not allowed`)
    }

    if (okToRun) {
      try {
        const baseStartCode = `
const inputData = arguments[0]
const env = this.env
let input = inputData.input.operateOn
let httpResponse = inputData.input.httpResponse
let __count = 0

const __detectInfiniteLoop = () => {
  if (__count > 5000) {
    throw new Error('Infinite Loop detected')
  }
  __count += 1
}`

        const baseEndCode = `
return input`
        const codeString = `
${baseStartCode}

try {
  ${userCodeString}
} catch(e) {
  return e
}
${baseEndCode}`

        await codeRunner(codeString, inputData, env)
        .then(ret => {
          if (ret?.__proto__ instanceof Error) {
            publishWorkflowMessage(2, `Error in script: ${ret.message}`)
            output = operateOn
          } else {
            output = ret
          }
        }).catch(e => {
          publishWorkflowMessage(2, `Error in script: ${e}`)
        })
      } catch (e) {
        publishWorkflowMessage(2, e.message)
      }
    }

    if ('outputs' in node) {
      if (output) {
        outputObj.input.operateOn = output
      }

      outputs['output'] = outputObj
    }
  }
}

export default CodeComponent
