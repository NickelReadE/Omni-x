import React from 'react'
import Link from 'next/link'
import {PrimaryButton} from '../common/buttons/PrimaryButton'

export default function HomeIntro () {
  return (
    <div className={'bg-dark-gradient border-[1px] border-[#383838] rounded-[20px] backdrop-blur-[15px] shadow-[0_0_30px_rgba(255,255,255,0.06)] flex flex-col items-center justify-between aspect-[3/1] py-6'}>
      <span className="bg-clip-text text-center text-transparent bg-rainbow-gradient text-extraxl font-bold text-shadow-sm">connect through art</span>
      <span className={'text-secondary text-xg1 text-shadow-sm'}>
        art for everyone, everywhere, all in one place
      </span>
      <div className={'flex justify-between items-center h-[135px] space-x-[100px]'}>
        <div className={'flex flex-col items-center'}>
          <img src={'/images/home/rocket.svg'} alt={'rocket'} className={'w-20 h-20'} />
          <span className={'text-primary-light text-xl text-shadow-sm2'}>
                  curated content
          </span>
        </div>
        <div className={'flex flex-col items-center'}>
          <img src={'/images/home/interoperability.svg'} alt={'interoperability'} className={'w-[200px] h-20'} />
          <span className={'text-primary-light text-xl text-shadow-sm2'}>
            omnichain interoperability
          </span>
        </div>
        <div className={'flex flex-col items-center justify-between'}>
          <div className={'flex items-center justify-between h-[80px]'}>
            <div className={'flex items-center justify-center w-[55px] h-[55px]'}>
              <img src={'/images/home/heart.svg'} alt={'heart'} className={'w-6 h-6'} />
            </div>
            <div className={'flex items-center justify-center w-[55px] h-[55px]'}>
              <img src={'/images/home/message.svg'} alt={'message'} className={'w-6 h-6'} />
            </div>
            <div className={'flex items-center justify-center w-[55px] h-[55px]'}>
              <img src={'/images/home/exchange.svg'} alt={'exchange'} className={'w-6 h-6'} />
            </div>
          </div>
          <span className={'text-primary-light text-xl text-shadow-sm2'}>
            web3 social<span className={'text-secondary'}>&nbsp;(soon)</span>
          </span>
        </div>
      </div>
      <Link href={'/learn-more'} className={'mt-4'}>
        <PrimaryButton text={'learn more'} background={'bg-[#242424]'} />
      </Link>
    </div>
  )
}
