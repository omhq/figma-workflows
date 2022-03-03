import React from 'react'
import { useFormik } from 'formik'
import { get } from 'lodash'
import { saveAction, setRoute } from '../../reducers/main'
import { formSchema } from '../../schema/text-form'
import { normalizeInitialValues, normalizeResult } from '../../utils/form'


/**
 * Currently disabled.
 */
const ActionForm = ({ state, dispatch }) => {
  const formik = useFormik({
    initialValues: normalizeInitialValues(formSchema),
    onSubmit: values => {
      dispatch(saveAction(normalizeResult(values)))
      dispatch(setRoute('add-action'))
    }
  })

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <button
          type="button"
          className="font-medium mt-2 px-4 text-black text-md"
          onClick={() => dispatch(setRoute('add-shortcut'))}
        >
          Cancel
        </button>
      </div>

      <div className="px-4">
        <form onSubmit={formik.handleSubmit}>
          {Object.keys(formSchema).map(key => {
            const { type, label, required, dependencies, group } = formSchema[key]
            const name = group ? `${group}.${key}` : key
            const value = get(formik.values, name)
            const options = dependencies
              ? dependencies.options[get(formik.values, dependencies.by)]
              : formSchema[key].options

            if (type === 'select') {
              return (
                <div
                  key={name}
                  className={`mb-2${type === 'hidden' ? ' hidden' : ''}`}
                >
                  <label className="block mb-1" htmlFor={name}>
                    {label}
                  </label>
                  <select
                    id={name}
                    name={name}
                    className="border border-black px-2 py-1 text-black w-full"
                    value={value}
                    onChange={formik.handleChange}
                    required={required}
                    disabled={!options}
                  >
                    <option key="no-value">Select {label}</option>
                    {options &&
                      options.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>
              )
            }

            return (
              <div
                key={name}
                className={`mb-2${type === 'hidden' ? ' hidden' : ''}`}
              >
                <label className="block mb-1" htmlFor={name}>
                  {label}
                </label>
                <input
                  className="border border-black px-2 py-1 text-black w-full"
                  id={name}
                  name={name}
                  type="string"
                  onChange={formik.handleChange}
                  value={value}
                  required={required}
                />
              </div>
            )
          })}

          <button
            type="submit"
            className="mt-4 bg-white border-2 border-black p-4 w-full"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}

export default ActionForm
