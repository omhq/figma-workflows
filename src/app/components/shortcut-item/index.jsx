import React, { useState, useEffect, useRef } from 'react'
import { Ellipses } from '../icons'
import { StopIcon } from '@heroicons/react/outline'
import { useClickOutside } from '../../hooks/click-outside'
import usePrevious from '../../hooks/use-previous'
import { setTimer } from '../../../plugin/utils'
import { getActionsCount } from '../../schema/shortcut'


const ShortcutItem = ({ item, state, onDelete, onEdit, onRun, onSetSelectedAutoWorkflow }) => {
  const { selection, autoRunSelectedWorkflows } = state
  const selectionCount = (selection[item.id] || []).length
  const prevSelectionCount = usePrevious(selectionCount)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [autoRunSelected, setAutoRunSelected] = useState(false)
  const actionsCount = getActionsCount(item)
  const runTrigger = item.runContext.trigger
  const drop = useRef()

  useClickOutside(drop, () => setShowDropdown(false))

  useEffect(() => {
    setAutoRunSelected((item.id === autoRunSelectedWorkflows[0]))
  }, [item, autoRunSelectedWorkflows])

  useEffect(() => {
    if (selectionCount > 0) {
      setIsRunning(true)
    }

    if (selectionCount < prevSelectionCount && selectionCount === 0) {
      setTimer(() => setIsRunning(false))
    }

    return clearTimeout(setTimer())
  }, [selectionCount, prevSelectionCount])

  return (
    <div className={`w-full item-${item.id}`}>
      <div
        onClick={e => {
          e.stopPropagation()
          if (runTrigger === 'manual') {
            if (!isRunning) {
              onRun(item)
              setShowDropdown(false)
            }
          }

          if (runTrigger === 'auto') {
            onSetSelectedAutoWorkflow(item.id)
          }
        }}
        className={`${
          isRunning
            ? 'overflow-hidden border-blue-700'
            : (
              autoRunSelected
              ? 'border-green-500 hover:border-green-700'
              : 'border-gray-300 hover:border-indigo-500')
        } relative mb-1 px-1 w-full relative border hover:shadow-md rounded-md cursor-pointer flex justify-between px-3 py-2 items-center`}
      >

        <div className="text-xs font-medium">{item.prettyName || "Untitled"}</div>
        <div className="flex items-center">
          {isRunning ? (
            <span className="z-20 block text-sm text-blue-700 mt-1">
              Running...
            </span>
          ) : (
            <span className="text-xs text-gray-600 mr-2">
              {`${actionsCount} action${actionsCount > 1 ? 's' : actionsCount === 0 ? 's' : ''}`}
            </span>
          )}

          <div ref={drop}>
            {isRunning ? (
              <button
                type="button"
                onClick={e => {
                  // stop action
                }}
              >
                <StopIcon className="h-5 w-5 text-blue-700" />
              </button>
            ) : (
              <button
                type="button"
                className="w-5 h-5"
                onClick={e => {
                  e.stopPropagation()
                  setShowDropdown(!showDropdown)
                }}
              >
                <Ellipses className="h-full w-full text-black font-semibold" />
              </button>
            )}

            {showDropdown && !isRunning && (
              <div className="-right-2 absolute bg-black border border-black mt-1 origin-center rounded-sm shadow top-full z-20">
                <div className="bg-black w-16 p-1">
                  <button
                    className="w-full px-2 py-0.5 text-xs text-left text-white"
                    onClick={e => {
                      e.stopPropagation()
                      onEdit()
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-2 py-0.5 text-xs text-red-500 text-left"
                    onClick={e => {
                      e.stopPropagation()
                      setShowDeleteModal(true)
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`${
            isRunning ? 'bg-blue-200 opacity-25 ' : ''
          }w-0 absolute bottom-0 h-full left-0 top-0 transition-all z-10`}
          style={{
            transitionProperty: 'width',
            transitionDuration: '0.5s',
            transitionDelay: '0.5s',
            width: isRunning ? `${(1 / (selectionCount || 1)) * 100}%` : 0
          }}
        />
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center min-h-screen p-4">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">

                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Confirm delete
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. This will permanently delete this workflow.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => onDelete()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700  focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <span>Delete</span>
                </button>

                <button onClick={() => setShowDeleteModal(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShortcutItem
