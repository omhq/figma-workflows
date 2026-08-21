import { useEffect, useId, useState } from 'react'
import {
  CONDITION_OPERATORS,
  CONDITION_PROPERTIES,
  CUSTOM_CONDITION_PROPERTY,
  conditionPropertyFor,
  createDefaultCondition,
  normalizeConditionGroup,
  operatorNeedsValue,
  validateConditionGroup,
  type WorkflowCondition,
  type WorkflowConditionGroup
} from '../../../shared/conditions'

const selectClassName =
  'w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs'
const inputClassName =
  'w-full rounded-sm py-1 px-2 text-gray-900 bg-gray-100 text-xs'

const IfComponent = ({ field, value, returnFinalValue }) => {
  const componentId = useId()
  const [group, setGroup] = useState<WorkflowConditionGroup>(() =>
    normalizeConditionGroup(value)
  )
  const [validation, setValidation] = useState(() =>
    validateConditionGroup(normalizeConditionGroup(value))
  )

  const commit = (nextGroup: WorkflowConditionGroup) => {
    const nextValidation = validateConditionGroup(nextGroup)
    setGroup(nextGroup)
    setValidation(nextValidation)
    returnFinalValue({
      ...nextGroup,
      validation: { valid: nextValidation.valid }
    })
  }

  useEffect(() => {
    if (!value || Object.keys(value).length === 0) {
      returnFinalValue({
        ...group,
        validation: { valid: validation.valid }
      })
    }
  }, [])

  const updateCondition = (
    index: number,
    update: Partial<WorkflowCondition>
  ) => {
    commit({
      ...group,
      conditions: group.conditions.map((condition, conditionIndex) =>
        conditionIndex === index ? { ...condition, ...update } : condition
      )
    })
  }

  const changeProperty = (index: number, selectedValue: string) => {
    if (selectedValue === CUSTOM_CONDITION_PROPERTY) {
      updateCondition(index, {
        property: '',
        operator: CONDITION_OPERATORS.custom[0].value,
        value: ''
      })
      return
    }

    const property = conditionPropertyFor(selectedValue)
    if (!property) return

    updateCondition(index, {
      property: property.value,
      operator: property.defaultOperator,
      value: property.defaultValue
    })
  }

  const propertyGroups = ['Current layer', 'Workflow'] as const
  const fieldId = (name: string, index?: number) =>
    `${componentId}-${name}${index === undefined ? '' : `-${index}`}`

  return (
    <>
      {field?.helper && !validation.message && (
        <p className="text-xs mb-3">{field.helper}</p>
      )}

      {validation.message && (
        <div className="bg-red-50 p-2 mb-3">
          <div className="text-xs text-red-700">{validation.message}</div>
        </div>
      )}

      <div className="mb-3">
        <label
          className="text-xs font-base text-gray-900 mb-1 block"
          htmlFor={fieldId('condition-match')}
        >
          Match
        </label>
        <select
          id={fieldId('condition-match')}
          className={selectClassName}
          value={group.match}
          onChange={event =>
            commit({
              ...group,
              match: event.target.value === 'any' ? 'any' : 'all'
            })
          }
        >
          <option value="all">All conditions (AND)</option>
          <option value="any">Any condition (OR)</option>
        </select>
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition, index) => {
          const property = conditionPropertyFor(condition.property)
          const propertySelectValue = property
            ? property.value
            : CUSTOM_CONDITION_PROPERTY
          const operators = property
            ? CONDITION_OPERATORS[property.type]
            : CONDITION_OPERATORS.custom
          const selectedOperator = CONDITION_OPERATORS.custom.find(
            operator => operator.value === condition.operator
          )
          const availableOperators = operators.some(
            operator => operator.value === condition.operator
          )
            ? operators
            : [
                ...operators,
                selectedOperator || {
                  label: condition.operator,
                  value: condition.operator
                }
              ]

          return (
            <fieldset
              className="rounded-sm border border-gray-200 p-2"
              key={index}
            >
              <legend className="px-1 text-xs text-gray-500">
                Condition {index + 1}
              </legend>

              <div className="mb-2">
                <label
                  className="text-xs font-base text-gray-900 mb-1 block"
                  htmlFor={fieldId('condition-property', index)}
                >
                  Property
                </label>
                <select
                  id={fieldId('condition-property', index)}
                  className={selectClassName}
                  value={propertySelectValue}
                  onChange={event => changeProperty(index, event.target.value)}
                >
                  {propertyGroups.map(propertyGroup => (
                    <optgroup label={propertyGroup} key={propertyGroup}>
                      {CONDITION_PROPERTIES.filter(
                        option => option.group === propertyGroup
                      ).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value={CUSTOM_CONDITION_PROPERTY}>
                    Advanced / custom property
                  </option>
                </select>
              </div>

              {!property && (
                <div className="mb-2">
                  <label
                    className="text-xs font-base text-gray-900 mb-1 block"
                    htmlFor={fieldId('condition-custom-property', index)}
                  >
                    Property expression
                  </label>
                  <input
                    id={fieldId('condition-custom-property', index)}
                    className={inputClassName}
                    type="text"
                    placeholder="{{item.someProperty}}"
                    value={condition.property}
                    onChange={event =>
                      updateCondition(index, { property: event.target.value })
                    }
                  />
                </div>
              )}

              <div className="mb-2">
                <label
                  className="text-xs font-base text-gray-900 mb-1 block"
                  htmlFor={fieldId('condition-operator', index)}
                >
                  Comparison
                </label>
                <select
                  id={fieldId('condition-operator', index)}
                  className={selectClassName}
                  value={condition.operator}
                  onChange={event =>
                    updateCondition(index, { operator: event.target.value })
                  }
                >
                  {availableOperators.map(operator => (
                    <option key={operator.value} value={operator.value}>
                      {operator.label}
                    </option>
                  ))}
                </select>
              </div>

              {operatorNeedsValue(condition.operator) && (
                <div className="mb-2">
                  <label
                    className="text-xs font-base text-gray-900 mb-1 block"
                    htmlFor={fieldId('condition-value', index)}
                  >
                    Value
                  </label>
                  {property?.type === 'enum' ? (
                    <select
                      id={fieldId('condition-value', index)}
                      className={selectClassName}
                      value={String(condition.value ?? '')}
                      onChange={event =>
                        updateCondition(index, { value: event.target.value })
                      }
                    >
                      {property.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={fieldId('condition-value', index)}
                      className={inputClassName}
                      type="text"
                      placeholder={
                        property?.type === 'number'
                          ? 'Number or {{expression}}'
                          : 'Value or {{expression}}'
                      }
                      value={String(condition.value ?? '')}
                      onChange={event =>
                        updateCondition(index, { value: event.target.value })
                      }
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-gray-700">
                  <input
                    className="mr-2"
                    type="checkbox"
                    checked={condition.not === true}
                    onChange={event =>
                      updateCondition(index, { not: event.target.checked })
                    }
                  />
                  NOT (invert this condition)
                </label>
                <button
                  type="button"
                  className="text-xs text-red-700 disabled:text-gray-400"
                  disabled={group.conditions.length === 1}
                  onClick={() =>
                    commit({
                      ...group,
                      conditions: group.conditions.filter(
                        (_, conditionIndex) => conditionIndex !== index
                      )
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </fieldset>
          )
        })}
      </div>

      <button
        type="button"
        className="mt-2 w-full rounded-sm border border-gray-300 p-1 text-xs text-gray-800"
        onClick={() =>
          commit({
            ...group,
            conditions: [...group.conditions, createDefaultCondition()]
          })
        }
      >
        Add condition
      </button>
    </>
  )
}

export default IfComponent
