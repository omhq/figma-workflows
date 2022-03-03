export const INFO_GET = 'info-get'
export const INFO_UI_GET = 'info-ui-get'

export const appRequestInfo = () => {
  parent.postMessage({ pluginMessage: { type: INFO_GET } }, '*')
}

export const appGetInfo = () => {
  const pages = figma.currentPage.parent.children.map(page => ({
    id: page.id,
    name: page.name,
    isCurrent: figma.currentPage.id === page.id
  }))

  const data = {
    fileKey: figma.fileKey,
    currentPageId: figma.currentPage.id,
    pages
  }

  figma.ui.postMessage({
    type: INFO_UI_GET,
    data
  })
}
