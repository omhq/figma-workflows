import React, { useEffect, useState, useRef } from 'react'
import { ReactSortable } from 'react-sortablejs'
import './styles.css'
import runWorkflowHook from '../../hooks/workflow'
import {
  workflowHasEmptyValues,
  normalizeWorkflowWithKeys
} from '../../utils/workflow'
import Node from './Node'

import {
  setRoute,
  saveShortcut,
  editArgsShortcut,
  editRunContext,
  setActiveShortcut,
  removeAction,
  updateAction,
  editShortcut,
  clearWorkflowMessage,
  clearAllWorkflowMessages,
  clearAutoRunSelectedWorkflows,
  setWorkflowAdded,
  openNodeToggle
} from '../../reducers/main'
import { PlusCircleIcon, PlayIcon } from '@heroicons/react/outline'
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'
import SuccessAlert from '../alerts/SuccessAlert'
import WarningAlert from '../alerts/WarningAlert'
import FailAlert from '../alerts/FailAlert'
import { Spinner } from '../../components/icons'
import { setTimer } from '../../../plugin/utils'

const sortableOptions = {
  direction: 'vertical',
  animation: 150,
  fallbackOnBody: true,
  fallbackTolerance: 5,
  emptyInsertThreshold: 2,
  swapThreshold: 1,
  ghostClass: 'ghost',
  group: 'shared',
  dragClass: 'sortable-drag',
  choseClass: 'sortable-chosen',
  filter: '.disabled',
  forceFallback: true,
  removeCloneOnHide: true,
  handle: '.drag-handle',
  onMove: function (evt) {
    return evt.related.className.indexOf('disabled') === -1
  },
  onChoose: function (evt) {
    const origEl = evt.item
    origEl.querySelectorAll('[data-dnd-hide]').forEach(item => {
      item.dataset.dndHide = true
    })

    origEl.querySelectorAll('[data-dnd-show]').forEach(item => {
      item.dataset.dndShow = true
    })
  },
  onUnchoose: function (evt) {
    const origEl = evt.item
    origEl.querySelectorAll('[data-dnd-hide]').forEach(item => {
      item.dataset.dndHide = false
    })

    origEl.querySelectorAll('[data-dnd-show]').forEach(item => {
      item.dataset.dndShow = false
    })
  }
}

function Container({
  block,
  blockIndex,
  setBlocks,
  nodes,
  workflowAdded,
  onRemove,
  onArgsChange,
  onEndCallback,
  onOpenNode,
  openedNodeById
}) {
  return (
    <>
      <ReactSortable
        key={block.id + block.type}
        list={block.children}
        setList={currentList => {
          setBlocks(sourceList => {
            const tempList = [...sourceList]
            const _blockIndex = [...blockIndex]
            const lastIndex = _blockIndex.pop()
            const lastArr = _blockIndex.reduce(
              (arr, i) => arr[i].children,
              tempList
            )
            lastArr[lastIndex].children = currentList
            return tempList
          })
        }}
        onEnd={onEndCallback}
        {...sortableOptions}
        className={`
          ${block.children && block.children.length ? 'pb-2' : ' emptyChildren bg-gray-100 rounded-md'}
        `}
      >
        {block.children &&
          block.children.map((childBlock, index) => {
            return (
              <BlockWrapper
                key={childBlock.id + childBlock.type}
                block={childBlock}
                blockIndex={[...blockIndex, index]}
                setBlocks={setBlocks}
                nodes={nodes}
                workflowAdded={workflowAdded}
                onRemove={onRemove}
                onArgsChange={onArgsChange}
                onEndCallback={onEndCallback}
                onOpenNode={onOpenNode}
                openedNodeById={openedNodeById}
              />
            )
          })}
      </ReactSortable>
    </>
  )
}

