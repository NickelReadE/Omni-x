import {TextBody, TextBodyemphasis, TextH2, TextH3} from '../basic'
import {ChainSelection} from '../common/ChainSelection'
import {useState} from 'react'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'

const CollectionRow = () => {
  return (
    <div className={'grid grid-cols-5 gap-x-12 h-[64px] flex items-center mt-4'}>
      <div className={'col-span-2 flex items-center space-x-4'}>
        <TextBody className={'text-secondary'}>1</TextBody>
        <div className={'bg-[#202020] rounded-[8px] w-full p-2 flex items-center space-x-3'}>
          <img src={'/images/home/collectionIcon.png'} alt={'collection icon'} />
          <TextH3 className={'text-white'}>Kanpai Pandas</TextH3>
        </div>
      </div>
      <TextBody className={'col-span-1 text-white text-center'}>$26,545</TextBody>
      <TextBody className={'col-span-1 text-transparent bg-primary-gradient bg-clip-text'}>30%</TextBody>
      <TextBody className={'col-span-1 text-secondary text-center'}>$1250</TextBody>
    </div>
  )
}

export const HomeTopCollections = () => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>([5])

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
          <div className={'flex bg-[#303030] rounded-tl-[8px] rounded-bl-[8px] items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'bg-clip-text text-transparent bg-primary-gradient'}>24hr</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>7d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>30d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>90d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>1yr</TextBodyemphasis>
          </div>
          <div className={'flex items-center rounded-tr-[8px] rounded-br-[8px] justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>all</TextBodyemphasis>
          </div>
        </div>
      </div>

      <div className={'flex items-center mt-6 space-x-[120px]'}>
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
          <CollectionRow />
          <CollectionRow />
          <CollectionRow />
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
              <TextBodyemphasis className={'text-white text-center'}>floor</TextBodyemphasis>
            </div>
          </div>
          <CollectionRow />
          <CollectionRow />
          <CollectionRow />
        </div>
      </div>
    </div>
  )
}
