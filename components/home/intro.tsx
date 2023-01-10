import React from 'react'
import Router from 'next/router'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import {TextH1} from '../basic'

export default function HomeIntro () {
  return (
    <div className={'flex flex-col items-center justify-between px-[60px] md:px-[200px] py-8'}>
      <TextH1 className="bg-clip-text text-transparent bg-rainbow-gradient text-shadow-sm">connect through art</TextH1>
      <span className={'text-secondary text-xg1 text-shadow-sm'}>
      art for everyone, everywhere, all in one place
      </span>
      <div className={'mt-4'}>
        <PrimaryButton text={'learn more'} background={'bg-primary'} onClick={() => {
          Router.push('/learn-more')
        }} />
      </div>
    </div>
  )
}
