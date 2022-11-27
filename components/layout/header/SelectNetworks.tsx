import React, {Fragment, useState} from 'react'
import {getChainLogoById, getChainOfficialNameById, SUPPORTED_CHAIN_IDS} from '../../../utils/constants'
import useWallet from '../../../hooks/useWallet'
import {Transition} from '@headlessui/react'
import {useSwitchNetwork} from 'wagmi'

export const SelectNetworks = () => {
  const { chainId } = useWallet()
  const { switchNetwork } = useSwitchNetwork()
  const [hovered, setHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  return (
    <div className='w-8 h-8'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <div className={`w-8 h-8 ${hovered ? 'bg-primary-gradient' : ''} p-[1px] rounded-full`}>
            <img alt={'networkIcon'} src={getChainLogoById(chainId ? chainId.toString() : '5')} className="h-full w-full" />
          </div>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          show={hovered}
        >
          <div className={'absolute right-0 w-[166px] origin-top-right pt-4'}>
            <div className={'rounded-md bg-primary-gradient p-[1px]'}>
              <div
                className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2">
                {
                  SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                    return (
                      <div key={index} onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}>
                        <div
                          className={`py-2 px-6 flex items-center cursor-pointer ${activeIndex === index ? 'bg-[#303030]' : ''}`}
                          onClick={() => switchNetwork?.(chainId)}>
                          <img alt={'chainIcon'} src={getChainLogoById(chainId.toString())}/>
                          <span
                            className={'text-primary-light text-lg pl-4'}>{getChainOfficialNameById(chainId)}</span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}
