export const UI_SELECTED = 'ui-selected'


/**
 * Selected nodes to UI.
 */
export function selectedNodesToUI() {
  if (figma.currentPage.selection.length > 0) {
    figma.ui.postMessage({
      type: UI_SELECTED,
      data: figma.currentPage.selection
    })
  } else {
    figma.ui.postMessage({
      type: UI_SELECTED,
      data: []
    })
  }
}
