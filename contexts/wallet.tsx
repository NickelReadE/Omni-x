import { createContext } from 'react'
import { ethers, Signer } from 'ethers'
import {ChainIds} from '../types/enum'
import {Provider} from '@wagmi/core'

export type WalletContextType = {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | Provider | undefined
  signer: Signer | undefined
  address: string | undefined
  chainId: number
  chainName: string
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
