import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import useWallet from '../hooks/useWallet'
import MetaMaskConnect from '../components/layout/header/MetaMaskConnect'
import HomeCollections from '../components/home/collections'
import HomeIntro from '../components/home/intro'
import { supportChainIDs } from '../utils/constants'
import {HomeFeatured} from '../components/home/Featured'
import {HomeTopCollections} from '../components/home/TopCollections'

const Home: NextPage = () => {
  const {chainId, address} = useWallet()
  const [isBlur, setIsBlur] = useState<boolean>(false)

  useEffect(() => {
    if(address){
      setIsBlur(false)
    } else setIsBlur(true)
  }, [address])

  useEffect(()=>{
    if(chainId && supportChainIDs.includes(chainId)){
      setIsBlur(false)
    } else setIsBlur(true)
  },[chainId])

  return (
    <>
      {isBlur &&
        <MetaMaskConnect />
      }
      <HomeIntro />
      <HomeFeatured />
      <HomeTopCollections />
      <HomeCollections />
    </>
  )
}

export default Home
