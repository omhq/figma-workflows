import React, { useState, useEffect } from 'react'
import { set } from 'lodash'


const IfComponent = ({ field, value, returnFinalValue }) => {
  const [ret, setRet] = useState({})
  const [initialValues, setInitialValues] = useState({
    property: '{{item.type}}',
    operator: 'equal',
    value: 'RECTANGLE'
  })
  const [validation, setValidation] = useState(null)

  useEffect(() => {
    if (Object.keys(value).length !== 0) {
      setInitialValues({...initialValues, ...value})
    } else {
      setRet({...initialValues})
    }
  }, [])

  const validate = () => {
    let retObj = {}
    retObj.message = null

    if (!ret?.property) {
      retObj.valid = false
      retObj.message = 'Specify a property to read, eg {{item.type}}.'
      return retObj
    }

    if (!ret?.operator) {
      retObj.valid = false
      retObj.message = 'Select an operator.'
      return retObj
    }

    if (!ret?.value) {
      retObj.valid = false
      retObj.message = 'Set a value to compare against.'
      return retObj
    }

    return retObj
  }

  useEffect(() => {
    // change state only if object has keys to prevent validate() running
    // when a user first add the action.  We show field.helper initially
    if (Object.keys(ret).length !== 0) {
      const validateResp = validate()
      setValidation({...validateResp})
      returnFinalValue({...ret, validation: { valid: validateResp.valid }})
    }
  }, [ret])

  const handleChange = (name, arg) => {
    const argValue = arg.target.value ? arg.target.value : ''
    setRet({...set(initialValues, name, argValue)})
  }

  return (
    <>
      {!validation && 
        <p className="text-xs mb-3">{field?.helper}</p>
      }

      {validation?.message &&
        <div className="bg-red-50 p-2 mb-3">
          <div className="flex">
            <div className="text-xs text-red-700">
              {validation?.message}
            </div>
          </div>
        </div>
      }

      <div className="mb-2">
        <input
          className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
          id="property"
          name="property"
          type="text"
          onChange={e => {
            handleChange("property", e)
          }}
          value={initialValues?.property ? initialValues.property : ""}
        />
      </div>

      <div className="mb-2">
        <select
          id="operator"
          name="operator"
          className="rounded-sm p-1 text-gray-900 bg-gray-100 text-xs"
          onChange={e => {
            handleChange("operator", e)
          }}
          value={initialValues?.operator ? initialValues.operator : ""}
        >
          <option key="no-value" value="">Operator</option>
          {field.args[1] &&
            field.args[1].options.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))
          }
        </select>
      </div>

      <div className="mb-2">
        <input
          className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
          id="value"
          name="value"
          type="text"
          onChange={e => {
            handleChange("value", e)
          }}
          value={initialValues?.value ? initialValues.value : ""}
        />
      </div>
    </>
  )
}

export default IfComponent
