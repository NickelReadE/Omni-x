import React, {Fragment, useState} from 'react'
import {Transition} from '@headlessui/react'
import useMessage from '../../hooks/useMessage'

export const MessageBar = () => {
  const [, setQuery] = useState('')

  const { opened, activeRoomId, openMessage, closeMessage } = useMessage()

  const debounce = (func: any, wait: any) => {
    let timerId: any
    return (...args: any) => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        func(...args)
      }, wait)
    }
  }

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 translate-x-8"
      enterTo="transform opacity-100 translate-x-0"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 translate-x-0"
      leaveTo="transform opacity-0 translate-x-8"
      show={opened}
    >
      <div className={`fixed right-0 top-[64px] bottom-[40px] w-[312px] bg-primary z-50 ${opened ? 'block' : 'hidden'}`} style={{height: 'calc(100vh - 104px)'}}>
        <div className={'flex flex-col p-4'}>
          <div className={'bg-[#202020] rounded-[30px] h-[40px] w-full flex items-center py-2 px-6'}>
            <div className={'w-6 h-6'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.4438 16.4434L21.0001 20.9996" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              autoFocus
              type="text"
              placeholder='search'
              className="flex items-center text-white bg-transparent w-full lg:w-[250px] h-[40px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0"
              onChange={debounce((e: any) => {
                setQuery(e.target.value)
              }, 500)}
            />
          </div>
        </div>

        <div className={`flex flex-col divide-y-[1px] divide-[#303030] border-b-[1px] border-t-[1px] border-[#303030] ${activeRoomId === '' ? 'block' : 'hidden'}`}>
          <div className={'flex items-center py-[10px] px-[13px] cursor-pointer'} onClick={() => openMessage('1')}>
            <div className={'w-9 h-9'}>
              <img src={'/images/default_user.png'} alt={'default user'} />
            </div>
            <div className={'flex flex-col w-full ml-[15px] w-[235px]'}>
              <span className={'text-primary-light text-[14px] leading-[18px]'}>randomuser</span>
              <span className={'text-secondary text-[12px] leading-[15px] truncate'}>hey friend, i am super interested in participating omnix</span>
            </div>
          </div>
          <div className={'flex items-center py-[10px] px-[13px] cursor-pointer'} onClick={() => openMessage('1')}>
            <div className={'w-9 h-9'}>
              <img src={'/images/default_user.png'} alt={'default user'} />
            </div>
            <div className={'flex flex-col w-full ml-[15px] w-[235px]'}>
              <span className={'text-primary-light text-[14px] leading-[18px]'}>randomuser</span>
              <span className={'text-secondary text-[12px] leading-[15px] truncate'}>hey friend, i am super interested in participating omnix</span>
            </div>
          </div>
          <div className={'flex items-center py-[10px] px-[13px] cursor-pointer'} onClick={() => openMessage('1')}>
            <div className={'w-9 h-9'}>
              <img src={'/images/default_user.png'} alt={'default user'} />
            </div>
            <div className={'flex flex-col w-full ml-[15px] w-[235px]'}>
              <span className={'text-primary-light text-[14px] leading-[18px]'}>randomuser</span>
              <span className={'text-secondary text-[12px] leading-[15px] truncate'}>hey friend, i am super interested in participating omnix</span>
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-400"
          enterFrom="transform opacity-0 translate-x-8"
          enterTo="transform opacity-100 translate-x-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-x-0"
          leaveTo="transform opacity-0 translate-x-8"
          show={activeRoomId !== ''}
        >
          <div className={`${activeRoomId === '' ? 'hidden' : 'block'} flex flex-col justify-between`} style={{height: 'calc(100vh - 177px)'}}>
            <div className={'flex items-center py-[10px] px-[13px]'}>
              <div className={'w-8 h-8 flex items-center justify-center cursor-pointer'} onClick={closeMessage}>
                <img src={'/images/icons/arrow_left.svg'} alt={'arrow left'} />
              </div>
              <div className={'w-9 h-9 flex items-center justify-center ml-4'}>
                <img src={'/images/default_user.png'} width={36} height={36} alt={'default user'} className={'w-full h-full'} />
              </div>
              <div className={'flex flex-col ml-[15px]'}>
                <span className={'text-[16px] leading-[20px] text-white'}>randomuser</span>
              </div>
            </div>

            {/*Message contents*/}
            <div className={'pb-4 px-4'}>
              <div className={'flex flex-col space-y-3'}>
                <div className={'flex justify-start'}>
                  <div className={'bg-primary-gradient rounded-[30px] py-2 px-4'}>
                    yo whats good my dude
                  </div>
                </div>
                <div className={'flex justify-end'}>
                  <div className={'bg-secondary rounded-[30px] py-2 px-4'}>
                    not much, makin art
                  </div>
                </div>
              </div>
              <div className={'flex bg-[#202020] rounded-[30px] mt-3 py-2 px-6 h-[40px] w-full items-center'}>
                <input
                  type="text"
                  placeholder='...'
                  className="flex items-center text-white bg-transparent w-full lg:w-[250px] h-[40px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0"
                  onChange={debounce((e: any) => {
                    setQuery(e.target.value)
                  }, 500)}
                />
                <div className={'cursor-pointer'}>
                  <img src={'/images/icons/message_send.svg'} alt={'message send'} />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  )
}
