import { useEffect, useMemo, useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import SwitchButton from './SwitchButton'
import { CHAIN_IDS, supportChainIDs } from '../utils/constants'
import useWallet from '../hooks/useWallet'
import { CHAIN_TYPE } from '../types/enum'

const MetaMaskConnect = (): JSX.Element => {
  const { chainId, address, provider } = useWallet()
  const [show, setShow] = useState<boolean>(true)
  const { openConnectModal } = useConnectModal()

  const isSupportChain = useMemo(() => {
    if (chainId) {
      return supportChainIDs.includes(chainId)
    }
    return false
  }, [chainId])

  useEffect(() => {
    if (address && provider && chainId) {
      if (isSupportChain) {
        setShow(false)
      }
    } else setShow(true)
  }, [address, chainId, isSupportChain, provider])

  useEffect(() => {
    if (!address && openConnectModal) {
      openConnectModal()
    }
  }, [address, openConnectModal])

  const signSection = () => {
    if (!isSupportChain && address) {
      return (
        <div>
          <div>Current network is not supported <br></br> Please switch network into Goerli</div>
          <div className="flex justify-center mt-12"><SwitchButton chainID={CHAIN_IDS[CHAIN_TYPE.ARBITRUM]} /></div>
        </div>
      )
    }
  }

  return (
    <>
      {show && address && <div className="flex justify-center items-center w-screen h-screen bg-[#ffffff90] fixed z-[1]">
        <div
          className="flex flex-col justify-center border-4 border-[#1E1C21] p-20 rounded-[10px] bg-[#ffffff] text-[32px] font-bold">
          {signSection()}
        </div>
      </div>}
    </>
  )
}

export default MetaMaskConnect
