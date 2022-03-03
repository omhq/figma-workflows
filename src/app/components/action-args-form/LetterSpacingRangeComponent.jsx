import React, { useState, useEffect } from 'react'
import { set } from 'lodash'


const LetterSpacingRangeComponent = ({ field, value, returnFinalValue }) => {
  const [ret, setRet] = useState({})
  const [initialValues, setInitialValues] = useState({})
  const [validation, setValidation] = useState(null)

  useEffect(() => {
    if (Object.keys(value).length !== 0) {
      setInitialValues({...initialValues, ...value})
    }
  }, [])

  const validate = () => {
    let retObj = {}
    retObj.message = null

    // if the start value is not set, then invalid
    if (!ret?.start) {
      retObj.valid = false
      retObj.message = 'Start value is required to set letter spacing.'
      return retObj
    }

    // if the end value is not set, then invalid
    if (!ret?.end) {
      retObj.valid = false
      retObj.message = 'End value is required to set letter spacing.'
      return retObj
    }

    // if the number value is not set, then invalid
    if (!ret?.value?.value) {
      retObj.valid = false
      retObj.message = 'Number value is required to set letter spacing.'
      return retObj
    }

    // if the number value is set, but no unit, then invalid
    if (ret?.value?.value && !ret?.value?.unit) {
      retObj.valid = false
      retObj.message = 'Set the unit value to pixels or percent.'
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
        <label className="text-xs font-base text-gray-900 mb-1 block">Start</label>
        <input
          className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
          id='start'
          name='start'
          type="text"
          onChange={e => {
            handleChange('start', e)
          }}
          value={initialValues?.start ? initialValues.start : ''}
        />
      </div>
        
      <div className="mb-2">
        <label className="text-xs font-base text-gray-900 mb-1 block">End</label>
        <input
          className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
          id='end'
          name='end'
          type="text"
          onChange={e => {
            handleChange('end', e)
          }}
          value={initialValues?.end ? initialValues.end : ''}
        />
      </div>

      <div className="mb-2">
        <label className="text-xs font-base text-gray-900 mb-1 block">Number</label>
        <input
          className="w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs"
          id='value'
          name='value.value'
          type="text"
          onChange={e => {
            handleChange('value.value', e)
          }}
          value={initialValues?.value?.value ? initialValues.value.value : ''}
        />
      </div>

      <div className="mb-2">
        <label className="text-xs font-base text-gray-900 mb-1 block">Line height unit</label>
        <select
          id='unit'
          name='value.unit'
          className="rounded-sm p-1 text-gray-900 bg-gray-100 text-xs"
          onChange={e => {
            handleChange('value.unit', e)
          }}
          value={initialValues?.value?.unit ? initialValues.value.unit : ''}
        >
          <option key="no-value" value="">Select unit</option>
          <option key="pixels" value="PIXELS">Pixels</option>
          <option key="percent" value="PERCENT">Percent</option>
        </select>
      </div>
    </>
  )
}

export default LetterSpacingRangeComponent
