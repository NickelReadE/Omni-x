import React, {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import Image from 'next/image'

export const NotificationArea = () => {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div className='w-8 h-8'>
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <Menu.Button className={'focus:outline-none'}>
              <div className={'w-8 h-8 p-[1px] rounded-full'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <Image
                  src={open ? '/images/icons/notification-active.svg' : (hovered ? '/images/icons/notification-hover.svg' : '/images/icons/notification.svg')}
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
                className={'absolute right-0 w-[233px] origin-top-right rounded-md bg-primary-gradient p-[1px]'}>
                <Menu.Items
                  className="bg-[#202020e6] rounded-md divide-y shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2 px-4">
                  <Menu.Item as={Fragment}>
                    <div className={'py-2 flex items-center cursor-pointer'}>
                      <img src={'/images/icons/default_pfp.png'} alt={'notification icon'} className={'rounded-sm mr-4'} width={28} height={28}/>
                      <span className={'text-lg text-primary-light'}>exakoss<span className={'text-secondary'}> followed you</span></span>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
