import React, {Fragment, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {Transition} from '@headlessui/react'
import useWallet from '../../../hooks/useWallet'
import DropdownArrow from '../../../public/images/icons/dropdown_arrow.svg'

interface IPfpMenuPros {
  avatarImage: string
}

const menuItems = ['messages', 'events', 'settings', 'wallet']

export const PfpMenu = ({ avatarImage }: IPfpMenuPros) => {
  const { address } = useWallet()
  const [hovered, setHovered] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
    
  return (
    <div className='w-8 h-8'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <Link href={`/user/${address}`}>
            <div className={`w-8 h-8 ${hovered ? 'bg-primary-gradient' : ''} p-[1px] rounded-full`}>
              <Image
                src={avatarImage}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
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
            <div className={'rounded-md bg-primary-gradient p-[1px]'}>
              <div
                className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2">
                {/*Wallet Balance Section*/}
                <div className={'p-4'}>
                  <div className={'flex items-center pb-3'}>
                    <span className={'flex-none text-secondary w-10'}>USD</span>
                    <span className={'grow px-3 text-primary-light'}>$32,435.34</span>
                    <span className={'flex-none w-6'}><DropdownArrow/></span>
                  </div>
                  <div className={'flex items-center'}>
                    <span className={'flex-none text-secondary w-10'}>AVAX</span>
                    <span className={'grow px-3 text-primary-light'}>24.5</span>
                    <span className={'flex-none w-6'}/>
                  </div>
                </div>
                {/*Menu Items for user*/}
                {
                  menuItems.map((menu, index) => {
                    return (
                      <div key={index} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(undefined)}>
                        <div className={`py-2 px-6 flex items-center cursor-pointer ${activeIndex === index ? 'bg-[#303030]' : ''}`}>
                          <img src={`/images/icons/${menu}${activeIndex === index ? '-active' : ''}.png`} alt={'menu icon'}/>
                          <span className={`text-${activeIndex === index ? 'primary-light' : 'secondary'} text-lg pl-4`}>{menu}</span>
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
