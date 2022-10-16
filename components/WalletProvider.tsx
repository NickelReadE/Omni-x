/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState} from 'react'
import { Signer } from 'ethers'
import {supportChains} from '../utils/constants'
import { WalletContext } from '../contexts/wallet'
import {useAccount, useConnect, useDisconnect, useNetwork, useProvider, useSigner} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {ChainIds} from '../types/enum'

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const { address: addressWagmi } = useAccount()
  const providverWagmi = useProvider()
  // eslint-disable-next-line no-empty-pattern
  const {  } = useSigner({
    onSuccess: (data) => {
      if (data) {
        setSigner(data)
      }
    }
  })
  const { chain } = useNetwork()

  // const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [signer, setSigner] = useState<Signer>()

  const supportedChains = supportChains()
  const { connect: connectWithInjector } = useConnect({
    connector: new InjectedConnector({
      chains: supportedChains
    }),
  })
  const { disconnect: disconnectWithInjector } = useDisconnect()

  const address = useMemo(() => {
    return addressWagmi
  }, [addressWagmi])
  const provider = useMemo(() => {
    return providverWagmi
  }, [providverWagmi])
  const chainId = useMemo(() => {
    return chain?.id || ChainIds.ETHEREUM
  }, [chain])
  const chainName = useMemo(() => {
    return chain?.name || ''
  }, [chain])

  const resolveName = useCallback(
    async (name: string) => {
      if (cachedResolveName.has(name)) {
        return cachedResolveName.get(name)
      }
      const address = (await provider?.resolveName(name)) || undefined
      cachedResolveName.set(name, address)
      return address
    },
    [provider]
  )

  const lookupAddress = useCallback(
    async (address: string) => {
      if (cachedLookupAddress.has(address)) {
        return cachedLookupAddress.get(address)
      }
      const name = (await provider?.lookupAddress(address)) || undefined
      cachedLookupAddress.set(address, name)
      return name
    },
    [provider]
  )

  const disconnect = () => {
    disconnectWithInjector()
  }

  const connect = () => {
    connectWithInjector()
  }

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        chainName,
        resolveName,
        lookupAddress,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
