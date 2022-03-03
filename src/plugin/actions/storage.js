export const DATA_SET = 'user-data-set'
export const DATA_GET = 'user-data-get'
export const DATA_UI_GET = 'user-data-ui-get'
export const DATA_UI_SET = 'user-data-ui-set'
const STORAGE_NAME = 'workflows-user-data'

export const appRequestData = () => {
  parent.postMessage({ pluginMessage: { type: DATA_GET } }, '*')
}

export const appGetData = (data) => {
  figma.ui.postMessage({
    type: DATA_UI_GET,
    data: JSON.parse(data)
  })
}

export const appSetData = (data) => {
  figma.ui.postMessage({
    type: DATA_UI_SET,
    data
  })
}

export const appSubmitData = (data) => {
  parent.postMessage(
    {
      pluginMessage: {
        type: DATA_SET,
        data
      }
    },
    '*'
  )
}

export const pluginGetData = () => {
  figma.clientStorage.getAsync(STORAGE_NAME).then(data => appGetData(data || '{}'))
}

export const pluginSetData = (msg) => {
  figma.clientStorage
    .setAsync(
      STORAGE_NAME,
      JSON.stringify(msg.data)
    )
    .then(() => {
      appSetData({ error: false, success: true })
    })
    .catch(e => {
      appSetData({ error: true, success: false })
    })
}
