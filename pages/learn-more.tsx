import React from 'react'
import type { NextPage } from 'next'
import LearnMoreIntro from '../components/learn-more/intro'
import LearnMoreInfrastructure from '../components/learn-more/infrastructure'
import LearnMoreSocial from '../components/learn-more/social'
import LearnMoreLaunchWithUs from '../components/learn-more/launchWithUs'

const LearnMore: NextPage = () => {

  return (
    <div className='px-[60px]'>
      <LearnMoreIntro />
      <LearnMoreInfrastructure />
      <LearnMoreSocial />
      <LearnMoreLaunchWithUs />
    </div>
  )
}

export default LearnMore
