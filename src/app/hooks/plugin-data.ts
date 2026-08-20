import { useEffect } from 'react'
import {
  DATA_UI_GET,
  DATA_UI_SET,
  appRequestData
} from '../../plugin/actions/storage'
import {
  PLUGIN_DATA_WORKFLOW_MESSAGE,
  PLUGIN_DATA_CHILD_WORKFLOW,
  SET_SELECTION_BY_WORKFLOW_ID,
  REMOVE_SELECTION_ITEM_BY_WORKFLOW_ID,
  WORKFLOW_RUN_COMPLETE
} from '../../plugin/actions/data'

interface PluginDataHandlers {
  setData?: (data?: any) => void
  setDataStatus?: (data?: any) => void
  setWorkflowMessage?: (data?: any) => void
  runChildWorkflow?: (data?: any) => void
  setSelection?: (data?: any) => void
  removeSelectionItem?: (data?: any) => void
  resetWorkflowArgs?: (data?: any) => void
}

const usePluginData = ({
  setData = () => {},
  setDataStatus = () => {},
  setWorkflowMessage = () => {},
  runChildWorkflow = () => {},
  setSelection = () => {},
  removeSelectionItem = () => {},
  resetWorkflowArgs = () => {}
}: PluginDataHandlers) => {
  useEffect(() => {
    appRequestData()

    const handleHttpRequest = async ({ id, url }) => {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        })
        const responseText = await response.text()
        let data: unknown = responseText

        try {
          data = JSON.parse(responseText)
        } catch {
          // Keep non-JSON response bodies as text.
        }

        parent.postMessage(
          {
            pluginMessage: {
              type: 'httprequest-complete',
              nodeId: id,
              data,
              status: response.status
            }
          },
          '*'
        )
      } catch (error) {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'httprequest-complete',
              nodeId: id,
              data: error instanceof Error ? error.message : 'Request failed',
              status: 0
            }
          },
          '*'
        )
      }
    }

    const listener = event => {
      const { type, data } = event.data.pluginMessage

      if (type === 'httprequest') {
        void handleHttpRequest(data)
      }

      if (type === DATA_UI_GET) {
        if (data) {
          setData(data)
        }
      }

      if (type === DATA_UI_SET) {
        if (data) {
          setDataStatus(data)
        }
      }

      if (type === PLUGIN_DATA_WORKFLOW_MESSAGE) {
        setWorkflowMessage(data)
      }

      if (type === PLUGIN_DATA_CHILD_WORKFLOW) {
        runChildWorkflow(data)
      }

      if (type === SET_SELECTION_BY_WORKFLOW_ID) {
        setSelection(data)
      }

      if (type === REMOVE_SELECTION_ITEM_BY_WORKFLOW_ID) {
        removeSelectionItem(data)
      }

      if (type === WORKFLOW_RUN_COMPLETE) {
        resetWorkflowArgs(data.id)
      }
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
  }, [])
}

export default usePluginData
