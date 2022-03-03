import reduce from 'lodash/reduce'
import { nanoid } from 'nanoid/non-secure'
import { normalizeArgsInitialValues } from './form'
import { isJson } from '../../plugin/utils'


/**
 * Get invalid argument values for each action.
 *
 * @param {*} param0
 * @returns
 */
export const workflowHasEmptyValues = (nodes) => {
  let emptyValuesMap = {}

  const getEmptyValues = (nodes, emptyValuesMap) => {
    const nodesAsList = Object.entries(nodes)

    for (const [nodeIndex, s] of nodesAsList) {
      const node = nodes[nodeIndex]

      if (node.name !== 'Start') {
        for (const [i, value] of node.data.args.entries()) {
          if (node.data.argDefinitions[i].required) {
            const jsonData = isJson(value)

            if (jsonData) {
              if (jsonData.validation.valid === false) {
                emptyValuesMap[node.id] = value
              }
            } else {
              if (value === null) {
                emptyValuesMap[node.id] = value
              }
            }
          }
        }
      }

      if (nodes[nodeIndex].children && nodes[nodeIndex].children.length) {
        emptyValuesMap = {
          ...emptyValuesMap,
          ...getEmptyValues(nodes[nodeIndex].children, emptyValuesMap)
        }
      }
    }

    return emptyValuesMap
  }

  const ret = getEmptyValues(nodes, emptyValuesMap)

  return ret
}

/**
 * Prepare schema object to be send to the workflow engine.
 * Keys needs to be the same as node ids, because this is
 * how the workflow engine runs the chain.
 *
 * @param {object} shortcut The shortcut object.
 * @param {list} args List of arguments, primitve types.
 * @returns {object} A shortcut object with args and argDefinition properties populated.
 */
export const normalizeWorkflowWithKeys = (nodes) => {
  return reduce(nodes, (result, node) => {
    return {
      ...result,
      [node.id]: {
        ...node
      }
    }
  }, {})
}

const normalize = (nodes, args) => {
  const normalizeArgs = (nodes, args) => {
    const isArray = Object.prototype.toString.call(nodes) == '[object Array]'
    let ret = isArray ? [] : {}

    for (const [i] of Object.keys(nodes)) {
      const node = nodes[i]
      ret[i] = { ...node }

      if (ret[i].children && ret[i].children.length) {
        ret[i].children = normalizeArgs(ret[i].children, args)
      }

      const argValue = args[ret[i].id]

      if (argValue) {
        ret[i].data = {
          ...ret[i].data,
          args: Object.values(argValue)
        }
      }
    }

    return ret
  }

  const ret = normalizeArgs(nodes, args)

  return ret
}

/**
 * Prepare payload to send to the workflow engine.
 * Populate the shortcut args property with values.
 *
 * @param {object} shortcut The shortcut object.
 * @param {list} args List of arguments, primitve types.
 * @returns {object} A shortcut object with args and argDefinition properties populated.
 */
export const normalizeWorkflowWithArgs = (shortcut, args) => {
  return {
    ...shortcut,
    nodes: normalizeWorkflowWithKeys(normalize(shortcut.nodes, args))
  }
}

export const getInitialValues = (nodes) => {
  let values = {}

  const getValues = (nodes, values) => {
    const nodesAsList = Object.entries(nodes)

    for (const [nodeIndex, s] of nodesAsList) {
      const node = nodes[nodeIndex]

      if (node.name !== 'Start') {
        const acc = nodes.reduce((acc, node) => {
          if (node.name === 'Start') {
            return acc
          }

          return {
            ...acc,
            [node.id]: normalizeArgsInitialValues(node.data.argDefinitions, node.data.args)
          }
        }, {})

        values = {
          ...values,
          ...acc
        }
      }

      if (nodes[nodeIndex].children && nodes[nodeIndex].children.length) {
        values = {
          ...values,
          ...getValues(nodes[nodeIndex].children, values)
        }
      }
    }

    return values
  }

  const ret = getValues(nodes, values)

  return ret
}

/**
 * Filter nodes with empty fields.
 *
 * @param {array} nodes A list of nodes.
 * @returns {object} A dictionary, empty or containing nodes with empty args, using node id as key.
 */
export const getEmptyFields = (nodes) => {
  let emptyFieldsMap = {}

  const getMissingFields = (nodes, emptyFieldsMap) => {
    const nodesAsList = Object.entries(nodes)

    for (const [nodeIndex, s] of nodesAsList) {
      const node = nodes[nodeIndex]

      if (node.name !== 'Start') {
        const argDefs = node.data.argDefinitions

        if (argDefs) {
          for (const [argIndex, s] of Object.entries(argDefs)) {
            const nodeArgs = node.data.args[argIndex]
            const jsonData = isJson(nodeArgs)
            const retDict = { ...argDefs[argIndex], nodeId: node.id, prettyName: node.prettyName }

            if (jsonData) {
              if (jsonData.validation.valid === false) {
                emptyFieldsMap[node.id] = retDict
              }
            } else {
              if (nodeArgs === null) {
                emptyFieldsMap[node.id] = retDict
              }
            }
          }
        }

        if (nodes[nodeIndex].children && nodes[nodeIndex].children.length) {
          emptyFieldsMap = {
            ...emptyFieldsMap,
            ...getMissingFields(nodes[nodeIndex].children, emptyFieldsMap)
          }
        }
      }
    }

    return emptyFieldsMap
  }

  const ret = getMissingFields(nodes, emptyFieldsMap)

  return getMissingFields(nodes, emptyFieldsMap)
}


export const generateWorkflowId = () => {
  return `${nanoid(15)}@0.1.0`
}
