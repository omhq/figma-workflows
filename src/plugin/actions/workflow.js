import run from './rete'
import { PLUGIN_DATA_WORKFLOW_MESSAGE, PLUGIN_DATA_CHILD_WORKFLOW } from './data'


export function publishWorkflowMessage(messageType, message) {
  figma.ui.postMessage({
    type: PLUGIN_DATA_WORKFLOW_MESSAGE,
    data: {
      messageType: messageType,
      message: message
    }
  })
}

export function publishWorkflowMData(data) {
  figma.ui.postMessage({
    type: PLUGIN_DATA_CHILD_WORKFLOW,
    data: data
  })
}

/**
 * Run a workflow against proper context.
 * Context can be selection, or document.
 * 
 * @param {object} runData Holds run context, and selected "meta data".
 */
export function runWorkflow(runData) {
  const runContext = runData.runContext
  run(runData, runContext).then(() => {})
}
