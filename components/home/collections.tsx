import { useMemo } from 'react'
import useData from '../../hooks/useData'
import CollectionCard from './CollectionCard'

export default function HomeCollections() {
  const { collections } = useData()

  const collectionCards = useMemo(() => {
    return collections.map((item: any, index: number) => {
      return <CollectionCard key={index} collection={item} />
    })
  }, [collections])

  return (
    <div className="mt-12">
      <span className="text-primary-light text-xxxl font-medium">
        Omni Collections
      </span>
      <div className="w-full flex flex-wrap justify-start gap-12 mt-6">
        {
          collectionCards.map((item, index) => (
            <div className='w-[340px] rounded-lg' key={index} >
              {item}
            </div>
          ))
        }
      </div>
    </div>
  )
}
