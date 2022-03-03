import React from 'react'
import { useFormik } from 'formik'
import get from 'lodash/get'
import { setRoute, setActiveShortcut } from '../../reducers/main'
import runWorkflowHook from '../../hooks/workflow'
import { isJson } from '../../../plugin/utils'
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'
import {
  normalizeWorkflowWithArgs,
  getInitialValues,
  getEmptyFields
} from '../../utils/workflow'
import LineHeightComponent from '../action-args-form/LineHeightComponent'
import LineHeightRangeComponent from '../action-args-form/LineHeightRangeComponent'
import LetterSpacingComponent from '../action-args-form/LetterSpacingComponent'
import LetterSpacingRangeComponent from '../action-args-form/LetterSpacingRangeComponent'
import IfComponent from '../action-args-form/IfComponent'

const RunWorkflowEmpty = ({ dispatch, state }) => {
  const { activeShortcut, fromRoute } = state
  const nodes = Object.values(activeShortcut?.nodes || {})
  const fields = getEmptyFields(nodes)

  const formik = useFormik({
    initialValues: getInitialValues(Object.keys(nodes).map(key => nodes[key])),
    onSubmit: (values, { resetForm }) => {
      // tie the value returns from custom components into formik
      // to remove this, or run a formik validation to prevent form submit
      let submitOk = true

      for (const [_, valueObj] of Object.entries(values)) {
        for (const [_, valueData] of Object.entries(valueObj)) {
          // custom components return json strings as values
          const objJsonValue = isJson(valueData)

          if (objJsonValue) {
            if (objJsonValue?.validation?.valid === false) {
              submitOk = false
            }
          } else {
            // just check for empty value string for now
            // until we standardize bad argument types
            if (valueData === '') {
              submitOk = false
            }
          }
        }
      }

      if (submitOk) {
        const normalized = normalizeWorkflowWithArgs(activeShortcut, values)

        runWorkflowHook(normalized)

        if (!fromRoute) {
          dispatch(setActiveShortcut(null))
        }

        dispatch(setRoute(fromRoute || 'home', null))
      }
    }
  })

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-50 top-0">
        <div className="flex">
          <button
            type="button"
            className="font-base text-black text-sm mr-4"
            onClick={() => {
              if (!fromRoute) {
                dispatch(setActiveShortcut(null))
              }

              dispatch(setRoute(fromRoute || 'home', null))
            }}
          >
            <ArrowNarrowLeftIcon className="h-4 w-4 font-base" />
          </button>

          <div>
            <span className="font-medium text-sm">Required fields</span>
          </div>
        </div>
      </div>

      <div
        className="overflow-auto pt-2"
        style={{ height: 'calc(100% - 41px)' }}
      >
        <div className="px-2 w-full">
          <form className="px-2 mt-2" onSubmit={formik.handleSubmit}>
            {Object.keys(fields).map(key => {
              const field = fields[key]
              const { type, label, options, nodeId, prettyName } = field
              const name = `${nodeId}.${field.name}`
              const value = get(formik.values, name)

              if (type === 'lineHeight') {
                return (
                  <div key={name} className="mb-4">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>
                    <LineHeightComponent
                      field={field}
                      value={value ? JSON.parse(value) : {}}
                      returnFinalValue={e => {
                        const retValue = e ? JSON.stringify(e) : 'null'
                        if (retValue) {
                          formik.setFieldValue(name, retValue, false)
                        }
                      }}
                    />
                  </div>
                )
              }

              if (type === 'setRangeLineHeight') {
                return (
                  <div key={name} className="mb-4">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>
                    <LineHeightRangeComponent
                      field={field}
                      value={value ? JSON.parse(value) : {}}
                      returnFinalValue={e => {
                        const retValue = e ? JSON.stringify(e) : 'null'
                        if (retValue) {
                          formik.setFieldValue(name, retValue, false)
                        }
                      }}
                    />
                  </div>
                )
              }

              if (type === 'letterSpacing') {
                return (
                  <div key={name} className="mb-4">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>
                    <LetterSpacingComponent
                      field={field}
                      value={value ? JSON.parse(value) : {}}
                      returnFinalValue={e => {
                        const retValue = e ? JSON.stringify(e) : 'null'
                        if (retValue) {
                          formik.setFieldValue(name, retValue, false)
                        }
                      }}
                    />
                  </div>
                )
              }

              if (type === 'setRangeLetterSpacing') {
                return (
                  <div key={name} className="mb-4">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>
                    <LetterSpacingRangeComponent
                      field={field}
                      value={value ? JSON.parse(value) : {}}
                      returnFinalValue={e => {
                        const retValue = e ? JSON.stringify(e) : 'null'
                        if (retValue) {
                          formik.setFieldValue(name, retValue, false)
                        }
                      }}
                    />
                  </div>
                )
              }

              if (type === 'if') {
                return (
                  <div key={name} className="px-2 my-2">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>
                    <IfComponent
                      field={field}
                      value={value ? JSON.parse(value) : {}}
                      returnFinalValue={e => {
                        const retValue = e ? JSON.stringify(e) : 'null'
                        if (retValue) {
                          formik.setFieldValue(name, retValue, false)
                        }
                      }}
                    />
                  </div>
                )
              }

              if (type === 'select') {
                return (
                  <div key={name} className="mb-4">
                    <div className="text-xs font-semibold mb-1">
                      {prettyName}
                    </div>

                    <div className="mb-2 flex flex-wrap items-center justify-left">
                      <label
                        className="text-sm font-base text-gray-500 block"
                        htmlFor={name}
                      >
                        {label}
                      </label>

                      <select
                        id={name}
                        name={name}
                        className={`${
                          label ? 'ml-3 ' : ''
                        }rounded-sm p-1 text-gray-900 bg-gray-100 text-sm`}
                        value={value}
                        required
                        onChange={formik.handleChange}
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
                    </div>
                  </div>
                )
              }

              return (
                <div key={name} className="mb-4">
                  <div className="text-xs font-semibold mb-1">{prettyName}</div>

                  <div className="mb-2">
                    <label
                      className="text-sm font-base text-gray-500 block"
                      htmlFor={name}
                    >
                      {label}
                    </label>

                    <input
                      className={`
                        ${label ? 'ml-3 ' : ''}
                        rounded-sm
                        px-1
                        text-gray-900
                        bg-gray-100
                        text-s
                      `}
                      id={name}
                      name={name}
                      type="text"
                      required
                      onChange={e => {
                        formik.handleChange(e)
                      }}
                      value={value}
                    />
                  </div>
                </div>
              )
            })}

            <button
              type="submit"
              className="flex items-center justify-center bg-white border rounded-md border-gray-600 p-2 w-full mt-6 hover:shadow-md"
            >
              Run
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default RunWorkflowEmpty
