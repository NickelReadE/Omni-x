import React, {Fragment} from 'react'
import Image from 'next/image'
import {Menu, Transition} from '@headlessui/react'
import DropdownArrow from '../../../public/images/icons/dropdown_arrow.svg'

interface IPfpMenuPros {
  avatarImage: string
}

const menuItems = ['messages', 'events', 'settings', 'wallet']

export const PfpMenu = ({ avatarImage }: IPfpMenuPros) => {
  return (
    <div className='w-8 h-8'>
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <Menu.Button className={'focus:outline-none'}>
              <div className={`w-8 h-8 ${open ? 'bg-primary-gradient' : ''} p-[1px] rounded-full`}>
                <Image
                  src={avatarImage}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div
                className={'absolute right-0 w-56 origin-top-right rounded-md bg-primary-gradient p-[1px]'}>
                <Menu.Items
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
                        <Menu.Item key={index} as={Fragment}>
                          {({ active }) => (
                            <div className={`py-2 px-6 flex items-center cursor-pointer ${active ? 'bg-[#303030]' : ''}`}>
                              <img src={`/images/icons/${menu}${active ? '-active' : ''}.png`} alt={'menu icon'}/>
                              <span className={`text-${active ? 'primary-light' : 'secondary'} text-lg pl-4`}>{menu}</span>
                            </div>
                          )}
                        </Menu.Item>
                      )
                    })
                  }
                </Menu.Items>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
