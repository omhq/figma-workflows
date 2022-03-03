import React from 'react'

const Toggle = ({
  onClick = () => {},
  tabIndex = 0,
  isChecked = false,
  disabled
}) => {
  const wrapClasses = `${
    isChecked ? 'bg-blue-500' : 'bg-gray-400'
  } relative inline-block flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200  focus:shadow-outline`
  const elementClasses = `${
    isChecked ? 'translate-x-5' : 'translate-x-0'
  } inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`

  return (
    <span
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={tabIndex}
      onClick={!disabled && onClick}
      className={wrapClasses}
    >
      <span aria-hidden="true" className={elementClasses} />
    </span>
  )
}

export default Toggle
