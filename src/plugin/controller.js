import { WORKFLOW_RUN } from './actions/data'
import { runWorkflow } from './actions/workflow'
import { selectedNodesToUI } from './actions/nodes'
import { INFO_GET, appGetInfo } from './actions/info'
import {
  DATA_SET,
  DATA_GET,
  pluginSetData,
  pluginGetData
} from './actions/storage'

figma.showUI(__html__, { width: 300, height: 400 })

figma.on('selectionchange', () => {
  selectedNodesToUI()
})

figma.ui.onmessage = msg => {
  const { type } = msg

  if (type === INFO_GET) {
    appGetInfo()
  }

  if (type === WORKFLOW_RUN) {
    const { runData } = msg.payload
    runWorkflow(runData)
  }

  if (msg.type === DATA_SET) {
    pluginSetData(msg)
  }

  if (msg.type === DATA_GET) {
    pluginGetData()
  }
}