function BlockWrapper({
  block,
  blockIndex,
  setBlocks,
  nodes,
  workflowAdded,
  onRemove,
  onArgsChange,
  onEndCallback,
  onOpenNode,
  openedNodeById
}) {
  if (!block) return null
  if (block.type === 'container') {
    return (
      <div
        className={block.name === 'Start' ? 'block disabled hidden' : 'block'}
      >
        <Node
          index={blockIndex}
          node={block}
          workflowAdded={workflowAdded}
          nodes={nodes}
          onRemove={onRemove}
          onArgsChange={onArgsChange}
          onOpenNode={onOpenNode}
          openedNodeById={openedNodeById}
        />
        <div className={`pl-3 relative block`}>
          <Container
            block={block}
            setBlocks={setBlocks}
            blockIndex={blockIndex}
            nodes={nodes}
            workflowAdded={workflowAdded}
            onRemove={onRemove}
            onArgsChange={onArgsChange}
            onEndCallback={onEndCallback}
            onOpenNode={onOpenNode}
            openedNodeById={openedNodeById}
          />
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={block.name === 'Start' ? 'block disabled hidden' : 'block'}
      >
        <Node
          index={blockIndex}
          node={block}
          workflowAdded={workflowAdded}
          nodes={nodes}
          onRemove={onRemove}
          onArgsChange={onArgsChange}
          onOpenNode={onOpenNode}
          openedNodeById={openedNodeById}
        />
      </div>
    )
  }
}

