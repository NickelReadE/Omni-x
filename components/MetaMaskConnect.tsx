import React from 'react'
import ConnectButton from './ConnectButton'
import SwitchButton from './SwitchButton'
import {supportChainIDs} from '../utils/constants'
import useWallet from '../hooks/useWallet'

const MetaMaskConnect = (): JSX.Element => {
  const { chainId, address, provider } = useWallet()
  const [show, setShow] = React.useState<boolean>(true)

  const isSupportChain = React.useMemo(() => {
    return supportChainIDs.includes(chainId)
  }, [chainId])

  React.useEffect(() => {
    if (address && provider && chainId) {
      if (isSupportChain) {
        setShow(false)
      }
    } else setShow(true)
  }, [address, chainId, isSupportChain, provider])

  const signSection = () => {
    if (!address) {
      return (
        <div>
          <div>Please sign-in by connecting your wallet</div>
          <div className="flex justify-center mt-12">
            <ConnectButton />
          </div>
        </div>
      )
    } else if (!isSupportChain && address) {
      return (
        <div>
          <div>Current network is not supported <br></br> Please switch network into Goerli</div>
          <div className="flex justify-center mt-12"><SwitchButton chainID={5}/></div>
        </div>
      )
    }
  }

  return (
    <>
      {show && <div className="flex justify-center items-center w-screen h-screen bg-[#ffffff90] fixed z-[1]">
        <div
          className="flex flex-col justify-center border-4 border-[#1E1C21] p-20 rounded-[10px] bg-[#ffffff] text-[32px] font-bold">
          {signSection()}
        </div>
      </div>}
    </>
  )
}

export default MetaMaskConnect
