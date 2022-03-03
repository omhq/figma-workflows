import omit from 'lodash/omit'
import { appSubmitData } from '../../plugin/actions/storage'
import { getShortcutInitialSchema } from '../schema/shortcut'
import {
  removeNode,
  addNode,
  normalizeNodes
} from '../utils/state-actions'

export const initialState = {
  autoRunSelectedWorkflows: [],
  shortcutsById: {},
  activeShortcut: null,
  savedActions: [],
  route: 'home',
  fromRoute: null,
  workflowSuccessMessage: null,
  workflowWarningMessage: null,
  workflowErrorMessage: null,
  workflowAdded: false,
  selection: {},
  openedNodeById: {},
  status: {
    loading: true
  }
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SHORTCUT': {
      return {
        ...state,
        activeShortcut: getShortcutInitialSchema({
          id: action.payload.id
        })
      }
    }
    case 'SET_ACTIVE_SHORTCUT': {
      return {
        ...state,
        activeShortcut: action.payload
      }
    }
    case 'SAVE_SHORTCUT': {
      const { savedActions, activeShortcut } = state
      const shortcutsById = {
        ...state.shortcutsById,
        [activeShortcut.id]: activeShortcut
      }
      appSubmitData({ shortcutsById, savedActions })

      return {
        ...state,
        shortcutsById
      }
    }
    case 'EDIT_SHORTCUT': {
      const { activeShortcut } = state

      return {
        ...state,
        activeShortcut: {
          ...activeShortcut,
          ...action.payload
        }
      }
    }
    case 'REMOVE_SHORTCUT': {
      const { savedActions } = state
      const shortcutsById = omit(state.shortcutsById, action.payload)
      appSubmitData({ shortcutsById, savedActions })

      return {
        ...state,
        shortcutsById
      }
    }
    case 'ADD_ACTION': {
      const payload = action.payload
      const shortcut = state.activeShortcut
      const nodes = normalizeNodes(addNode(shortcut.nodes, payload))

      return {
        ...state,
        activeShortcut: {
          ...state.activeShortcut,
          nodes
        }
      }
    }
    case 'REMOVE_ACTION': {
      const id = action.payload
      const shortcut = state.activeShortcut

      const remove = (nodes, id) => {
        for (const [i] of Object.entries(nodes)) {
          if (nodes[i].children && nodes[i].children.length) {
            const removed = normalizeNodes(remove(nodes[i].children, id))
            nodes[i].children = Object.keys(removed).map((key) => removed[key])
          }
        }

        return removeNode(nodes, id)
      }

      const nodes = normalizeNodes(remove(shortcut.nodes, id))

      return {
        ...state,
        activeShortcut: {
          ...state.activeShortcut,
          nodes
        }
      }
    }
    case 'UPDATE_ACTION': {
      let { nodes } = action.payload

      const normalize = (nodes) => {
        for (const [i] of Object.entries(nodes)) {
          if (nodes[i].children && nodes[i].children.length) {
            const nomalized = normalize(nodes[i].children)
            nodes[i].children = Object.keys(nomalized).map((key) => nomalized[key])
          }
        }

        return normalizeNodes(nodes)
      }

      nodes = normalize(nodes)

      return {
        ...state,
        activeShortcut: {
          ...state.activeShortcut,
          nodes
        }
      }
    }
    case 'EDIT_ARGS_SHORTCUT': {
      const { id, args } = action.payload
      const shortcut = state.activeShortcut
      const updateArgs = (nodes, id, args) => {
        for (const [i] of Object.entries(nodes)) {
          if (nodes[i].id === id) {
            nodes[i].data.args = args
            return nodes
          } else {
            if (nodes[i].children) {
              const updated = updateArgs(nodes[i].children, id, args)
              nodes[i].children = Object.keys(updated).map((key) => updated[key])
            }
          }
        }

        return nodes
      }

      const nodes = updateArgs(shortcut.nodes, id, args)

      return {
        ...state,
        activeShortcut: {
          ...shortcut,
          nodes
        }
      }
    }
    case 'EDIT_RUNS_ON': {
      const runContext = action.payload
      const shortcut = state.activeShortcut

      return {
        ...state,
        activeShortcut: {
          ...shortcut,
          runContext
        }
      }
    }
    case 'SET_DATA': {
      return {
        ...state,
        status: {
          loading: false
        },
        shortcutsById: action.payload.shortcutsById || {},
        savedActions: action.payload.savedActions || []
      }
    }
    case 'SAVE_ACTION': {
      const { shortcutsById } = state
      const savedActions = [...state.savedActions, action.payload]
      appSubmitData({ shortcutsById, savedActions })

      return {
        ...state,
        savedActions
      }
    }
    case 'SET_ROUTE': {
      return {
        ...state,
        route: action.payload,
        fromRoute: action.config
      }
    }
    case 'SET_WORKFLOW_MESSAGE': {
      if (action.payload.messageType === 0) {
        return {
          ...state,
          workflowSuccessMessage: action.payload.message
        }
      }

      if (action.payload.messageType === 1) {
        return {
          ...state,
          workflowErrorMessage: action.payload.message
        }
      }

      if (action.payload.messageType === 2) {
        return {
          ...state,
          workflowWarningMessage: action.payload.message
        }
      }

      return state
    }
    case 'CLEAR_ALL_WORKFLOW_MESSAGES': {
      return {
        ...state,
        workflowSuccessMessage: null,
        workflowErrorMessage: null,
        workflowWarningMessage: null
      }
    }
    case 'RESET_WORKFLOW_ARGS_BY_ID': {
      return {
        ...state
      }
    }
    case 'CLEAR_WORKFLOW_MESSAGE': {
      if (action.payload.messageType === 0) {
        return {
          ...state,
          workflowSuccessMessage: null
        }
      }
      if (action.payload.messageType === 1) {
        return {
          ...state,
          workflowErrorMessage: null
        }
      }
      if (action.payload.messageType === 2) {
        return {
          ...state,
          workflowWarningMessage: null
        }
      }

      return state
    }
    case 'SET_SELECTION_BY_WORKFLOW_ID': {
      const { id, selection } = action.payload

      return {
        ...state,
        selection: {
          ...state.selection,
          [id]: selection
        }
      }
    }
    case 'REMOVE_SELECTION_ITEM_BY_WORKFLOW_ID': {
      const { id, item } = action.payload

      return {
        ...state,
        selection: {
          ...state.selection,
          [id]: (state.selection[id] || []).filter(i => i.id !== item)
        }
      }
    }
    case 'SET_AUTO_RUN_SELECTED_WORKFLOWS': {
      const id = action.payload

      return {
        ...state,
        autoRunSelectedWorkflows: [id]
      }
    }
    case 'CLEAR_AUTO_RUN_SELECTED_WORKFLOWS': {
      return {
        ...state,
        autoRunSelectedWorkflows: []
      }
    }
    case 'SET_WORKFLOW_ADDED': {
      return {
        ...state,
        workflowAdded: action.payload
      }
    }
    case 'OPEN_NODE_TOGGLE': {
      const nodeId = action.payload.id

      return {
        ...state,
        openedNodeById: {
          ...state.openedNodeById,
          [nodeId]: !state.openedNodeById[nodeId]
        }
      }
    }
    default:
      throw new Error()
  }
}

