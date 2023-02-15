import {useState} from 'react'
import {FavoriteCollectionType, FavoriteItemType} from '../../types/collections'
import {FavoriteItemHeader, FavoriteItem} from './FavoriteItem'
import {FavoriteCollectionHeader, FavoriteCollection} from './FavoriteCollection'

export const UserFavorites = ({ items, collections }: { items: FavoriteItemType[], collections: FavoriteCollectionType[] }) => {
  const [selectedItem, setSelectedItem] = useState<number>(0)

  const activeClasses = (index: number) => {
    return index === selectedItem ? 'text-primary': 'text-secondary'
  }

  return (
    <div className={'grid grid-cols-4 lg:grid-cols-6'}>
      <div className={'hidden lg:block'} />
      <div className="col-span-4 rounded-md shadow-sm" role="group">
        {/*Button Group section*/}
        <div className={'flex'}>
          <div className={`${activeClasses(0)} w-[105px] text-center bg-primary-gradient rounded-l-lg p-[1px]`}>
            <button
              type="button"
              className={`${selectedItem === 0 ? 'bg-transparent' : 'bg-primary'} w-full py-2 px-4 text-md font-medium rounded-l-lg focus:z-10 focus:ring-0`}
              onClick={() => setSelectedItem(0)}
            >
              collections
            </button>
          </div>
          <div className={`${activeClasses(1)} w-[105px] text-center bg-primary-gradient rounded-r-md p-[1px]`}>
            <button
              type="button"
              className={`${selectedItem === 1 ? 'bg-transparent' : 'bg-primary'} w-full py-2 px-4 text-md font-medium rounded-r-md focus:z-10 focus:ring-0`}
              onClick={() => setSelectedItem(1)}
            >
              items
            </button>
          </div>
        </div>

        {/*Content section*/}
        {
          selectedItem === 1 &&
          <div>
            <FavoriteItemHeader />
            {
              items.map((item, index) => {
                return <FavoriteItem item={item} key={index} />
              })
            }
          </div>
        }
        {
          selectedItem === 0 &&
          <div>
            <FavoriteCollectionHeader />
            {
              collections.map((collection, index) => {
                return <FavoriteCollection collection={collection} key={index} />
              })
            }
          </div>
        }
      </div>
    </div>
  )
}
