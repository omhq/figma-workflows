import React from 'react'
import { getIconComponent } from '../../utils/icons'
import { addAction, saveShortcut, setRoute, setWorkflowAdded } from '../../reducers/main'


const ActionItem = ({ dispatch, item }) => {
  const IconComponent = getIconComponent(item.icon)

  return (
    <div
      onClick={() => [
        dispatch(setRoute('add-shortcut')),
        dispatch(addAction(item)),
        dispatch(saveShortcut()),
        dispatch(setWorkflowAdded(true))
      ]}
      className="flex items-center w-full bg-white hover:bg-gray-100 px-4 py-2 w-full cursor-pointer"
    >
      {item.icon && IconComponent && (
        <IconComponent
          type={item.icon}
          strokeWidth={0}
          className="w-3 h-3 mr-2"
        />
      )}
      <span className="text-sm font-normal">
        {item.prettyName}
      </span>
    </div>
  )
}

export default ActionItem
