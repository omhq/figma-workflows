import { WORKFLOW_RUN } from '../../plugin/actions/data'

const runWorkflowHook = (runData) => {
  parent.postMessage({
    pluginMessage: {
      type: WORKFLOW_RUN,
      payload: {
        runData
      }
    }
  }, '*')
}

export default runWorkflowHook
