import React, { useReducer } from 'react'
import '../styles/tailwind.output.css'
import '../styles/ui.css'
import Home from './home'
import Shortcut from './shortcut'
import ActionList from './action-list'
import RunWorkflowEmpty from './run-workflow-empty'
import runWorkflowHook from '../hooks/workflow'
import {
  normalizeWorkflowWithKeys,
  generateWorkflowId
} from '../utils/workflow'
import {
  reducer,
  initialState,
  setData,
  setWorkflowMessage,
  setSelection,
  removeSelectionItem,
  clearAutoRunSelectedWorkflows,
  resetWorkflowArgsById
} from '../reducers/main'
import usePluginData from '../hooks/plugin-data'

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  usePluginData({
    setData: (data) => dispatch(setData(data)),
    setDataStatus: (data) => {},
    setWorkflowMessage: (data) => dispatch(setWorkflowMessage(data)),
    runChildWorkflow: (data) => {
      const { output } = data
      const workflowId = generateWorkflowId()
      const children = normalizeWorkflowWithKeys(data.children)

      if (output) {
        const runData = {
          id: workflowId,
          nodes: children,
          prettyName: workflowId,
          runContext: {...output}
        }
        runWorkflowHook(runData)
      } else {
        const runData = {
          id: workflowId,
          nodes: children,
          prettyName: workflowId,
          runContext: {
            operateOn: null,
            env: {}
          }
        }
        runWorkflowHook(runData)
      }
    },
    setSelection: (data) => dispatch(setSelection(data)),
    removeSelectionItem: (data) => dispatch(removeSelectionItem(data)),
    resetWorkflowArgs: (workflowId) => dispatch(resetWorkflowArgsById(workflowId))
  })

  return (
    <div
      className="container flex flex-col h-full overflow-x-hidden"
      onClick={() => {
        dispatch(clearAutoRunSelectedWorkflows())
      }}
    >
      {['home'].includes(state.route) && (
        <Home
          state={state}
          dispatch={dispatch}
        />
      )}
      {['add-shortcut'].includes(state.route) && (
        <Shortcut
          state={state}
          dispatch={dispatch}
        />
      )}
      {['edit-shortcut'].includes(state.route) && (
        <Shortcut
          state={state}
          dispatch={dispatch}
          isEditing
        />
      )}
      {['add-action'].includes(state.route) && (
        <ActionList
          state={state}
          dispatch={dispatch}
        />
      )}
      {['run-workflow-empty'].includes(state.route) && (
        <RunWorkflowEmpty
          state={state}
          dispatch={dispatch}
        />
      )}
    </div>
  )
}

export default App
