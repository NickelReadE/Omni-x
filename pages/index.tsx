import React from 'react'
import type { NextPage } from 'next'
import MetaMaskConnect from '../components/layout/header/MetaMaskConnect'
// import Tabs from '../components/Tabs'
import useWallet from '../hooks/useWallet'
import { supportChainIDs } from '../utils/constants'
import '@rainbow-me/rainbowkit/styles.css'
import HomeSlider from '../components/home/slider'
import HomeCollections from '../components/home/collections'

const Home: NextPage = () => {
  const {chainId, address} = useWallet()
  const [isBlur, setIsBlur] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(address){
      setIsBlur(false)
    } else setIsBlur(true)
  }, [address])

  React.useEffect(()=>{
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
