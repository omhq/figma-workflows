import { reduce, isNil } from 'lodash'

/**
 * Not used currently.
 *
 * @param {*} formSchema
 * @returns
 */
export const normalizeInitialValues = (formSchema) => reduce(
  formSchema,
  (result, value, key) => {
    if (value.group) {
      result[value.group] = {
        ...(result[value.group] || {}),
        [key]: value.value || ''
      }
    } else {
      result[key] = value.value || ''
    }

    return result
  },
  {}
)

/**
 * Normalize initial values for formik forms.
 *
 * @param {list} fields A list of objects describing the fields, coming from actions[].items[].data.args.
 * @param {list} args List of primitive types representing the values for args.
 * @returns {object} An object of keys and values to populate the formik forms, eg. {fontsize: ""}.
 */
export const normalizeArgsInitialValues = (fields, args) => {
  return fields.reduce((acc, field, index) => {
    const fieldDefaultValue = !isNil(field.defaultValue) ? field.defaultValue : ''

    return {
      ...acc,
      [field.name]: args[index] !== null ? args[index] : fieldDefaultValue
    }
  }, {})
}

/**
 * Not used currently.
 *
 * @param {*} values
 * @returns
 */
export const normalizeResult = (values) => {
  const { prettyName, name, args, loadFonts, api } = values

  return {
    prettyName,
    name,
    data: {
      loadFonts,
      api,
      operator: values.operator,
      args: [args.start, args.end, args.value]
    }
  }
}
