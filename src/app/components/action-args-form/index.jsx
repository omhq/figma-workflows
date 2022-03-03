import React from 'react'
import { useFormik } from 'formik'
import { get, isNil } from 'lodash'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { normalizeArgsInitialValues } from '../../utils/form'
import LineHeightComponent from './LineHeightComponent'
import LineHeightRangeComponent from './LineHeightRangeComponent'
import LetterSpacingComponent from './LetterSpacingComponent'
import IfComponent from './IfComponent'
import LetterSpacingRangeComponent from '../action-args-form/LetterSpacingRangeComponent'

const ActionArgsForm = ({ node, onChange, dndHide, opened }) => {
  const fields = node.data.argDefinitions
  const formik = useFormik({
    initialValues: normalizeArgsInitialValues(fields, node.data.args),
    enableReinitialize: true
  })

  const handleChange = (name, arg) => {
    const values = {
      ...formik.values,
      [name]: arg
    }

    const normalizeArgs = fields.map(item => {
      const value = values[item.name]

      if (!isNil(value) && value !== '') {
        return value
      }

      return null
    })

    // to editArgsShortcut in the reducer
    onChange({
      id: node.id,
      args: normalizeArgs
    })
  }

  return (
    <form data-dnd-hide={dndHide} className={`mb-0${!opened ? ' hidden' : ''}`} onSubmit={formik.handleSubmit}>
      {fields.map(field => {
        const { type, name, label, options, message } = field
        const value = get(formik.values, name)

        if (type === 'httprequest') {
          return (
            <>
              <div key={name} className="px-2 my-2 flex items-center">
                <select disabled name="method" className="text-gray-500 mr-2">
                  <option value="get">GET</option>
                </select>

                <input
                  className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
                  id={name}
                  name={name}
                  type="text"
                  onChange={e => {
                    formik.handleChange(e)
                    handleChange(name, e.target.value)
                  }}
                  value={!isNil(value) ? value : ''}
                />
              </div>
              {message && (
                <div className="mt-1 text-yellow-700 text-xs">{message}</div>
              )}
            </>
          )
        }

        if (type === 'code') {
          return (
            <div
              key={name}
              className="mb-2 flex flex-wrap items-center justify-left"
            >
              <CodeMirror
                value={!isNil(value) ? value : field.default}
                height="150px"
                extensions={[javascript({ jsx: true })]}
                onChange={(value, viewUpdate) => {
                  formik.handleChange(value)
                  handleChange(name, value)
                }}
                className="w-full"
              />
            </div>
          )
        }

        if (type === 'select') {
          return (
            <div
              key={name}
              className="px-2 my-2 flex flex-wrap items-center justify-left"
            >
              <label
                className="text-xs font-base text-gray-900 mb-1 block"
                htmlFor={name}
              >
                {label}
              </label>
              <select
                id={name}
                name={name}
                className={`${label ? 'ml-2 ' : ''}rounded-sm p-1 text-gray-900 bg-gray-100 text-xs`}
                value={!isNil(value) ? value : ''}
                onChange={e => {
                  formik.handleChange(e)
                  handleChange(name, e.target.value)
                }}
              >
                <option key="no-value" value="">
                  Select {label}
                </option>
                {options &&
                  options.map(item => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
              </select>
              {message && (
                <div className="mt-1 text-xs text-yellow-700">{message}</div>
              )}
            </div>
          )
        }

        if (type === 'boolean') {
          return (
            <div
              key={name}
              className="px-2 my-2 flex flex-wrap items-center justify-left"
            >
              <label
                className="text-xs font-base text-gray-900 mb-1 block"
                htmlFor={name}
              >
                {label}
              </label>
              <input
                className={`${label ? 'ml-3 ' : ''}`}
                type="checkbox"
                id={name}
                name={name}
                checked={!isNil(value) ? value : false}
                onChange={e => {
                  formik.handleChange(e)
                  handleChange(name, e.target.checked)
                }}
              />
              {message && (
                <div className="mt-1 text-xs text-yellow-700">{message}</div>
              )}
            </div>
          )
        }

        if (type === 'lineHeight') {
          return (
            <div className="px-2 my-2" key='lineHeight'>
              <LineHeightComponent
                field={field}
                value={value ? JSON.parse(value) : {}}
                returnFinalValue={e => {
                  const retValue = e ? JSON.stringify(e) : {}
                  formik.handleChange(retValue)
                  handleChange(name, retValue)
                }}
              />
            </div>
          )
        }

        if (type === 'setRangeLineHeight') {
          return (
            <div className="px-2 my-2" key='setRangeLineHeight'>
              <LineHeightRangeComponent
                field={field}
                value={value ? JSON.parse(value) : {}}
                returnFinalValue={e => {
                  const retValue = e ? JSON.stringify(e) : {}
                  formik.handleChange(retValue)
                  handleChange(name, retValue)
                }}
              />
            </div>
          )
        }

        if (type === 'letterSpacing') {
          return (
            <div className="px-2 my-2" key='letterSpacing'>
              <LetterSpacingComponent
                field={field}
                value={value ? JSON.parse(value) : {}}
                returnFinalValue={e => {
                  const retValue = e ? JSON.stringify(e) : {}
                  formik.handleChange(retValue)
                  handleChange(name, retValue)
                }}
              />
            </div>
          )
        }

        if (type === 'setRangeLetterSpacing') {
          return (
            <div className="px-2 my-2" key='setRangeLetterSpacing'>
              <LetterSpacingRangeComponent
                field={field}
                value={value ? JSON.parse(value) : {}}
                returnFinalValue={e => {
                  const retValue = e ? JSON.stringify(e) : {}
                  formik.handleChange(retValue)
                  handleChange(name, retValue)
                }}
              />
            </div>
          )
        }

        if (type === 'if') {
          return (
            <div className="px-2 my-2" key='if'>
              <IfComponent
                field={field}
                value={value ? JSON.parse(value) : {}}
                returnFinalValue={e => {
                  const retValue = e ? JSON.stringify(e) : {}
                  formik.handleChange(retValue)
                  handleChange(name, retValue)
                }}
              />
            </div>
          )
        }

        return (
          <div key={name} className="px-2 my-2">
            <div className="">
              <label
                className="text-xs font-base text-gray-900 mb-1 block"
                htmlFor={name}
              >
                {label}
              </label>
              <input
                className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
                id={name}
                name={name}
                type="text"
                onChange={e => {
                  formik.handleChange(e)
                  handleChange(name, e.target.value)
                }}
                value={!isNil(value) ? value : ''}
              />
            </div>
            {message && (
              <div className="mt-1 text-xs text-gray-900">
                {message}
              </div>
            )}
          </div>
        )
      })}
    </form>
  )
}

export default ActionArgsForm
