import React, {useState, useEffect} from 'react'
import type { NextPage } from 'next'
import useWallet from '../hooks/useWallet'
import MetaMaskConnect from '../components/layout/header/MetaMaskConnect'
import HomeSlider from '../components/home/slider'
import HomeCollections from '../components/home/collections'
import { supportChainIDs } from '../utils/constants'

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
      {/* <Tabs blur={isBlur} /> */}
      <HomeSlider />
      <HomeCollections />
    </>
  )
}

export default Home
