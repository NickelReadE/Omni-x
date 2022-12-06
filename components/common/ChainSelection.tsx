import {Fragment, useMemo, useState} from 'react'
import {getDarkChainIconById, SUPPORTED_CHAIN_IDS} from '../../utils/constants'
import {ChainIds} from '../../types/enum'
import {Transition} from '@headlessui/react'

interface IChainSelectionProps {
    selectedChainIds: number[],
    addChainId: (chainId: number) => void,
    removeChainId: (chainId: number) => void,
    addAllChainIds: () => void,
}

export const ChainSelection = ({ selectedChainIds, addChainId, removeChainId, addAllChainIds }: IChainSelectionProps) => {
  const [isShow, setIsShow] = useState(false)
    
  const activeChainIds = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.filter((chainId) => !selectedChainIds.includes(chainId))
  }, [selectedChainIds])

  const removeFromList = (chainId: number) => {
    if (selectedChainIds.length > 1) {
      removeChainId(chainId)
    }
  }
  
  const DarkChainIcon = ({chainId, onClick}: {chainId: number, onClick: () => void}) => {
    return (
      <div
        className={'font-medium cursor-pointer m-[1px]'}
        onClick={onClick}
      >
        <img alt={'listing'}
          src={getDarkChainIconById(chainId.toString())}
          className="w-[28px] h-[28px] "/>
      </div>
    )
  }
    
  return (
    <>
      {
        <div className="flex flex-row justify-items-center" onMouseLeave={() => setIsShow(false)}>
          <div className={'flex items-center space-x-2'} onMouseEnter={() => setIsShow(true)}>
            {
              selectedChainIds.length !== SUPPORTED_CHAIN_IDS.length 
                ?
                selectedChainIds.map((chainId: number, index) => {
                  return (
                    <DarkChainIcon key={index} chainId={chainId} onClick={() => removeFromList(chainId)} />
                  )
                })
                :
                <span className={'text-primary-light text-md'}>all networks</span>
            }
          </div>
          <Transition 
            as={Fragment}
            enter="transition origin-left ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={isShow}
          >
            <div className={'flex items-center space-x-2 ml-2'}>
              <div className={'flex items-center'}>
                <div className={'h-full w-[2px] bg-primary-light h-[18px] rounded-sm'} />
              </div>
              {
                activeChainIds.length > 0 &&
                  <div className={'flex items-center font-medium cursor-pointer ml-[1px]'} onClick={addAllChainIds}>
                    <span className={'text-primary-light text-md'}>all</span>
                  </div>
              }
              {
                activeChainIds.length === 0
                  ?
                  SUPPORTED_CHAIN_IDS.map((chainId: ChainIds, index) => {
                    return (
                      <DarkChainIcon key={index} chainId={chainId} onClick={() => removeFromList(chainId)} />
                    )
                  })
                  :activeChainIds.map((chainId: ChainIds, index) => {
                    return (
                      <DarkChainIcon key={index} chainId={chainId} onClick={() => addChainId(chainId)} />
                    )
                  })
              }
            </div>
          </Transition>
        </div>
      }
    </>
  )
}