import { createContext } from 'react'
import { ethers, Signer } from 'ethers'
import Web3Modal from 'web3modal'
import {ChainIds} from '../types/enum'

export type WalletContextType = {
  provider: ethers.providers.Web3Provider | undefined
  signer: Signer | undefined
  address: string | undefined
  chainId: number
  chainName: string
  web3Modal: Web3Modal | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  switchNetwork: (chainIndex: number) => Promise<void>
  connect: () => Promise<Signer | undefined>
  disconnect: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>({
  provider: undefined,
  signer: undefined,
  address: undefined,
  chainId: ChainIds.ETHEREUM,
  chainName: '',
  web3Modal: undefined,
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  switchNetwork: async () => undefined,
  connect: async () => undefined,
  disconnect: async () => undefined,
})

