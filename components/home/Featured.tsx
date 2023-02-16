import {useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {TextH3, TextSH2} from '../common/Basic'
import {formatDollarAmount} from '../../utils/numbers'
import { collectionsService } from '../../services/collections'
import {BaseCollectionType} from '../../types/collections'

const FeaturedCard = ({ collection, ethPrice }: { collection: BaseCollectionType, ethPrice: number }) => {
  const floor_price = useMemo(() => {
    if (collection.floor_prices.ethereum === 0) {
      return collection.floor_prices.stable
    }
    if (collection.floor_prices.stable === 0) {
      return collection.floor_prices.ethereum * ethPrice
    }
    return Math.min(collection.floor_prices.ethereum * ethPrice, collection.floor_prices.stable)
  }, [collection, ethPrice])

  const ceil_price = useMemo(() => {
    if (collection.ceil_prices.ethereum === 0) {
      return collection.ceil_prices.stable
    }
    if (collection.ceil_prices.stable === 0) {
      return collection.ceil_prices.ethereum * ethPrice
    }
    return Math.max(collection.ceil_prices.ethereum * ethPrice, collection.ceil_prices.stable)
  }, [collection, ethPrice])

  return (
    <Link href={'/collections/' + collection.col_url}>
      <div className={'relative bg-[#00807D] rounded-[12px] aspect-[3/2] h-[300px] cursor-pointer m-2 featured-card group'}>
        {/* <div className={'flex items-center justify-center bg-frame-gradient rounded-[12px] w-full h-full card-bg'}> */}
        <img src={collection.featured_image} alt={'featured'} className={'w-full h-full object-cover rounded-[12px]'} />
        <div className="absolute rounded-b-[12px] bottom-0 left-0 right-0 h-16 opacity-0 bg-gradient-to-t from-black via-black to-transparent group-hover:opacity-60 duration-100" ></div>
        {/* </div> */}
        <div className={'flex justify-between items-center absolute bottom-0 left-0 w-full h-[60px] px-4 card-text'}>
          <TextH3 className={'text-[#F5F5F5]'}>{collection.name}</TextH3>
          <TextSH2 className={'text-[#F5F5F5]'}>{formatDollarAmount(floor_price)} - {formatDollarAmount(ceil_price)}</TextSH2>
        </div>
      </div>
    </Link>
  )
}

export const HomeFeatured = ({ ethPrice }: {ethPrice: number}) => {
  const [collections, setCollections] = useState<BaseCollectionType[]>([])

  useEffect(() => {
    (async () => {
      const _collections = await collectionsService.getFeaturedCollections()
      setCollections(_collections.data)
    })()
  }, [])

  return (
    <div className={'flex items-center justify-center space-x-40 mt-8 overflow-auto p-8 -mx-8'}>
      {
        collections.map((collection, index) => {
          return (
            <FeaturedCard key={index} collection={collection} ethPrice={ethPrice} />
          )
        })
      }
    </div>
  )
}
