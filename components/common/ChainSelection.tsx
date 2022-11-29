import {Fragment, useMemo, useState} from 'react'
import {getDarkChainIconById, SUPPORTED_CHAIN_IDS} from '../../utils/constants'
import {ChainIds} from '../../types/enum'
import {Transition} from '@headlessui/react'

interface IChainSelectionProps {
    selectedChainIds: number[],
    addChainId: (chainId: number) => void,
    removeChainId: (chainId: number) => void,
}

export const ChainSelection = ({ selectedChainIds, addChainId, removeChainId }: IChainSelectionProps) => {
  const [isShow, setIsShow] = useState(false)
    
  const activeChainIds = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.filter((chainId) => !selectedChainIds.includes(chainId))
  }, [selectedChainIds])

  const allNetworks = useMemo(() => {
    return selectedChainIds.length === SUPPORTED_CHAIN_IDS.length
  }, [selectedChainIds])
    
  return (
    <>
      {
        allNetworks ?
          <div className={'font-medium m-[1px]'}>
            <span className={'text-primary-light text-md'}>all networks</span>
          </div>
          :
          <div className="flex flex-row justify-items-center" onMouseLeave={() => setIsShow(false)}>
            <div className={'flex items-center space-x-2'} onMouseEnter={() => setIsShow(true)}>
              {
                selectedChainIds.length > 0 && selectedChainIds.map((chainId: number, index) => {
                  return (
                    <div key={index} className={'font-medium cursor-pointer m-[1px]'} onClick={() => removeChainId(chainId)}>
                      <img alt={'listing'}
                        src={getDarkChainIconById(chainId.toString())}
                        className="w-[28px] h-[28px] "/>
                    </div>
                  )
                })
              }
              {
                selectedChainIds.length === 0 &&
                    <div className={'font-medium m-[1px]'}>
                      <span className={'text-primary-light text-md'}>all networks</span>
                    </div>
              }
            </div>
            <Transition 
              as={Fragment}
              enter="transition origin-left ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              show={isShow}
            >
              <div className={'flex items-center space-x-2 ml-2'}>
                <div className={'flex items-center'}>
                  <div className={'h-full w-[2px] bg-primary-light h-[18px] rounded-sm'} />
                </div>
                <div className={'flex items-center font-medium cursor-pointer ml-[1px]'}>
                  <span className={'text-primary-light text-md'}>all</span>
                </div>
                {
                  activeChainIds.map((networkId: ChainIds, index) => {
                    return (
                      <div
                        key={index}
                        className={'font-medium cursor-pointer m-[1px]'}
                        onClick={() => addChainId(networkId)}
                      >
                        <img alt={'listing'}
                          src={getDarkChainIconById(networkId.toString())}
                          className="w-[28px] h-[28px] "/>
                      </div>
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