const Shortcut = ({ state, dispatch }) => {
  const { activeShortcut, workflowAdded, openedNodeById } = state
  const openedNodesChange = Object.values(openedNodeById).join()
  const [saved, setSaved] = useState(false)
  const scrollable = useRef()
  const scrollableInner = useRef()
  const [nodes, setNodes] = useState([])

  useEffect(() => {
    // if runContext is not set, set the default runContext
    if (!activeShortcut?.runContext) {
      dispatch(
        editRunContext({
          trigger: 'manual'
        })
      )
    }
  }, [activeShortcut?.runContext])

  useEffect(() => {
    if (workflowAdded) {
      const element = scrollable.current

      setTimer(() => {
        element.scrollTo(0, element.scrollHeight)
      }, 0)

      setTimer(() => {
        dispatch(setWorkflowAdded(false))
      })

      return () => [dispatch(setWorkflowAdded(false)), clearTimeout(setTimer())]
    }
  }, [workflowAdded, scrollable])

  useEffect(() => {
    setNodes(Object.values(activeShortcut?.nodes || {}))
  }, [activeShortcut?.nodes])

  useEffect(() => {
    const element = scrollableInner.current
    // Reset height on add/remove action
    element.style.height = 'auto'

    // Add height on add/remove action
    const addScrollableHeight = () => {
      element.style.height = `${element.offsetHeight + 24}px`
    }

    if (nodes.length > 0) {
      const timer = setTimeout(addScrollableHeight, 500)

      return () => clearTimeout(timer)
    }
  }, [nodes.length, openedNodesChange])

  const handleSaveShortcut = () => {
    dispatch(saveShortcut())
    setSaved(true)
  }

  const handleKeyDown = (event) => {
    const charCode = String.fromCharCode(event.which).toLowerCase()
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      handleSaveShortcut()
    }
  }

  const handleRunShortcut = () => {
    dispatch(saveShortcut())
    dispatch(clearAllWorkflowMessages())
    const missingargs = workflowHasEmptyValues(activeShortcut.nodes)
    if (Object.keys(missingargs).length) {
      dispatch(setRoute('run-workflow-empty', 'add-shortcut'))
    } else {
      const runData = { ...activeShortcut }
      runData.nodes = normalizeWorkflowWithKeys(runData.nodes)
      runData.runContext.env = {}
      runWorkflowHook(runData)
    }
  }

  const handleRunContextTriggerSelection = e => {
    const currentTrigger = activeShortcut?.runContext?.trigger

    if (currentTrigger === 'auto') {
      dispatch(clearAutoRunSelectedWorkflows())
      dispatch(
        editRunContext({
          ...activeShortcut?.runContext,
          trigger: 'manual'
        })
      )
    }

    if (currentTrigger === 'manual') {
      dispatch(
        editRunContext({
          ...activeShortcut?.runContext,
          trigger: 'auto'
        })
      )
    }

    dispatch(saveShortcut())
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="w-full px-3 py-2 border-b bg-white sticky z-50 top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="font-base text-black text-sm mr-3"
              onClick={() => [
                dispatch(setActiveShortcut(null)),
                dispatch(setRoute('home'))
              ]}
            >
              <ArrowNarrowLeftIcon className="h-4 w-4 font-base" />
            </button>

            <div>
              <input
                id="prettyName"
                type="text"
                className={`w-full px-2 py-1 -mx-2 font-medium text-sm rounded-sm`}
                value={activeShortcut.prettyName || ''}
                placeholder="Untitled"
                onChange={e => {
                  dispatch(editShortcut({ prettyName: e.target.value }))
                  dispatch(saveShortcut())
                }}
              />
            </div>
          </div>

          {activeShortcut.prettyName && (
            <>
              <button
                  type="button"
                  className={`
                    mr-1 rounded-md border border-2 text-xs px-2 py-1
                    ${activeShortcut?.runContext?.trigger === 'auto' ? 'border-green-600 text-green-700' : 'border-gray-600 text-black'}
                  `}
                  onClick={handleRunContextTriggerSelection}
                >
                  Instant
              </button>

              <button
                type="button"
                className="mr-3 rounded-md border border-2 border-gray-600 text-black text-xs px-2 py-1"
                onClick={handleSaveShortcut}
              >
                Save
              </button>
              {state.workflowSuccessMessage ? (
                <div className="flex justify-center w-7 h-7">
                  <Spinner />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRunShortcut}
                  className="w-7 h-7"
                >
                  <PlayIcon className="text-gray-600 hover:text-green-600 w-7" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div
        ref={scrollable}
        className="overflow-auto mb-auto"
      >
        <div className="w-full absolute z-50">
          {saved && (
            <SuccessAlert
              message="Saved!"
              onAutoClose={() => setSaved(false)}
              onHide={() => setSaved(false)}
            />
          )}

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

        <div onKeyDown={handleKeyDown} ref={scrollableInner} className="relative mt-4 px-4 w-full">
          <ReactSortable
            list={nodes}
            setList={setNodes}
            onEnd={(ev, ui) => {
              if (nodes.length) {
                dispatch(updateAction({ nodes, droppedItemIndex: ev.newIndex }))
                dispatch(saveShortcut())
              }
            }}
            {...sortableOptions}
            className="pb-4"
          >
            {nodes.map((block, blockIndex) => (
              <BlockWrapper
                key={block.id + (block.type ? block.type : '')}
                block={block}
                blockIndex={[blockIndex]}
                setBlocks={setNodes}
                nodes={nodes}
                workflowAdded={workflowAdded}
                onRemove={itemId => {
                  dispatch(removeAction(itemId))
                  dispatch(saveShortcut())
                }}
                onArgsChange={values => {
                  dispatch(editArgsShortcut(values))
                  dispatch(saveShortcut())
                }}
                onEndCallback={(ev, ui) => {
                  if (nodes.length) {
                    dispatch(updateAction({ nodes, droppedItemIndex: ev.newIndex }))
                    dispatch(saveShortcut())
                  }
                }}
                openedNodeById={openedNodeById}
                onOpenNode={id => dispatch(openNodeToggle({ id }))}
              />
            ))}
          </ReactSortable>

          <div className="mb-4 relative z-20">
            <button
              className="flex items-center justify-center bg-white border rounded-md border-gray-600 p-2 w-full hover:shadow-md text-xs"
              type="button"
              onClick={() => [dispatch(setRoute('add-action'))]}
            >
              <span className="w-5 h-5 pr-1">
                <PlusCircleIcon className="h-full w-full font-semibold" />
              </span>
              <span>Add action</span>
            </button>
          </div>
        </div>
      </div>
      
      {activeShortcut?.runContext?.trigger === 'auto' &&
        <div className="p-2 bg-yellow-100 text-xs text-center text-yellow-800">
          <div>Activate on the workflows screen, and select a layer to run automatically.</div>
        </div>
      }
    </div>
  )
}

export default Shortcut
