import { useState } from 'react'
import { setRoute } from '../../reducers/main'
import { ArrowLeft, Search } from 'lucide-react'
import actions from '../../schema/actions'
import ActionItem from './actionItem'
import { searchActions } from '../../utils/state-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ActionList = ({ dispatch }) => {
  const [search, setSearch] = useState('')

  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-10 top-0 h-10 flex-shrink-0">
        <div className="flex">
          <Button
            aria-label="Back to workflow"
            className="mr-2"
            onClick={() => dispatch(setRoute('add-shortcut'))}
            size="icon-sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <span className="font-medium text-sm">Actions</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between border-b bg-white sticky z-10 top-10">
        <div className="flex">
          <label htmlFor="search" className="flex items-center">
            <Search className="mr-4 h-4 w-4" />
          </label>
          <Input
            id="search"
            type="text"
            className="h-7 border-0 px-0 shadow-none focus-visible:ring-0"
            value={search}
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
                  {action.items.map(
                    (item, index) =>
                      !item.hidden && (
                        <div key={`${index}-${item.prettyName}`}>
                          <ActionItem dispatch={dispatch} item={item} />
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default ActionList
