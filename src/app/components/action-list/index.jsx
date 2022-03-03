import React, { useState } from 'react'
import { setRoute } from '../../reducers/main'
import { ArrowNarrowLeftIcon, SearchIcon } from '@heroicons/react/solid'
import actions from '../../schema/actions.js'
import ActionItem from './actionItem'
import { searchActions } from '../../utils/state-actions'

const ActionList = ({ dispatch }) => {
  const [search, setSearch] = useState('')

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-10 top-0 h-10 flex-shrink-0">
        <div className="flex">
          <button
            type="button"
            className="font-base text-black text-sm mr-4"
            onClick={() => dispatch(setRoute('add-shortcut'))}
          >
            <ArrowNarrowLeftIcon className="h-4 w-4 font-base" />
          </button>

          <div>
            <span className="font-medium text-sm">Actions</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-10 top-10">
        <div className="flex">
          <label htmlFor="search" className="flex items-center">
            <SearchIcon className="h-4 w-4 font-base mr-4" />
          </label>
          <input
            id="search"
            type="text"
            className="text-sm"
            defaultValue={search}
            placeholder="Search"
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div
        className="overflow-auto pt-4"
        style={{ height: 'calc(100% - 77px)' }}
      >
        {searchActions(actions, search).map(action => (
          <div key={action.category}>
            {action.items.length > 0 && (
              <div className="mb-4">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mx-4">
                    {action.category}
                  </h3>
                </div>
                <div className="flex flex-col mb-6">
                  {action.items.map((item, index) => (
                    (!item.hidden && (
                      <div key={`${index}-${item.prettyName}`}>
                        <ActionItem dispatch={dispatch} item={item} />
                      </div>
                    ))
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="mb-6">
        <button
          className="bg-white border-2 border-black p-4 w-full"
          type="button"
          onClick={() => [dispatch(setRoute('add-new-action'))]}
        >
          New
        </button>
      </div> */}
    </>
  )
}

export default ActionList
