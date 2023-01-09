import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import {useSwitchNetwork} from 'wagmi'
import {getChainLogoById, getChainOfficialNameById, SUPPORTED_CHAIN_IDS} from '../../../utils/constants'
import useWallet from '../../../hooks/useWallet'
import {GradientBackground, TextBodyemphasis} from '../../basic'

export const SelectNetworks = () => {
  const { chainId } = useWallet()
  const { switchNetwork } = useSwitchNetwork()
  const [hovered, setHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  return (
    <div className={'h-11'}>
      <div className={`relative inline-block text-left h-11 py-2 px-2 rounded-[8px] ${hovered ? 'bg-[#303030]' : 'bg-[#202020]'}`} onMouseLeave={() => setHovered(false)}>
        {
          chainId &&
            <div className={'focus:outline-none w-full h-full'} onMouseEnter={() => setHovered(true)}>
              <div className={'flex items-center space-x-2'}>
                <img alt={'networkIcon'} src={getChainLogoById(chainId.toString())} width={28} height={28} />
                <TextBodyemphasis className={'text-secondary'}>{getChainOfficialNameById(chainId)}</TextBodyemphasis>
              </div>
            </div>
        }
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
          <div className={`absolute top-0 left-0 origin-top-left ${hovered ? 'block' : 'hidden'}`}>
            <GradientBackground className="shadow-[0_0px_250px_rgba(0,0,0,1)] p-[1px]">
              <div className={'rounded-[8px] bg-[#202020]'}>
                {
                  SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                    return (
                      <div
                        key={index}
                        className={`p-2 flex items-center space-x-2 cursor-pointer ${activeIndex === index ? 'bg-[#303030]' : ''}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(undefined)}
                        onClick={() => switchNetwork?.(chainId)}
                      >
                        <img alt={'chainIcon'} width={28} height={28} src={getChainLogoById(chainId.toString())}/>
                        <TextBodyemphasis className={'text-secondary'}>{getChainOfficialNameById(chainId)}</TextBodyemphasis>
                      </div>
                    )
                  })
                }
              </div>
            </GradientBackground>
          </div>
        </Transition>
      </div>
    </div>
  )
}
