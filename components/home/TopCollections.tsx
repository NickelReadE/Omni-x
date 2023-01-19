import {useEffect, useState} from 'react'
import {TextBody, TextBodyemphasis, TextH2, TextH3} from '../basic'
import {ChainSelection} from '../common/ChainSelection'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'
import {collectionsService} from '../../services/collections'
import {formatDollarAmount} from '../../utils/numbers'

type TopCollection = {
  rank: number,
  name: string,
  profile_image: string,
  total_volume: string,
  floor: number,
  change: number,
}

const CollectionRow = ({ collection }: { collection: TopCollection }) => {
  return (
    <div className={'grid grid-cols-5 gap-x-12 h-[64px] flex items-center mt-4'}>
      <div className={'col-span-2 flex items-center space-x-4'}>
        <TextBody className={'text-secondary'}>{collection.rank}</TextBody>
        <div className={'bg-[#202020] rounded-[8px] w-full p-2 flex items-center space-x-3'}>
          <img src={collection.profile_image} alt={'collection icon'} width={50} height={50} />
          <TextH3 className={'text-white'}>{collection.name}</TextH3>
        </div>
      </div>
      <TextBody className={'col-span-1 text-white text-center'}>{formatDollarAmount(Number(collection.total_volume))}</TextBody>
      <TextBody className={'col-span-1 text-transparent bg-primary-gradient bg-clip-text'}>{collection.change}%</TextBody>
      <TextBody className={'col-span-1 text-secondary text-center'}>{formatDollarAmount(collection.floor)}</TextBody>
    </div>
  )
}

export const HomeTopCollections = () => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([5])
  const [collections, setCollections] = useState<TopCollection[]>([])
  const [dayRange, setDayRange] = useState(1)

  useEffect(() => {
    (async () => {
      const _collections = await collectionsService.getTopCollections(selectedChainIds, dayRange)
      setCollections(_collections.data.map((item: any, index: number) => {
        return {
          ...item,
          rank: index + 1,
        }
      }))
    })()
  }, [selectedChainIds, dayRange])

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId])
  }

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS)
  }

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId))
  }

  return (
    <div className={'mt-12'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center space-x-8'}>
          <TextH2 className={'text-white'}>Top Collections</TextH2>
          <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId} removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds} setChainId={(chainId) => setSelectedChainIds([chainId])} />
        </div>
        <div className={'bg-[#202020] rounded-[8px] h-[38px] flex items-center'}>
          <div className={`${dayRange === 1 ? 'bg-[#303030]' : ''} flex rounded-tl-[8px] rounded-bl-[8px] items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(1)}>
            <TextBodyemphasis className={`${dayRange === 1 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>24hr</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 7 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(7)}>
            <TextBodyemphasis className={`${dayRange === 7 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>7d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 30 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(30)}>
            <TextBodyemphasis className={`${dayRange === 30 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>30d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 90 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(90)}>
            <TextBodyemphasis className={`${dayRange === 90 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>90d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 365 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(365)}>
            <TextBodyemphasis className={`${dayRange === 365 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>1yr</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 0 ? 'bg-[#303030]' : ''} flex items-center rounded-tr-[8px] rounded-br-[8px] justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(0)}>
            <TextBodyemphasis className={`${dayRange === 0 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>all</TextBodyemphasis>
          </div>
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
              <TextBodyemphasis className={'text-white text-center'}>%change</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-white text-center'}>floor</TextBodyemphasis>
            </div>
          </div>
          {
            collections.filter((item, index) => index % 2 === 0).map((collection, index) => {
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
              <TextBodyemphasis className={'text-white text-center'}>%change</TextBodyemphasis>
            </div>
            <div className={''}>
              <TextBodyemphasis className={'text-whit' +
                'e text-center'}>floor</TextBodyemphasis>
            </div>
          </div>
          {
            collections.filter((item, index) => index % 2 === 1).map((collection, index) => {
              return <CollectionRow key={index} collection={collection} />
            })
          }
        </div>
      </div>
    </div>
  )
}
