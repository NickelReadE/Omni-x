import React from 'react'
import type { NextPage } from 'next'
import MetaMaskConnect from '../components/MetaMaskConnect'
import Tabs from '../components/Tabs'
import useWallet from '../hooks/useWallet'
import { supportChainIDs } from '../utils/constants'
import '@rainbow-me/rainbowkit/styles.css'

const Home: NextPage = () => {
  const {chainId, address} = useWallet()
  const [isBlur, setIsBlur] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(address){
      setIsBlur(false)
    } else setIsBlur(true)
  }, [address])

  React.useEffect(()=>{
    if(Number(chainId)>0){
      if(supportChainIDs.includes(chainId as number)){
        setIsBlur(false)
      } else setIsBlur(true)
    }
  },[chainId])

  return (
    <>
      {isBlur &&
        <MetaMaskConnect />
      }
      <Tabs blur={isBlur} />
    </>
  )
}

export default Home
