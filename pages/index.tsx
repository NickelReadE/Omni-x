import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import HomeCollections from '../components/home/Collections'
import HomeIntro from '../components/home/Intro'
import {HomeFeatured} from '../components/home/Featured'
import {HomeTopCollections} from '../components/home/TopCollections'
import {getETHPrice} from '../utils/helpers'

const Home: NextPage = () => {
  const [ethPrice, setEthPrice] = useState<number>(0)

  useEffect(() => {
    (async () => {
      const ethPrice = await getETHPrice()
      setEthPrice(ethPrice)
    })()
  }, [])

  return (
    <>
      <HomeIntro />
      <HomeFeatured ethPrice={ethPrice} />
      <HomeTopCollections ethPrice={ethPrice} />
      <HomeCollections ethPrice={ethPrice} />
    </>
  )
}

export default Home
