import {useEffect, useState} from 'react'
import Link from 'next/link'
import {TextBody, TextBodyemphasis, TextH2, TextH3} from '../common/Basic'
import {collectionsService} from '../../services/collections'
import {formatDollarAmount} from '../../utils/numbers'
import {TopCollection} from '../../types/collections'

const CollectionRow = ({ collection }: { collection: TopCollection }) => {
  return (
    <div className={'grid grid-cols-5 gap-x-12 h-[64px] flex items-center mt-4'}>
      <Link href={'/collections/' + collection.col_url}>
        <div className={'col-span-2 flex items-center space-x-4 cursor-pointer'}>
          <TextBody className={'text-secondary'}>{collection.rank}</TextBody>
          <div className={'bg-[#202020] rounded-[8px] w-full p-2 flex items-center space-x-3 top-collection-card'}>
            <img src={collection.profile_image} alt={'collection icon'} width={50} height={50} className={'rounded'} />
            <TextH3 className={'text-white'}>{collection.name}</TextH3>
          </div>
        </div>
      </Link>
      <TextBody className={'col-span-1 text-white text-center'}>{formatDollarAmount(Number(collection.total_volume))}</TextBody>
      <TextBody className={'col-span-1 text-transparent bg-primary-gradient bg-clip-text'}>{collection.change}%</TextBody>
      <TextBody className={'col-span-1 text-secondary text-center'}>{formatDollarAmount(collection.floor_price)}</TextBody>
    </div>
  )
}

const DAY_RANGES = [{
  day: 1,
  displayName: '24hr'
}, {
  day: 7,
  displayName: '7d'
}, {
  day: 30,
  displayName: '30d'
}, {
  day: 90,
  displayName: '90d'
}, {
  day: 365,
  displayName: '1yr'
}, {
  day: 0,
  displayName: 'all'
}]

export const HomeTopCollections = () => {
  const [collections, setCollections] = useState<TopCollection[]>([])
  const [dayRange, setDayRange] = useState(1)

  useEffect(() => {
    (async () => {
      const _collections = await collectionsService.getTopCollections(dayRange)
      setCollections(_collections.data.map((item: any, index: number) => {
        return {
          ...item,
          rank: index + 1,
        }
      }))
    })()
  }, [dayRange])

  return (
    <div className={'mt-12'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center space-x-8'}>
          <TextH2 className={'text-white'}>Top Collections</TextH2>
        </div>
        <div className={'bg-[#202020] rounded-[8px] h-[38px] flex items-center rounded-bar'}>
          {DAY_RANGES.map((item, idx) => (
            <div key={idx} className={`${dayRange === item.day ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(item.day)}>
              <TextBodyemphasis className={`${dayRange === item.day ? 'bg-clip-text text-transparent bg-primary-gradient' : ''}`}>{item.displayName}</TextBodyemphasis>
            </div>
          ))}
        </div>
      </div>

      <div className={'flex mt-6 space-x-[120px]'}>
        <div className={'flex-1'}>
          <div className={'grid grid-cols-5'}>
            <div className={'col-span-2'}></div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>volume</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>% change</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>floor</TextBodyemphasis>
            </div>
          </div>
          {
            collections.slice(0, (collections.length + 1) / 2).map((collection, index) => {
              return <CollectionRow key={index} collection={collection} />
            })
          }
        </div>
        <div className={'flex-1'}>
          <div className={'grid grid-cols-5'}>
            <div className={'col-span-2'}></div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>volume</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>% change</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-whit' +
                'e text-center'}>floor</TextBodyemphasis>
            </div>
          </div>
          {
            collections.slice((collections.length + 1) / 2).map((collection, index) => {
              return <CollectionRow key={index} collection={collection} />
            })
          }
        </div>
      </div>
    </div>
  )
}
