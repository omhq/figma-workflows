import React, { useState, useRef } from 'react'
import { useClickOutside } from '../../hooks/click-outside'
import { BackBtn } from '../buttons'

const routes = {
  'style-export-detail': {
    isSecondary: true,
    main: 'home'
  },
  'collection-add': {
    isSecondary: true,
    main: 'collections'
  }
}

const Tabs = ({ route, pageTitle, onRouteChange, config }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const drop = useRef()
  useClickOutside(drop, () => setShowDropdown(false))

  if (route === 'collection-detail') {
    return null
  }

  return (
    <div className="bg-white border-b border-gray-200 flex flex-shrink-0 h-10 items-center justify-between px-2 sticky top-0 z-20">
      {routes[route] && routes[route].isSecondary ? (
        <BackBtn onClick={() => onRouteChange(routes[route].main)} />
      ) : (
        <div>
          <button
            className={`text-gray-${
              route === 'home' ? 900 : 400
            } text-xs px-2 hover:text-gray-900  `}
            type="button"
            onClick={() => onRouteChange('home')}
          >
            Inspect
          </button>
        </div>
      )}
    </div>
  )
}

export default Tabs
