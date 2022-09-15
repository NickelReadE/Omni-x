import React from 'react'
import type { NextPage } from 'next'
import MetaMaskConnect from '../components/MetaMaskConnect'
import Tabs from '../components/Tabs'
import useWallet from '../hooks/useWallet'
import { supportChainIDs } from '../utils/constants'

const Home: NextPage = () => {
  const context = useWallet()
  const [isBlur, setIsBlur] = React.useState<boolean>(false)

  React.useEffect(() => {
    if(context.address) {
      if(Number(context.provider?._network?.chainId)>0){
        if(supportChainIDs.includes(context.provider?._network?.chainId as number)){
          setIsBlur(false)
        }
      } else {
        window.location.reload()
      }
    } else setIsBlur(true)
  }, [context])

  return (
    <>
      {isBlur &&
        <MetaMaskConnect
          onConnect={async () => {
            context.connect()
          }}
          context={context}
        />
      }
      <Tabs blur={isBlur} />
    </>
  )
}

export default Home
