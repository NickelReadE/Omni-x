/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {Fragment, useState} from 'react'
import {useRouter} from 'next/router'
import {Transition} from '@headlessui/react'
import HomeLogo from '../../../public/images/icons/home_logo.svg'
import ProcessingTransaction from '../../transaction/ProcessingTransaction'
import useProgress from '../../../hooks/useProgress'
import {GradientBackground} from '../../basic'

export const TransactionTracker = () => {
  const { histories, pending, clearHistories } = useProgress()
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const onClear = () => {
    clearHistories()
  }

  return (
    <div className="relative flex items-center" onMouseLeave={() => setHovered(false)}>
      <>
        <div className={'focus:outline-none'} onMouseEnter={() => setHovered(true)}>
          <button className='flex items-center' onClick={() => router.push('/')}>
            {
              pending
                ?
                <img src={'/images/icons/home_animated_logo.gif'} width={40} height={40} alt={'animated logo'} />
                :
                <HomeLogo />
            }
          </button>
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
          <div className={`absolute left-0 top-10 w-[250px] origin-bottom-left ${hovered ? 'block' : 'hidden'}`}>
            <GradientBackground className="shadow-[0_0px_250px_rgba(0,0,0,1)]">
              {
                histories.length > 0 &&
                  <div className="overflow-y-auto overflow-x-hidden max-h-[280px]">
                    {histories.map((item, index) => {
                      return (
                        <ProcessingTransaction key={index} txInfo={item}/>
                      )
                    })}
                  </div>
              }
            </GradientBackground>
          </div>
        </Transition>
      </>
    </div>
  )
}
