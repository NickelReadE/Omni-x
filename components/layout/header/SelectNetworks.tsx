import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import {useSwitchNetwork} from 'wagmi'
import {getChainLogoById, getChainOfficialNameById, SUPPORTED_CHAIN_IDS} from '../../../utils/constants'
import useWallet from '../../../hooks/useWallet'
import {GradientBackground} from '../../basic'

export const SelectNetworks = () => {
  const { chainId } = useWallet()
  const { switchNetwork } = useSwitchNetwork()
  const [hovered, setHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  return (
    <div className='w-9 h-9'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <div className={`w-9 h-9 ${hovered ? 'bg-primary-gradient' : ''} rounded-full`}>
            <img alt={'networkIcon'} src={getChainLogoById(chainId ? chainId.toString() : '5')} width={36} height={36} />
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
          <div className={`absolute right-0 w-[166px] origin-top-right pt-4 ${hovered ? 'block' : 'hidden'}`}>
            <GradientBackground className="shadow-[0_0px_250px_rgba(0,0,0,1)]">
              {
                SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                  return (
                    <div key={index} onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}>
                      <div
                        className={`py-2 px-6 flex items-center cursor-pointer ${activeIndex === index ? 'bg-[#303030]' : ''}`}
                        onClick={() => switchNetwork?.(chainId)}>
                        <img alt={'chainIcon'} width={28} height={28} src={getChainLogoById(chainId.toString())}/>
                        <span
                          className={'text-primary-light text-lg pl-4'}>{getChainOfficialNameById(chainId)}</span>
                      </div>
                    </div>
                  )
                })
              }
            </GradientBackground>
          </div>
        </Transition>
      </div>
    </div>
  )
}
