import scripting from '../schema/actions/scripting.json'
import { defaultStartNode, generateNodeId } from '../schema/shortcut'


export const getIndentLevel = (nodes, index) => {
  let indent = 0
  let reversedActions = Object.keys(nodes).slice(0, index).reverse()
  let BreakException = {}

  reversedActions.forEach(prop => {
    try {
      const current = nodes[prop]
      if (current && current.name !== 'Start') {
        if (
          current.data.argDefinitions[0].operator === 'create') {
          indent = 6
          throw BreakException
        }
      }
    } catch(e) {
      if (e !== BreakException) throw e
    }
  })

  return indent
}

export const reorderNodes = (nodes, startIndex, endIndex) => {
  const result = Object.values(nodes)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const removeNode = (nodes, id) => {
  const toArray = Object.values(nodes)

  return toArray.filter((node) => node.id !== id)
}

/**
 * Add the most basic form of a node to shortcut. Before normalization.
 * 
 * @param {object} nodes Shortcut's current node set.
 * @param {object} payload Node data.
 * @returns 
 */
export const addNode = (nodes, payload) => {
  const { prettyName, icon, helper, name, data } = payload
  const nodeId = generateNodeId()
  const toArray = Object.values(nodes)
  let children = []

  // The arg definitions only get added during the action add event.
  // This means if we change the arg definitions in json, then the
  // user will have to remove and add this action again.
  const normalizeData = {
    ...data,
    args: data?.args ? data.args.map((field) => field.default || null) : [],
    argDefinitions: data?.args ? data.args : []
  }

  // add additional child nodes if they are required
  if (payload.data.operator === 'selection-current') {
    const forEachAction = scripting[0].items.filter(function(item) { return item.prettyName === 'For each' })[0]
    const childrenObj = normalizeNodes(addNode(children, forEachAction))

    children = Object.keys(childrenObj).map(function(key) {
      return childrenObj[key]
    })
  }

  toArray.push({
    prettyName: prettyName,
    icon: icon,
    children: children,
    type: null,
    helper: helper,
    name: name,
    id: nodeId,
    data: normalizeData,
    inputs: {},
    outputs: {}
  })

  return toArray
}

/**
 * This whole function relies on objects being sorted properly.
 * 
 * @param {*} nodes List of workflow nodes.
 * @returns 
 */
export const normalizeNodes = (nodes = []) => {
  // If the current nodes length is 1, and the first node is
  // not a Start node add the required Start node to the beggining.
  if (nodes.length === 1 && nodes[0].name !== 'Start') {
    nodes.unshift(defaultStartNode())
  }

  return nodes.reduce((acc, node, index, arr) => {
    // Remove the start node is its a single node in the list.
    if (arr.length === 1 && arr[0].name === 'Start') {
      return {}
    }

    let indent = 0
    let nodeType = 'child'
    const prevIndex = index - 1
    const nextIndex = index + 1
    const prevNode = nodes[prevIndex]
    const nextNode = nodes[nextIndex]

    if (node.data) {
      if (node.data.argDefinitions && node.data.argDefinitions.length) {
        if (['create'].includes(node.data.argDefinitions[0].operator)) {
          nodeType = 'container'
        }
      }

      if (['selection-current', 'loop', 'if', 'else', 'repeat'].includes(node.data.operator)) {
        nodeType = 'container'
      }
    }

    const nodeInputs = 
      prevNode
        ?
          {
            input: {
              connections: [
                {
                  node: prevNode.id,
                  output: 'output'
                }
              ]
            }
          }
        : {}

    const nodeOutputs =
      nextNode
        ? {
          output: {
            connections: [
              {
                node: nextNode.id,
                input: 'input'
              }
            ]
          }
        }
        : {}

    const currentNode = {
      ...node,
      type: node?.type || nodeType,
      children: node?.children || [],
      indent: indent,
      inputs: nodeInputs,
      outputs: nodeOutputs
    }

    return {
      ...acc,
      [index]: currentNode
    }
  }, {})
}

export const searchActions = (actions = [], search = '') => {
  return actions.reduce((acc, action) => {
    const filteredItems = action.items.filter(item =>
      item.prettyName.toLowerCase().includes(search.toLowerCase())
    )

    if (filteredItems.length) {
      return [
        ...acc,
        {
          ...action,
          items: filteredItems
        }
      ]
    }

    return acc
  }, [])
}
