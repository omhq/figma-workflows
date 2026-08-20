import { WorkflowComponent } from '../engine'

class StartComponent extends WorkflowComponent {
  constructor(data) {
    super('Start')
    this.data = data
  }

  /**
   * Currently, the idea for the start component worker is to initialize everything
   * that all the consecuent nodes will need,  like loaded fonts for text operations.
   *
   * TODO: The start components needs to receive initialization instructions.
   * To start, it needs to receive a map of all fonts to load that other components require.
   *
   * @param {object} node Workflow node.
   * @param {object} inputs Workflow inputs. Empty in this case since it is the starting node.
   * @param {object} outputs Outut to the next node in line.
   */
  async worker(node, inputs, outputs) {
    const data = node.data
    const inputData = this.data
    const outputObj = inputData

    const operateOn = inputData.operateOn
    let fnode = null
    const output = { ...this.data }

    if (operateOn) {
      if (Array.isArray(operateOn)) {
        output.operateOn = operateOn
      } else {
        fnode = await figma.getNodeByIdAsync(operateOn.id)
        if (fnode && fnode.type == 'TEXT') {
          if (data['loadFonts']) {
            await figma.loadFontAsync({
              family: fnode.fontName.family,
              style: fnode.fontName.style
            })
          }
        }

        output.operateOn = fnode
      }
    }

    outputObj.input = { ...output }
    outputs['output'] = outputObj
  }
}

export default StartComponent
