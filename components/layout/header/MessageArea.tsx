import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import Image from 'next/image'

export const MessageArea = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className='w-8 h-8'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <div className={'w-8 h-8 p-[1px] rounded-full'}>
            <Image
              src={hovered ? '/images/icons/chat-active.svg' : '/images/icons/chat.svg'}
              alt="avatar"
              width={32}
              height={32}
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
            <div
              className={'rounded-md bg-primary-gradient p-[1px]'}>
              <div
                className="bg-[#202020e6] rounded-md divide-y shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2 px-4">
                <div>
                  <div className={'py-2 flex items-center cursor-pointer'}>
                    <img src={'/images/icons/default_pfp.png'} alt={'notification icon'}
                      className={'rounded-sm mr-4'} width={28} height={28}/>
                    <span className={'text-lg text-primary-light'}>exakoss<span
                      className={'text-secondary'}> followed you</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}
