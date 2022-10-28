import React, { useEffect, useState } from 'react'
import { useSwitchNetwork } from 'wagmi'
import { SwitchedNetworkContext } from '../contexts/network'
import useWallet from '../hooks/useWallet'

type SwitchedNetworkProviderProps = {
  children?: React.ReactNode
}

export const SwitchedNetworkProvider = ({
  children
}: SwitchedNetworkProviderProps) => {
  const [switched, setSwitched] = useState(0)
  const { isLoading, pendingChainId, switchNetworkAsync } = useSwitchNetwork()
  const { chainId } = useWallet()

  useEffect(() => {
    if (!isLoading && pendingChainId && chainId) {
      if (pendingChainId == chainId) {
        setSwitched(s => s + 1)
      }
    }
  }, [isLoading, pendingChainId, chainId])

  return (
    <SwitchedNetworkContext.Provider value={{switched, switchNetworkAsync}}>
      {children}
    </SwitchedNetworkContext.Provider>
  )
}