export const editRunContext = payload => ({ type: 'EDIT_RUNS_ON', payload })

export const addShortcut = payload => ({ type: 'ADD_SHORTCUT', payload })
export const setActiveShortcut = payload => ({ type: 'SET_ACTIVE_SHORTCUT', payload })
export const saveShortcut = payload => ({ type: 'SAVE_SHORTCUT', payload })
export const editShortcut = payload => ({ type: 'EDIT_SHORTCUT', payload })
export const editArgsShortcut = payload => ({ type: 'EDIT_ARGS_SHORTCUT', payload })
export const removeShortcut = payload => ({ type: 'REMOVE_SHORTCUT', payload })

export const addAction = payload => ({ type: 'ADD_ACTION', payload })
export const saveAction = payload => ({ type: 'SAVE_ACTION', payload })
export const removeAction = payload => ({ type: 'REMOVE_ACTION', payload })
export const updateAction = payload => ({ type: 'UPDATE_ACTION', payload })

export const setData = payload => ({ type: 'SET_DATA', payload })
export const setRoute = (payload, config) => ({ type: 'SET_ROUTE', payload, config })

export const setWorkflowMessage = payload => ({ type: 'SET_WORKFLOW_MESSAGE', payload })
export const clearWorkflowMessage = payload => ({ type: 'CLEAR_WORKFLOW_MESSAGE', payload })
export const clearAllWorkflowMessages = payload => ({ type: 'CLEAR_ALL_WORKFLOW_MESSAGES', payload })

export const setWorkflowAdded = payload => ({ type: 'SET_WORKFLOW_ADDED', payload })

export const openNodeToggle = payload => ({ type: 'OPEN_NODE_TOGGLE', payload })

export const setSelection = payload => ({
  type: 'SET_SELECTION_BY_WORKFLOW_ID',
  payload
})

export const removeSelectionItem = payload => ({
  type: 'REMOVE_SELECTION_ITEM_BY_WORKFLOW_ID',
  payload
})

export const setAutoRunSelectedWorkflows = payload => ({
  type: 'SET_AUTO_RUN_SELECTED_WORKFLOWS',
  payload
})

export const clearAutoRunSelectedWorkflows = payload => ({
  type: 'CLEAR_AUTO_RUN_SELECTED_WORKFLOWS',
  payload
})

export const resetWorkflowArgsById = payload => ({
  type: 'RESET_WORKFLOW_ARGS_BY_ID',
  payload
})
