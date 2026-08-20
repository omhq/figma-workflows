import scripting from '../schema/actions/scripting.json'
import { defaultStartNode, generateNodeId } from '../schema/shortcut'

export const getIndentLevel = (nodes, index) => {
  let indent = 0
  const reversedActions = Object.keys(nodes).slice(0, index).reverse()
  const BreakException = {}

  reversedActions.forEach(prop => {
    try {
      const current = nodes[prop]
      if (current && current.name !== 'Start') {
        if (current.data.argDefinitions[0].operator === 'create') {
          indent = 6
          throw BreakException
        }
      }
    } catch (e) {
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
  const toArray = Object.values(nodes) as any[]

  return toArray.filter(node => node.id !== id)
}

/**
 * Replace a container's children by stable node ID. Sortable indexes become
 * stale when an item is removed from a list before it is added to a nested one.
 */
export const replaceNodeChildren = (nodes, nodeId, children) => {
  return (Object.values(nodes || {}) as any[]).map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        children
      }
    }

    if (node.children && Object.keys(node.children).length) {
      return {
        ...node,
        children: replaceNodeChildren(node.children, nodeId, children)
      }
    }

    return node
  })
}

/**
 * Apply a new root ordering without replacing newer nested-list updates that
 * may have been emitted first during the same cross-list drag.
 */
export const mergeRootNodesWithLatestChildren = (nodes, latestNodes) => {
  const latestById = new Map(
    (Object.values(latestNodes || {}) as any[]).map(node => [
      String(node.id),
      node
    ])
  )

  return (Object.values(nodes || {}) as any[]).map(node => {
    const latest = latestById.get(String(node.id)) as any

    return latest
      ? {
          ...node,
          children: latest.children || []
        }
      : node
  })
}

/**
 * Remove duplicate action IDs from a nested workflow, preferring the deepest
 * copy. During a cross-list drop, Sortable can briefly report the same action
 * in both its source and destination lists.
 */
export const dedupeNodeTree = nodes => {
  const seen = new Set<string>()

  const visit = currentNodes => {
    const nodesWithNormalizedChildren = (
      Object.values(currentNodes || {}) as any[]
    ).map(node => ({
      ...node,
      children: node.children ? visit(node.children) : []
    }))

    return nodesWithNormalizedChildren.filter(node => {
      // Start nodes belong to independent workflow levels and are never dragged.
      if (node.name === 'Start') return true

      const id = String(node.id)
      if (seen.has(id)) return false

      seen.add(id)
      return true
    })
  }

  return visit(nodes)
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
    args: data?.args ? data.args.map(field => field.default || null) : [],
    argDefinitions: data?.args ? data.args : []
  }

  // add additional child nodes if they are required
  if (payload.data.operator === 'selection-current') {
    const forEachAction = scripting[0].items.filter(function (item) {
      return item.prettyName === 'For each'
    })[0]
    const childrenObj = normalizeNodes(addNode(children, forEachAction))

    children = Object.keys(childrenObj).map(function (key) {
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

    const indent = 0
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

      if (
        ['selection-current', 'loop', 'if', 'else', 'repeat'].includes(
          node.data.operator
        )
      ) {
        nodeType = 'container'
      }
    }

    const nodeInputs = prevNode
      ? {
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

    const nodeOutputs = nextNode
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
