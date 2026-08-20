import { useCallback, useEffect, useRef, useState } from 'react'
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
import { ArrowLeft, CirclePlus, Play } from 'lucide-react'
import SuccessAlert from '../alerts/SuccessAlert'
import WarningAlert from '../alerts/WarningAlert'
import FailAlert from '../alerts/FailAlert'
import { Spinner } from '../../components/icons'
import { setTimer } from '../../../plugin/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  dedupeNodeTree,
  mergeRootNodesWithLatestChildren,
  replaceNodeChildren
} from '../../utils/state-actions'

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
} as const

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
          setBlocks(sourceList =>
            replaceNodeChildren(sourceList, block.id, currentList)
          )
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
  const scrollable = useRef<HTMLDivElement>(null)
  const scrollableInner = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const nodesRef = useRef<any[]>([])

  const updateNodes = useCallback(nextNodes => {
    const next =
      typeof nextNodes === 'function' ? nextNodes(nodesRef.current) : nextNodes

    nodesRef.current = next
    setNodes(next)
  }, [])

  const updateRootNodes = useCallback(
    nextNodes => {
      updateNodes(currentNodes =>
        mergeRootNodesWithLatestChildren(nextNodes, currentNodes)
      )
    },
    [updateNodes]
  )

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

      return () => {
        dispatch(setWorkflowAdded(false))
      }
    }
  }, [workflowAdded, scrollable])

  useEffect(() => {
    updateNodes(dedupeNodeTree(Object.values(activeShortcut?.nodes || {})))
  }, [activeShortcut?.nodes, updateNodes])

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

  const handleKeyDown = event => {
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

  const handleRunContextTriggerSelection = () => {
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

  const handleSortEnd = () => {
    const latestNodes = dedupeNodeTree(nodesRef.current)

    if (latestNodes.length) {
      nodesRef.current = latestNodes
      setNodes(latestNodes)
      dispatch(updateAction({ nodes: latestNodes }))
      dispatch(saveShortcut())
    }
  }

  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="w-full px-3 py-2 border-b bg-white sticky z-50 top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <Button
              aria-label="Back to workflows"
              className="mr-1"
              onClick={() => [
                dispatch(setActiveShortcut(null)),
                dispatch(setRoute('home'))
              ]}
              size="icon-sm"
              variant="ghost"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <Input
                id="prettyName"
                type="text"
                className="h-7 w-24 border-transparent px-1.5 font-medium shadow-none hover:border-input focus-visible:border-ring"
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
              <Button
                className={
                  activeShortcut?.runContext?.trigger === 'auto'
                    ? 'mr-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50'
                    : 'mr-1'
                }
                onClick={handleRunContextTriggerSelection}
                size="sm"
                variant="outline"
              >
                Instant
              </Button>

              <Button
                className="mr-1"
                onClick={handleSaveShortcut}
                size="sm"
                variant="outline"
              >
                Save
              </Button>
              {state.workflowSuccessMessage ? (
                <div className="flex justify-center w-7 h-7">
                  <Spinner />
                </div>
              ) : (
                <Button
                  aria-label="Run workflow"
                  onClick={handleRunShortcut}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Play className="text-gray-600 hover:text-green-600" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div ref={scrollable} className="overflow-auto mb-auto">
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

        <div
          onKeyDown={handleKeyDown}
          ref={scrollableInner}
          className="relative mt-4 px-4 w-full"
        >
          <ReactSortable
            list={nodes}
            setList={updateRootNodes}
            onEnd={handleSortEnd}
            {...sortableOptions}
            className="pb-4"
          >
            {nodes.map((block, blockIndex) => (
              <BlockWrapper
                key={block.id + (block.type ? block.type : '')}
                block={block}
                blockIndex={[blockIndex]}
                setBlocks={updateNodes}
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
                onEndCallback={handleSortEnd}
                openedNodeById={openedNodeById}
                onOpenNode={id => dispatch(openNodeToggle({ id }))}
              />
            ))}
          </ReactSortable>

          <div className="mb-4 relative z-20">
            <Button
              className="w-full"
              onClick={() => [dispatch(setRoute('add-action'))]}
              variant="outline"
            >
              <CirclePlus className="size-4" />
              <span>Add action</span>
            </Button>
          </div>
        </div>
      </div>

      {activeShortcut?.runContext?.trigger === 'auto' && (
        <div className="p-2 bg-yellow-100 text-xs text-center text-yellow-800">
          <div>
            Activate on the workflows screen, and select a layer to run
            automatically.
          </div>
        </div>
      )}
    </div>
  )
}

export default Shortcut
