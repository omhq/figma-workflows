import { isNil } from '../../shared/object'

/**
 * Normalize initial values for formik forms.
 *
 * @param {list} fields A list of objects describing the fields, coming from actions[].items[].data.args.
 * @param {list} args List of primitive types representing the values for args.
 * @returns {object} An object of keys and values to populate the formik forms, eg. {fontsize: ""}.
 */
export const normalizeArgsInitialValues = (fields, args) => {
  return fields.reduce((acc, field, index) => {
    const fieldDefaultValue = !isNil(field.defaultValue)
      ? field.defaultValue
      : ''

    return {
      ...acc,
      [field.name]: args[index] !== null ? args[index] : fieldDefaultValue
    }
  }, {})
}
