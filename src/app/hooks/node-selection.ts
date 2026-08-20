import { useEffect } from 'react'
import { UI_SELECTED } from '../../plugin/actions/nodes'

const useNodeSelection = ({
  setSelected = (_data?: any) => {}
}: {
  setSelected?: (data?: any) => void
}) => {
  useEffect(() => {
    const listener = event => {
      const { type, data } = event.data.pluginMessage

      if (type === UI_SELECTED) {
        setSelected(data)
      }
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
  }, [])
}

export default useNodeSelection
