export const getActionsCount = (shortcut) => {
  let total = 0

  const getTotal = (nodes, total) => {
    for (const [i, s] of Object.entries(nodes)) {
      if (nodes[i].children && nodes[i].children.length) {
        total = getTotal(nodes[i].children, total)
      }
    }

    return total += Object.keys(nodes).map((key) => nodes[key]).filter(item => {
      return item.name !== 'Start'
    }).length
  }

  return getTotal(shortcut.nodes, total)
}

export const generateNodeId = () => {
  const nums = new Set()

  while(nums.size !== 5) {
    nums.add(Math.floor(Math.random() * 100) + 1);
  }

  return parseInt([...nums].map(function (x) { 
    return x.toString()[0]
  }).join(''), 10)
}

export const defaultStartNode = () => {
  return {
    prettyName: 'Start',
    name: 'Start',
    id: generateNodeId(),
    data: {
      loadFonts: true
    },
    inputs: {},
    outputs: {}
  }
}

export const getShortcutInitialSchema = ({ id }) => {
  return {
    id,
    prettyName: null,
    nodes: {}
  }
}
