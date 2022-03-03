import React, { useState } from 'react'
import { getIconComponent } from '../../utils/icons'
import ActionArgsForm from '../action-args-form'
import { XCircleIcon } from '@heroicons/react/outline'
import { AdjustmentsIcon } from '@heroicons/react/outline'

const Node = ({
  index,
  node,
  workflowAdded,
  nodes,
  onRemove,
  onArgsChange,
  onOpenNode,
  openedNodeById
}) => {
  const opened = openedNodeById[node.id]
  const IconComponent = getIconComponent(node.icon)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <div data-dnd-show={false} className="w-full px-3">
        <div className="p-2 my-1 hover:shadow-md border rounded-md border-gray-300 hover:border-indigo-500">
          <span className="flex items-center text-xs font-medium w-full drag-handle cursor-move ml-1">
            {node.prettyName}
          </span>
        </div>
      </div>

      <div
        data-dnd-hide={false}
        onMouseOver={e => {
          setHovered(true)
        }}
        onMouseLeave={e => {
          setHovered(false)
        }}
        className={`${
          workflowAdded && index[0] === nodes.length - 1 ? 'border-green-500 ' : ''
        }${
          node.name === 'Start' ? 'disabled ' : ''
        }my-1 hover:shadow-md border rounded-md border-gray-300 hover:border-indigo-500 bg-white select-none overflow-hidden`}
      >
        <div className="w-full">
          <div className={`p-2 flex items-center justify-between ${opened ? 'border-b' : ''}`}>
            <span className="flex items-center text-xs font-medium w-full drag-handle cursor-move">
              {IconComponent &&
                <IconComponent
                  type={node.icon}
                  strokeWidth={0}
                  className="w-3 h-3 mr-1"
                />
              }
              {node.prettyName}
            </span>
            
            {hovered &&
              <>
                {node.data.args.length !== 0 &&
                  <button data-dnd-hide={false} className="w-4 h-4 mr-3" onClick={() => onOpenNode(node.id)}>
                    <AdjustmentsIcon className={`h-full w-full transform -rotate-90 font-base${!opened ? ' text-gray-400 hover:text-gray-800' : 'text-gray-800'}`} />
                  </button>
                }

                <button data-dnd-hide={false} className="w-4 h-4" onClick={() => onRemove(node.id)}>
                  <XCircleIcon className="h-full w-full font-base text-gray-400 hover:text-gray-800" />
                </button>
              </>
            }
          </div>

          {node.helper && (
            <div data-dnd-hide={false} className={`text-xs m-2${!opened ? ' hidden' : ''}`}>{node.helper}</div>
          )}

          {node.name !== 'Start' && (
            <ActionArgsForm
              opened={opened}
              dndHide={false}
              node={node}
              onChange={values => onArgsChange(values)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Node
