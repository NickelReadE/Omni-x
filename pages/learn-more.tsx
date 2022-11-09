import React from 'react'
import type { NextPage } from 'next'
import LearnMoreIntro from '../components/learn-more/intro'
import LearnMoreInfrastructure from '../components/learn-more/infrastructure'
import LearnMoreSocial from '../components/learn-more/social'

const LearnMore: NextPage = () => {

  return (
    <div className='px-[60px]'>
      <LearnMoreIntro />
      <LearnMoreInfrastructure />
      <LearnMoreSocial />
    </div>
  )
}

export default LearnMore
