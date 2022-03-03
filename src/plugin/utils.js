import { get, set } from 'lodash'


const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

/**
 * Checks if a string can be parsed into an object.
 * Returns `false` for any valid json primitive.
 * eg. 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 * 
 * @param {*} str any string
 * @returns {*} false, or an object
 */
 export const isJson = (str) => {
  try {
    var o = JSON.parse(str)

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object", 
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o
    }
  }
  catch (e) { }

  return false
}

export const setTimer = (callback = () => {}, duration = 2000) => {
  const timer = setTimeout(() => {
    callback()
  }, duration)

  return timer
}

/**
 * Check if a string evaluates as a float.
 * 
 * @param {string} val A string value to check.
 * @returns 
 */
function isFloat(val) {
  const floatRegex = /^[-+]?[0-9]*[\.][0-9]+([eE][-+]?[0-9]+)?$/
  if (!floatRegex.test(val))
      return false

  val = parseFloat(val)

  if (isNaN(val))
      return false

  return true
}

/**
 * Check if a string evaluates as an integer.
 * 
 * @param {string} val A string value to check.
 * @returns 
 */
function isInt(val) {
  const intRegex = /^-?\d+$/
  if (!intRegex.test(val))
      return false

  let intVal = parseInt(val, 10)

  return parseFloat(val) == intVal && !isNaN(intVal)
}

/**
 * Generate a user friendly Figma API error message.
 * 
 * @param {string} error String.
 * @param {object} fnode Figma object reference.
 * @returns String.
 */
 export const generateErrorMessage = (error, fnode)  => {
  if (fnode) {
    return `${error} on ${fnode.type} node ${fnode.name}`
  }
  
  return error
}

const processExpression = (parsedText, data) => {
    const F = new Function(`
      const env = this.env
      const item = this.item
      try {
        return ${parsedText}
      } catch(e) {
        return e
      }
    `).bind(data)
    const ret = F()

    return ret
}

export const parseExpression = (fnode, env, value) => {
  return new Promise((resolve, reject) => {
    const fnodeRegex = /{{(.*?)}}/gm
    let expressionResult = ''
    let parsedText = value
    let match = fnodeRegex.exec(value)
    const data = {
      item: fnode,
      env: env
    }

    /*
    if (match === null) {
      expressionResult = processExpression(parsedText, data)
      resolve(expressionResult)
    }
    */

    while (match !== null) {
      const matchValue = match[1]

      if (matchValue) {
        expressionResult = processExpression(matchValue, data)

        if (expressionResult?.__proto__ instanceof Error) {
          reject(expressionResult)
        } else {
          if (expressionResult !== null) {

            // If the capture is the same length as the value just resolve it.
            // This will retain the type,  and not treat it as a string.
            if (parsedText.length === match[0].length) {
              resolve(expressionResult)
            }

            parsedText = parsedText.replace(match[0], expressionResult)
          }
        }
      }

      match = fnodeRegex.exec(value)
    }

    resolve(parsedText)
  })
}

export const normalizeComplexArgs = (valueAsObject, argDefinition) => {

  // the object that Figma expects
  let finalObj = {}

  for (const [argDefIndex, argDefValue] of Object.entries(argDefinition.args)) {
    const argType = argDefValue.type
    const argName = argDefValue.name
    let finalValue = get(valueAsObject, argName)

    if (finalValue) {
      if (argType === 'number') {
        if (isFloat(finalValue)) {
          finalValue = parseFloat(finalValue)
        }

        if (isInt(finalValue)) {
          finalValue = parseInt(finalValue, 10)
        }
      }

      finalObj = set(finalObj, argName, finalValue)
    }
  }

  return finalObj
}

/**
 * Check and populate normalized args.
 * 
 * @param {list} args Ordered list of initial args from the UI.
 * @param {list} argDefinitions Ordered list of normalized args for workflow.
 * @param {boolean} isFunction True or false if the operator is a function of not.
 * @returns 
 */
export const normalizeArgs = (args, argDefinitions, isFunction) => {
  let normalizedArgs = []

  args.forEach(function (value, i) {
    const argDefinition = argDefinitions[i]

    // "Type" specifies what kind of an argument this is.
    // Basic types are number, boolean, select, text are basic.
    // Default case handles custom json string that a custom components return.
    switch (argDefinition.type) {
      case 'number':
        if (isFloat(value)) {
          value = parseFloat(value)
          normalizedArgs.splice(i, 0, value)
        }

        if (isInt(value)) {
          value = parseInt(value, 10)
          normalizedArgs.splice(i, 0, value)
        }
        break
      case 'boolean':
      case 'select':
      case 'string':
      case 'text':
        normalizedArgs.splice(i, 0, value)
        break
      default:
        // would mean the value is a json string
        let valueAsObject = isJson(value)
        let finalObj = normalizeComplexArgs(valueAsObject, argDefinition)

        if (valueAsObject) {
          normalizedArgs.splice(i, 0, finalObj)
        }
    }
  })

  if (isFunction) {
    let functionArgs = []
    for (const [i, value] of normalizedArgs.entries()) {
      if (typeof(value) === 'object') {
        for (const [objKey, objValue] of Object.entries(value)) {
          functionArgs.push(objValue)
        }
      }
    }

    if (functionArgs.length) {
      return functionArgs
    }
  }

  return normalizedArgs
}
