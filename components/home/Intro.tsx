import React from 'react'
import Router from 'next/router'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import {TextH1, TextSH2} from '../common/Basic'

export default function HomeIntro () {
  return (
    <div className={'flex flex-col items-center justify-between px-[60px] md:px-[200px] py-8'}>
      <TextH1 className="bg-clip-text text-transparent bg-rainbow-gradient text-shadow-sm">connect through art</TextH1>
      <TextSH2 className={'text-secondary text-shadow-sm'}>
        art for everyone, everywhere, all in one place
      </TextSH2>
      <div className={'mt-4'}>
        <PrimaryButton text={'learn more'} background={'bg-primary'} onClick={() => {
          Router.push('/learn-more')
        }} />
      </div>
    </div>
  )
}
