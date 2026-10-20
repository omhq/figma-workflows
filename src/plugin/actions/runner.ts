import { WorkflowEngine } from './engine'
import BaseNodePropertiesComponent from './components/BaseNodePropertiesComponent'
import BlendMixinComponent from './components/BlendMixinComponent'
import ContainerMixinComponent from './components/ContainerMixinComponent'
import CornerMixinComponent from './components/CornerMixinComponent'
import EllipseNodeComponent from './components/EllipseNodeComponent'
import HttpRequestComponent from './components/HttpRequestComponent'
import FrameNodeComponent from './components/FrameNodeComponent'
import GeometryMixinComponent from './components/GeometryMixinComponent'
import LayoutMixinComponent from './components/LayoutMixinComponent'
import LineNodeComponent from './components/LineNodeComponent'
import PolygonNodeComponent from './components/PolygonNodeComponent'
import RectangleNodeComponent from './components/RectangleNodeComponent'
import SceneNodeMixinComponent from './components/SceneNodeMixinComponent'
import StarNodeComponent from './components/StarNodeComponent'
import StartComponent from './components/StartComponent'
import TextNodeComponent from './components/TextNodeComponent'
import VectorNodeComponent from './components/VectorNodeComponent'
import CodeComponent from './components/CodeComponent'
import EffectsComponent from './components/EffectsComponent'
import { WORKFLOW_RUN_COMPLETE } from '../../plugin/actions/data'
import { publishWorkflowMessage } from './workflow'

/**
 * All types are taken from https://github.com/figma/plugin-typings/blob/master/index.d.ts
 * Currently the engine will handle all node types except for: BooleanOperationNode,
 * ComponentNode, ComponentSetNode, DocumentNode, GroupNode, InstanceNode, PageNode,
 * SliceNode.
 *
 * @param {object} runData Workflow execution flow.
 * @param {object} runContext Contains env vars, target
 * node if there is one, and anything additional during the workflow run.
 *
 */
export default async function run(runData, runContext) {
  const context = runContext || {
    operateOn: null,
    env: {}
  }
  const components = []
  const registered = []

  for (const property in runData.nodes) {
    const name = runData.nodes[property]['name']

    if (registered.includes(name)) {
      continue
    }

    registered.push(name)

    switch (name) {
      case 'BaseNode':
        components.push(new BaseNodePropertiesComponent())
        break

      case 'BlendMixin':
        components.push(new BlendMixinComponent())
        break

      case 'ContainerMixin':
        components.push(new ContainerMixinComponent())
        break

      case 'Code':
        components.push(new CodeComponent())
        break

      case 'CornerMixin':
        components.push(new CornerMixinComponent())
        break

      case 'EllipseNode':
        components.push(new EllipseNodeComponent())
        break

      case 'Effects':
        components.push(new EffectsComponent())
        break

      case 'FrameNode':
        components.push(new FrameNodeComponent())
        break

      case 'GeometryMixin':
        components.push(new GeometryMixinComponent())
        break

      case 'HttpRequest':
        components.push(new HttpRequestComponent())
        break

      case 'LayoutMixin':
        components.push(new LayoutMixinComponent())
        break

      case 'LineNode':
        components.push(new LineNodeComponent())
        break

      case 'PolygonNode':
        components.push(new PolygonNodeComponent())
        break

      case 'RectangleNode':
        components.push(new RectangleNodeComponent())
        break

      case 'SceneNodeMixin':
        components.push(new SceneNodeMixinComponent())
        break

      case 'StarNode':
        components.push(new StarNodeComponent())
        break

      case 'Start':
        components.push(new StartComponent(context))
        break

      case 'TextNode':
        components.push(new TextNodeComponent())
        break

      case 'VectorNode':
        components.push(new VectorNodeComponent())
        break

      default:
        break
    }
  }

  const engine = new WorkflowEngine()
  components.forEach(c => {
    engine.register(c)
  })

  try {
    await engine.process(runData)
    publishWorkflowMessage(0, 'Workflow finished!')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(error)
    publishWorkflowMessage(2, message)
  } finally {
    figma.ui.postMessage({
      type: WORKFLOW_RUN_COMPLETE,
      data: {
        id: runData.id
      }
    })
  }
}
