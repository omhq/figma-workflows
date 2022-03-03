import { useEffect } from 'react'

export const useClickOutside = (ref, onClickOutside) => {
  useEffect(
    () => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }

        onClickOutside(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, onClickOutside]
  )
}
