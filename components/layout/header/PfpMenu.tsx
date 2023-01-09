import React, {Fragment, useState} from 'react'
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import {Transition} from '@headlessui/react'
import useWallet from '../../../hooks/useWallet'
import DropdownArrow from '../../../public/images/icons/dropdown_arrow.svg'
import DropdownArrowUp from '../../../public/images/icons/dropdown_arrow_up.svg'
import {getChainInfo, getChainLogoById, numberLocalize} from '../../../utils/constants'
import {useBalance} from 'wagmi'
import useData from '../../../hooks/useData'
import {GradientBackground, Tooltip} from '../../basic'

interface IPfpMenuPros {
  avatarImage: string
}

const menuItems = ['messages', 'events', 'settings', 'wallet']

export const PfpMenu = ({ avatarImage }: IPfpMenuPros) => {
  const { address, chainId } = useWallet()
  const { totalUSDCBalance, totalUSDTBalance, usdcAvailableChainIds, usdtAvailableChainIds } = useData()
  const { data: nativeBalance } = useBalance({
    addressOrName: address
  })
  const [hovered, setHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  return (
    <div className='w-11 h-11'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <Link href={'/account'}>
            <div className={`w-11 h-11 ${hovered ? 'bg-primary-gradient' : ''} rounded-full cursor-pointer`}>
              <img
                src={avatarImage}
                alt="avatar"
                className="w-full h-full rounded-full"
              />
            </div>
          </Link>
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
          <div className={'absolute right-0 w-56 origin-top-right pt-4'}>
            <GradientBackground className="shadow-[0_0px_250px_rgba(0,0,0,1)] py-2">
              {/*Wallet Balance Section*/}
              <div className={'p-4'}>
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={`flex items-center w-full ${open ? '' : 'pb-3'}`}>
                        <span className={'flex-none text-left text-secondary w-14 italic font-bold'}>USD</span>
                        <span className={'grow text-left px-3 text-primary-light'}>${numberLocalize(totalUSDCBalance + totalUSDTBalance)}</span>
                        <span className={'flex-none w-6'}>
                          {
                            open ?
                              <DropdownArrowUp />
                              :
                              <DropdownArrow/>
                          }
                        </span>
                      </Disclosure.Button>
                      <Disclosure.Panel className="flex flex-col w-full py-2">
                        <div className={'flex w-full items-center'}>
                          <span className={'flex-none text-left text-[14px] text-secondary w-14 italic font-bold'}>USDC</span>
                          <span className={'grow text-left px-3 text-primary-light'}>${numberLocalize(totalUSDCBalance)}</span>
                          <span className={'flex-none w-6'} />
                        </div>
                        <div className={'flex w-full pb-2'}>
                          {
                            usdcAvailableChainIds.map((balance, index: number) => {
                              return (
                                <Tooltip tooltipContent={`${balance.balance.toLocaleString()} USDC`} key={index}>
                                  <img src={getChainLogoById(balance.chainId.toString())} className={'w-[18px] h-[18px] mr-1'} alt={'chainIcon'} />
                                </Tooltip>
                              )
                            })
                          }
                        </div>
                        <div className={'flex w-full items-center'}>
                          <span className={'flex-none text-left text-[14px] text-secondary w-14 italic font-bold'}>USDT</span>
                          <span className={'grow text-left px-3 text-primary-light'}>${numberLocalize(totalUSDTBalance)}</span>
                          <span className={'flex-none w-6'} />
                        </div>
                        <div className={'flex w-full pb-2'}>
                          {
                            usdtAvailableChainIds.map((balance, index: number) => {
                              return (
                                <Tooltip tooltipContent={`${balance.balance.toLocaleString()} USDT`} key={index}>
                                  <img src={getChainLogoById(balance.chainId.toString())} className={'w-[18px] h-[18px]'} alt={'chainIcon'} />
                                </Tooltip>
                              )
                            })
                          }
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <div className={'flex items-center'}>
                  <span className={'flex-none text-secondary w-14 italic font-bold'}>{getChainInfo(chainId)?.nativeCurrency.symbol}</span>
                  <span className={'grow px-3 text-primary-light'}>{numberLocalize(parseFloat(nativeBalance?.formatted || '0'))}</span>
                  <span className={'flex-none w-6'}/>
                </div>
              </div>
              {/*Menu Items for user*/}
              {
                menuItems.map((menu, index) => {
                  return (
                    <div key={index} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(undefined)}>
                      <div className={`py-2 px-6 flex items-center cursor-pointer ${activeIndex === index ? 'bg-[#303030]' : ''}`}>
                        <img src={`/images/icons/${menu}${activeIndex === index ? '-active' : ''}.svg`} alt={'menu icon'}/>
                        <span className={`text-${activeIndex === index ? 'primary-light' : 'secondary'} text-lg pl-4`}>{menu}</span>
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
