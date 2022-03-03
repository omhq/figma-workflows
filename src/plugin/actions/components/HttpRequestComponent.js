import Rete from 'rete'


class HttpRequestComponent extends Rete.Component {
  constructor() {
    super('HttpRequest')
  }

  async worker(node, inputs, outputs) {
    const inputData = inputs['input'][0]
    const outputObj = inputData
    const data = node.data
    const url = data.args[0]
    const delay = ms => new Promise(res => setTimeout(res, ms))
    const httpResponse = {
      data: null,
      status: null
    }
    const cb = (pluginMessage) => {
      const { nodeId, data, status } = pluginMessage

      if (nodeId === node.id) {
        httpResponse.data = data
        httpResponse.status = status
        requesting = false
      }
    }

    let requesting = true

    figma.ui.postMessage({
      type: 'httprequest',
      data: { id: node.id, url: url }
    })

    figma.ui.on('message', cb)

    while (requesting) {
      await delay(500)
    }

    if (requesting === false) {
      figma.ui.off('message', cb)
    }

    if ('outputs' in node) {
      if (httpResponse) {
        outputObj.input.httpResponse = httpResponse
      }

      outputs['output'] = outputObj
    }
  }
}

export default HttpRequestComponent
