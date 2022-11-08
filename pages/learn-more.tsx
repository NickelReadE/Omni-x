import React from 'react'
import type { NextPage } from 'next'
import LearnMoreIntro from '../components/learn-more/intro'
import LearnMoreInfrastructure from '../components/learn-more/infrastructure'

const LearnMore: NextPage = () => {

  return (
    <div className='px-[60px]'>
      <LearnMoreIntro />
      <LearnMoreInfrastructure />
    </div>
  )
}

export default LearnMore
