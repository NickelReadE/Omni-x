import { useEffect, useMemo, useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {useSwitchNetwork} from 'wagmi'
import { CHAIN_IDS, supportChainIDs } from '../utils/constants'
import useWallet from '../hooks/useWallet'
import { CHAIN_TYPE } from '../types/enum'

const MetaMaskConnect = (): JSX.Element => {
  const { chainId, address, provider } = useWallet()
  const [show, setShow] = useState<boolean>(true)
  const { openConnectModal } = useConnectModal()
  const {isLoading, pendingChainId, switchNetwork} = useSwitchNetwork()

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
          <div className="flex justify-center mt-12">
            <button
              onClick={() => switchNetwork?.(CHAIN_IDS[CHAIN_TYPE.GOERLI])}
              className="rounded-[10px] border border-l-30 bg-[#B444F9] text-white p-2 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
            >
              <div className="flex items-center justify-center font-semibold px-4 py-1 font-[32px]">
                {!isLoading && 'Switch network'}
                {isLoading && pendingChainId === CHAIN_IDS[CHAIN_TYPE.GOERLI] && 'Switching...'}
              </div>
            </button>
          </div>
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
