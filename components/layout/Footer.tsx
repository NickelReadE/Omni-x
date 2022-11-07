import React from 'react'
import PriceFeed from '../PriceFeed'

export default function Footer() {
  return (
    <div className={'h-[42px] fixed bottom-0 w-full z-50'}>
      <PriceFeed />
    </div>
  )
}
