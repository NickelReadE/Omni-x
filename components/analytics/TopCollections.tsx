import {useState} from 'react'
import {ChainSelection} from '../common/ChainSelection'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'

export const AnalyticsTopCollections = () => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS)

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
    <div className={'bg-[#202020] p-6 mt-[30px] rounded-lg'}>
      <div className={'text-primary-light font-medium text-md mb-4'}>
        Top Collections
      </div>
      <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId} removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds} />
      <div className={'mt-6'}>
      </div>
    </div>
  )
}