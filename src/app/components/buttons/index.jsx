import React from 'react'
import { Back } from '../icons'

export const BackBtn = ({ onClick, pageTitle }) => {
  return (
    <button
      type="button"
      className="flex  items-center  text-blue-500 px-2 overflow-hidden"
      onClick={onClick}
    >
      <Back className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
      {pageTitle && <span className="text-gray-900 text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">{pageTitle}</span>}
    </button>
  )
}

export const BorderedBtn = ({ onClick, children, className, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1 rounded-md text-sm transition duration-300 ease-in-out bg-white block border-2 border-blue-500  hover:bg-blue-500 hover:text-white text-blue-500 disabled:text-white disabled:bg-blue-300 disabled:border-blue-300 ${
        className || ''
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export const MainBtn = ({ onClick, children, className, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-4 py-1 rounded-md text-sm text-white transition duration-300 ease-in-out bg-blue-500 border-2 border-blue-500  hover:bg-white hover:text-blue-500 disabled:text-white disabled:bg-blue-300 disabled:border-blue-300 ${
        className || ''
      } `}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export const DangerBtn = ({ onClick, children, className, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700  focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
        className || ''
      } `}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
