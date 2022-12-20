/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import HomeLogo from '../../../public/images/icons/home_logo.svg'
import ProcessingTransaction from '../../transaction/ProcessingTransaction'
import useProgress from '../../../hooks/useProgress'

export const TransactionTracker = () => {
  const { histories, pending, clearHistories } = useProgress()

  const onClear = () => {
    clearHistories()
  }

  return (
    <div className=''>
      <Menu as="div" className="relative flex items-center">
        <>
          <Menu.Button as="div" className={'focus:outline-none'}>
            <button className='flex items-center'>
              {
                pending
                  ?
                  <img src={'/images/icons/home_animated_logo.gif'} width={40} height={40} />
                  :
                  <HomeLogo />
              }
            </button>
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
            <div className={'absolute top-[50px] left-0 w-[252px] origin-top-left rounded-md bg-primary-gradient p-[1px]'}>
              <Menu.Items className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2 px-4">
                {
                  histories.length > 0 &&
                    <div className="overflow-y-auto overflow-x-hidden max-h-[280px]">
                      {histories.map((item, index) => {
                        return (
                          <Menu.Item key={index}>
                            <ProcessingTransaction txInfo={item}/>
                          </Menu.Item>
                        )
                      })}
                    </div>
                }
              </Menu.Items>
            </div>
          </Transition>
        </>
      </Menu>
    </div>
  )
}
