import React, { useEffect, useState } from 'react'
import SuccessAlert from '../alerts/SuccessAlert'
import WarningAlert from '../alerts/WarningAlert'
import FailAlert from '../alerts/FailAlert'
import {
  addShortcut,
  setActiveShortcut,
  setRoute,
  removeShortcut,
  clearWorkflowMessage,
  clearAllWorkflowMessages,
  setAutoRunSelectedWorkflows,
  clearAutoRunSelectedWorkflows
} from '../../reducers/main'
import ShortcutItem from '../shortcut-item'
import runWorkflowHook from '../../hooks/workflow'
import nodeSelection from '../../hooks/node-selection'
import { workflowHasEmptyValues, normalizeWorkflowWithKeys, generateWorkflowId } from '../../utils/workflow'
import { Spinner } from '../icons'

const Home = ({ state, dispatch }) => {
  const { autoRunSelectedWorkflows, status: { loading } } = state
  const [selectedNodes, setSelectedNodes] = useState([])
  const newId = generateWorkflowId()

  const runWorkflow = item => {
    dispatch(clearAllWorkflowMessages())
    const missingargs = workflowHasEmptyValues(item.nodes)
    if (Object.keys(missingargs).length) {
      dispatch(setRoute('run-workflow-empty'))
      dispatch(setActiveShortcut(item))
    } else {
      let normalized = {...item}
      normalized.nodes = normalizeWorkflowWithKeys(normalized.nodes)
      runWorkflowHook(normalized)
    }
  }

  const setSelectedAutoWorkflow = id => {
    if (state.autoRunSelectedWorkflows[0] === id) {
      dispatch(clearAutoRunSelectedWorkflows())
    } else {
      dispatch(setAutoRunSelectedWorkflows(id))
    }
  }

  nodeSelection({
    setSelected: (data) => {
      setSelectedNodes(data)
    }
  })

  useEffect(() => {
    const workflow = state.shortcutsById[autoRunSelectedWorkflows[0]]
    if (workflow) {
      if (selectedNodes.length) {
        runWorkflow(workflow)
      }
    }
  }, [autoRunSelectedWorkflows, selectedNodes])

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-50 top-0">
        <span className="font-medium text-sm">My workflows</span>
        <button
          type="button"
          className="rounded-md border border-2 border-gray-600 text-black text-xs px-2 py-1"
          title="Add Shortcut"
          onClick={() => [
            dispatch(addShortcut({ id: newId })),
            dispatch(setRoute('add-shortcut'))
          ]}
        >
          New
        </button>
      </div>
      <div
        className="overflow-auto overflow-x-hidden"
        style={{ height: 'calc(100% - 47px)' }}
      >
        <div className="w-full absolute z-50">
          {state.workflowSuccessMessage && (
            <SuccessAlert
              message={state.workflowSuccessMessage}
              onAutoClose={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 0
                  })
                )
              }
              onHide={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 0
                  })
                )
              }
            />
          )}

          {state.workflowWarningMessage && (
            <WarningAlert
              message={state.workflowWarningMessage}
              onAutoClose={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 2
                  })
                )
              }
              onHide={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 2
                  })
                )
              }
            />
          )}

          {state.workflowErrorMessage && (
            <FailAlert
              message={state.workflowErrorMessage}
              onAutoClose={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 1
                  })
                )
              }
              onHide={() =>
                dispatch(
                  clearWorkflowMessage({
                    messageType: 1
                  })
                )
              }
            />
          )}
        </div>

        {Object.keys(state.shortcutsById).length === 0 && (
          <div className="text-center pt-4">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No workflows
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new workflow.
            </p>
          </div>
        )}

        <div className="px-2 pt-4">
          {Object.keys(state.shortcutsById).map(id => (
            <ShortcutItem
              key={id}
              onDelete={() => dispatch(removeShortcut(id))}
              onRun={runWorkflow}
              onSetSelectedAutoWorkflow={setSelectedAutoWorkflow}
              onEdit={() => [
                dispatch(setActiveShortcut(state.shortcutsById[id])),
                dispatch(setRoute('edit-shortcut'))
              ]}
              item={state.shortcutsById[id]}
              state={state}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
