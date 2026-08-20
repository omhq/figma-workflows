export type WorkflowNodeId = string | number

export interface WorkflowConnection {
  node: WorkflowNodeId
  input?: string
  output?: string
}

export interface WorkflowSocket {
  connections?: WorkflowConnection[]
}

export interface WorkflowNode {
  id: WorkflowNodeId
  name: string
  prettyName?: string
  data?: Record<string, any>
  inputs?: Record<string, WorkflowSocket>
  outputs?: Record<string, WorkflowSocket>
  [key: string]: any
}

export interface WorkflowData {
  id: string
  nodes: Record<string, WorkflowNode>
  [key: string]: any
}

export type WorkflowInputs = Record<string, any[]>
export type WorkflowOutputs = Record<string, any>

export abstract class WorkflowComponent {
  readonly name: string
  protected data: any

  constructor(name: string) {
    this.name = name
  }

  abstract worker(
    node: WorkflowNode,
    inputs: WorkflowInputs,
    outputs: WorkflowOutputs
  ): void | Promise<void>
}

const nodeLabel = (node: WorkflowNode) =>
  node.prettyName ? `${node.prettyName} (${node.name})` : node.name

/**
 * Executes the persisted workflow graph format.
 *
 * Resolves dependencies first and stops immediately
 * with the action that actually failed.
 */
export class WorkflowEngine {
  private readonly components = new Map<string, WorkflowComponent>()

  register(component: WorkflowComponent) {
    if (this.components.has(component.name)) {
      throw new Error(
        `Workflow component "${component.name}" is already registered`
      )
    }

    this.components.set(component.name, component)
  }

  async process(data: WorkflowData): Promise<'success'> {
    const nodes = Object.values(data.nodes || {})
    const nodesById = new Map(nodes.map(node => [String(node.id), node]))
    const completed = new Map<string, WorkflowOutputs>()
    const processing = new Set<string>()

    if (nodesById.size !== nodes.length) {
      throw new Error('Workflow contains duplicate node IDs')
    }

    const processNode = async (
      node: WorkflowNode
    ): Promise<WorkflowOutputs> => {
      const id = String(node.id)
      const cached = completed.get(id)

      if (cached) return cached
      if (processing.has(id)) {
        throw new Error(`Workflow contains a cycle at "${nodeLabel(node)}"`)
      }

      const component = this.components.get(node.name)
      if (!component) {
        throw new Error(`Unsupported workflow action "${nodeLabel(node)}"`)
      }

      processing.add(id)

      try {
        const inputs: WorkflowInputs = {}
        const inputEntries = Object.entries(node.inputs || {})

        if (node.name !== 'Start' && inputEntries.length === 0) {
          throw new Error(
            `Workflow action "${nodeLabel(node)}" is not connected to Start`
          )
        }

        for (const [inputName, socket] of inputEntries) {
          const connections = socket.connections || []

          if (connections.length === 0) {
            throw new Error(
              `Input "${inputName}" on "${nodeLabel(node)}" is not connected`
            )
          }

          inputs[inputName] = []

          for (const connection of connections) {
            const source = nodesById.get(String(connection.node))
            if (!source) {
              throw new Error(
                `Workflow action "${nodeLabel(node)}" references a missing input node`
              )
            }

            const sourceOutputs = await processNode(source)
            const outputName = connection.output || 'output'

            if (!(outputName in sourceOutputs)) {
              throw new Error(
                `Workflow action "${nodeLabel(source)}" did not produce "${outputName}"`
              )
            }

            inputs[inputName].push(sourceOutputs[outputName])
          }
        }

        const outputs: WorkflowOutputs = {}

        try {
          await component.worker(node, inputs, outputs)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          throw new Error(
            `Workflow action "${nodeLabel(node)}" failed: ${message}`
          )
        }

        completed.set(id, outputs)
        return outputs
      } finally {
        processing.delete(id)
      }
    }

    for (const node of nodes) {
      await processNode(node)
    }

    return 'success'
  }
}
