import layer from './actions/layer.json'
import properties from './actions/properties.json'
import scripting from './actions/scripting.json'
import layout from './actions/layout.json'
import text from './actions/text.json'
import effects from './actions/effects'

export default [
  ...layer,
  ...scripting,
  ...layout,
  ...properties,
  ...effects,
  ...text
]
