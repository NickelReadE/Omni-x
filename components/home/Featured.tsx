import { useEffect, useState } from 'react'
import {TextH3, TextSH2} from '../common/Basic'
import {formatDollarAmount} from '../../utils/numbers'
import { collectionsService } from '../../services/collections'
import {BaseCollectionType} from '../../types/collections'
import Link from 'next/link'

const FeaturedCard = ({ collection }: { collection: BaseCollectionType }) => {
  return (
    <Link href={'/collections/' + collection.col_url}>
      <div className={'relative bg-[#00807D] rounded-[12px] aspect-[3/2] h-[300px] cursor-pointer'}>
        <div className={'flex items-center justify-center bg-frame-gradient rounded-[12px] w-full h-full hover:shadow-[0_0_30px_#FFE817]'}>
          <img src={collection.featured_image} alt={'featured'} className={'w-full h-full object-contain'} />
        </div>
        <div className={'flex justify-between items-center absolute bottom-0 left-0 w-full h-[60px] px-4'}>
          <TextH3 className={'text-white'}>{collection.name}</TextH3>
          <TextSH2 className={'text-white'}>{formatDollarAmount(collection.floor_price)} - {formatDollarAmount(collection.ceil_price)}</TextSH2>
        </div>
      </div>
    </Link>
  )
}

export const HomeFeatured = () => {
  const [collections, setCollections] = useState<BaseCollectionType[]>([])

  useEffect(() => {
    (async () => {
      const _collections = await collectionsService.getFeaturedCollections()
      setCollections(_collections.data)
    })()
  }, [])

  return (
    <div className={'flex items-center space-x-10 mt-8 overflow-auto'}>
      {
        collections.map((collection, index) => {
          return (
            <FeaturedCard key={index} collection={collection} />
          )
        })
      }
    </div>
  )
}
