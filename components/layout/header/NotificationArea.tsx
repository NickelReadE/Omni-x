import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import Image from 'next/image'
import {GradientBackground} from '../../common/Basic'

export const NotificationArea = () => {
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)

  return (
    <div className='w-11 h-11'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <div className={'w-11 h-11 rounded-full'} onMouseEnter={() => setIconHovered(true)} onMouseLeave={() => setIconHovered(false)}>
            <Image
              src={hovered ? '/images/icons/notification-active.svg' : (iconHovered ? '/images/icons/notification-hover.svg' : '/images/icons/notification.svg')}
              alt="avatar"
              width={44}
              height={44}
              className="rounded-full"
            />
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
          <div className={'absolute right-0 w-[233px] origin-top-right pt-4'}>
            <GradientBackground className="shadow-[0_0px_250px_rgba(0,0,0,1)]">
              <div>
                <div className={'px-4 py-2 flex items-center cursor-pointer'}>
                  <img src={'/images/icons/default_pfp.png'} alt={'notification icon'}
                    className={'rounded-sm mr-4'} width={28} height={28}/>
                  <span className={'text-lg text-primary-light'}>exakoss<span
                    className={'text-secondary'}> followed you</span></span>
                </div>
              </div>
            </GradientBackground>
          </div>
        </Transition>
      </div>
    </div>
  )
}
