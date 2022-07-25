import { createContext } from 'react'
import {NFTItem} from '../interface/interface'
import {BigNumber} from 'ethers'

export type UnwrapInfo = {
  type: 'ERC721' | 'ERC1155',
  chainId: number,
  originAddress: string,
  persistentAddress: string,
  tokenId: number
}

export type BridgeContextType = {
  estimating: boolean,
  unwrapInfo: UnwrapInfo | undefined,
  estimateGasFee: (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => Promise<BigNumber>
}

export const BridgeContext = createContext<BridgeContextType>({
  estimating: false,
  unwrapInfo: undefined,
  estimateGasFee: async () => BigNumber.from('0'),
})

