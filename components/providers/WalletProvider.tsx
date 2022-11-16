/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo} from 'react'
import {ethers, Signer} from 'ethers'
import {supportChains} from '../../utils/constants'
import { WalletContext } from '../../contexts/wallet'
import {useAccount, useConnect, useDisconnect, useNetwork, useProvider, useSigner} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const cachedLookupAddress = new Map<string, string | undefined>()
const cachedResolveName = new Map<string, string | undefined>()

type WalletProviderProps = {
  children?: React.ReactNode
}

export const WalletProvider = ({
  children,
}: WalletProviderProps): JSX.Element => {
  const { address: addressWagmi } = useAccount()
  const { data: signerWagmi } = useSigner()
  const { chain } = useNetwork()

  const supportedChains = supportChains()
  const { connect: connectWithInjector } = useConnect({
    connector: new InjectedConnector({
      chains: supportedChains
    }),
    onSuccess: () => {
      localStorage.setItem('isWalletConnected', 'true')
    }
  })
  const { disconnect: disconnectWithInjector } = useDisconnect({
    onSuccess: () => {
      localStorage.setItem('isWalletConnected', 'false')
    }
  })

  const address = useMemo(() => {
    return addressWagmi
  }, [addressWagmi])
  const chainId = useMemo(() => {
    return chain?.id
  }, [chain])
  const chainName = useMemo(() => {
    return chain?.name
  }, [chain])
  const providverWagmi = useProvider({
    chainId: chainId
  })
  const provider = useMemo(() => {
    return providverWagmi as ethers.providers.JsonRpcProvider
  }, [providverWagmi])

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   setSigner(signerWagmi)
  // }, [signerWagmi])

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

  /*useEffect(() => {
    return () => {
      if (localStorage.getItem('isWalletConnected') === 'false') {
        connectWithInjector()
      }
    }
  }, [connectWithInjector])*/

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer: signerWagmi as Signer,
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
