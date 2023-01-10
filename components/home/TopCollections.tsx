import {TextBodyemphasis, TextH2} from '../basic'
import {ChainSelection} from '../common/ChainSelection'
import {useState} from 'react'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'

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
          <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId} removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds} />
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
    </div>
  )
}