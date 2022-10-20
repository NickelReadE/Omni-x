import { createContext } from 'react'
import { ethers, Signer } from 'ethers'
import {ChainIds} from '../types/enum'

export type WalletContextType = {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | undefined
  signer: Signer | undefined
  address: string | undefined
  chainId: number | undefined
  chainName: string | undefined
  resolveName: (name: string) => Promise<string | undefined>
  lookupAddress: (address: string) => Promise<string | undefined>
  connect: () => void
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType>({
  provider: undefined,
  signer: undefined,
  address: undefined,
  chainId: ChainIds.ETHEREUM,
  chainName: '',
  resolveName: async () => undefined,
  lookupAddress: async () => undefined,
  connect: () => undefined,
  disconnect: () => undefined,
})
