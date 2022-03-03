import { useEffect } from 'react'
import axios from 'axios'
import { DATA_UI_GET, DATA_UI_SET, appRequestData } from '../../plugin/actions/storage'
import {
  PLUGIN_DATA_WORKFLOW_MESSAGE,
  PLUGIN_DATA_CHILD_WORKFLOW,
  SET_SELECTION_BY_WORKFLOW_ID,
  REMOVE_SELECTION_ITEM_BY_WORKFLOW_ID,
  WORKFLOW_RUN_COMPLETE
} from '../../plugin/actions/data'


const usePluginData = ({
  setData = () => {},
  setDataStatus = () => {},
  setWorkflowMessage = () => {},
  runChildWorkflow = () => {},
  setSelection = () => {},
  removeSelectionItem = () => {},
  resetWorkflowArgs = () => {}
}) => {
  useEffect(() => {
    appRequestData()

    const listener = event => {
      const { type, data } = event.data.pluginMessage

      if (type === 'httprequest') {
        const { id, url } = data
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
        axios.get(`${url}`, config).then((resp) => {
          parent.postMessage({
            pluginMessage: {
              type: 'httprequest-complete',
              nodeId: id,
              data: resp.data,
              status: resp.status
            }
          }, '*')
        }).catch(resp => {
          parent.postMessage({
            pluginMessage: {
              type: 'httprequest-complete',
              nodeId: id,
              data: resp.response.data,
              status: resp.response.status
            }
          }, '*')
        })
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
