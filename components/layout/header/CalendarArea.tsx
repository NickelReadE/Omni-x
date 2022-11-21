import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import Image from 'next/image'
import {GradientButton} from '../../basic'

export const CalendarArea = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className='w-8 h-8'>
      <div className="relative inline-block text-left" onMouseLeave={() => setHovered(false)}>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <div className={'w-8 h-8 p-[1px] rounded-full'}>
            <Image
              src={hovered ? '/images/icons/calendar-active.svg' : '/images/icons/calendar.svg'}
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
          <div className={'absolute top-0 right-0 w-[300px] origin-top-right pt-10'}>
            <div className={'rounded-md bg-primary-gradient p-[1px]'}>
              <div
                className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none p-4">
                {/*Calendar title*/}
                <div className={'flex items-center'}>
                  <div className={'text-primary-light text-md'}>my calendar</div>
                  <Image src={'/images/icons/signout.svg'} alt={'signout icon'} width={18} height={18} />
                </div>

                {/*Calendar contents*/}
                <div className={'flex flex-col mt-4'}>
                  <span className={'text-primary-light text-md'}>Today</span>
                  <div className={'flex items-center text-md rounded-md mt-2 py-1 px-2 text-black bg-primary-light'}>
                    15:00 Kanpai Whitelist Mint
                  </div>
                  <div className={'flex items-center text-md rounded-md mt-2 py-1 px-2 text-black bg-fire-gradient'}>
                    18:00 - 23:00 NFT NYC Doodles Party
                  </div>
                </div>

                {/*Calendar footer*/}
                <div className={'flex items-center justify-center mt-4'}>
                  <div className={'w-[130px]'}>
                    <GradientButton title={'new event'} height={35} borderRadius={8} textSize={'text-md font-bold'} />
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
