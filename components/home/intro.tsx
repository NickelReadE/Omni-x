import React from 'react'
import Link from 'next/link'

export default function HomeIntro () {
  return (
    <div className={'bg-dark-gradient border-1 border-[#383838] rounded-[20px] backdrop-blur shadow-[0_0_30px_rgba(255,255,255,0.06)] w-[1000px] flex flex-col items-center justify-between py-6'}>
      <span className="bg-clip-text text-center text-transparent bg-rainbow-gradient text-extraxl font-bold shadow-[0_4_6px_rgba(0,0,0,0.25)]">connect through art</span>
      <span className={'text-secondary text-xg1'}>
            art for everyone, everywhere, all in one place
      </span>
      <div className={'flex justify-between items-center h-[135px] space-x-[100px]'}>
        <div className={'flex flex-col items-center'}>
          <img src={'/images/home/rocket.svg'} alt={'rocket'} className={'w-20 h-20'} />
          <span className={'text-primary-light text-xl'}>
                  curated content
          </span>
        </div>
        <div className={'flex flex-col items-center'}>
          <img src={'/images/home/interoperability.svg'} alt={'interoperability'} className={'w-[200px] h-20'} />
          <span className={'text-primary-light text-xl'}>
                  omnichain interoperability
          </span>
        </div>
        <div className={'flex flex-col items-center justify-between'}>
          <div className={'flex items-center justify-between h-[80px]'}>
            <img src={'/images/home/heart.svg'} alt={'heart'} className={'w-[55px] h-[55px]'} />
            <img src={'/images/home/message.svg'} alt={'message'} className={'w-[55px] h-[55px]'} />
            <img src={'/images/home/exchange.svg'} alt={'exchange'} className={'w-[55px] h-[55px]'} />
          </div>
          <span className={'text-primary-light text-xl'}>
              web3 social<span className={'text-secondary'}>&nbsp;(soon)</span>
          </span>
        </div>
      </div>
      <Link href={'/learn-more'} className={'mt-4'}>
        <button className='px-[16px] py-[4px] bg-border-gradient rounded-full flex items-center justify-center border-[1px] border-solid border-transparent' style={{backgroundOrigin: 'padding-box, border-box', backgroundClip: 'padding-box, border-box'}}>
          <span className='bg-primary-gradient bg-clip-text text-transparent'>learn more</span>
        </button>
      </Link>
    </div>
  )
}