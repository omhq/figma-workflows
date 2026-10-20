import { useEffect, useRef, useState } from 'react'
import { Ellipses } from '../icons'
import { Square } from 'lucide-react'
import { useClickOutside } from '../../hooks/click-outside'
import usePrevious from '../../hooks/use-previous'
import { setTimer } from '../../../plugin/utils'
import { getActionsCount } from '../../schema/shortcut'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const ShortcutItem = ({
  item,
  state,
  onDelete,
  onEdit,
  onRun,
  onSetSelectedAutoWorkflow
}) => {
  const { selection, autoRunSelectedWorkflows } = state
  const selectionCount = (selection[item.id] || []).length
  const prevSelectionCount = usePrevious(selectionCount)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [autoRunSelected, setAutoRunSelected] = useState(false)
  const actionsCount = getActionsCount(item)
  const runTrigger = item.runContext.trigger
  const drop = useRef<HTMLDivElement>(null)

  useClickOutside(drop, () => setShowDropdown(false))

  useEffect(() => {
    setAutoRunSelected(item.id === autoRunSelectedWorkflows[0])
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
      <Card
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
            : autoRunSelected
              ? 'border-green-500 hover:border-green-700'
              : 'border-gray-300 hover:border-indigo-500'
        } relative mb-1 w-full cursor-pointer flex-row items-center justify-between px-3 py-2 hover:shadow-md`}
      >
        <div className="text-xs font-medium">
          {item.prettyName || 'Untitled'}
        </div>
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
              <Button
                aria-label="Stop workflow"
                disabled
                size="icon-sm"
                variant="ghost"
              >
                <Square className="h-4 w-4 fill-blue-700 text-blue-700" />
              </Button>
            ) : (
              <Button
                aria-label="Workflow actions"
                onClick={e => {
                  e.stopPropagation()
                  setShowDropdown(!showDropdown)
                }}
                size="icon-sm"
                variant="ghost"
              >
                <Ellipses className="size-4 text-black" />
              </Button>
            )}

            {showDropdown && !isRunning && (
              <div className="-right-2 absolute bg-black border border-black mt-1 origin-center rounded-sm shadow top-full z-20">
                <div className="bg-black w-16 p-1">
                  <Button
                    className="h-6 w-full justify-start px-2 text-white hover:bg-white/10 hover:text-white"
                    onClick={e => {
                      e.stopPropagation()
                      onEdit()
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="h-6 w-full justify-start px-2 text-red-400 hover:bg-white/10 hover:text-red-300"
                    onClick={e => {
                      e.stopPropagation()
                      setShowDropdown(false)
                      setShowDeleteModal(true)
                    }}
                  >
                    Delete
                  </Button>
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
      </Card>
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center min-h-screen p-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                onClick={() => setShowDeleteModal(false)}
                className="absolute inset-0 bg-gray-500 opacity-75"
              ></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="relative z-10 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Confirm delete
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone. This will permanently delete
                      this workflow.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => onDelete()}
                  className="w-full sm:ml-3 sm:w-auto"
                  variant="destructive"
                >
                  <span>Delete</span>
                </Button>

                <Button
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShortcutItem
