import { createContext } from 'react'
import {NFTItem} from '../interface/interface'

export type PendingTxType = {
  txHash: string,
  destTxHash?: string | undefined,
  type: 'bridge' | 'buy' | 'sell' | 'bid',
  senderChainId: number,
  targetChainId: number,
  targetAddress: string,
  isONFTCore: boolean,
  nftItem: NFTItem,
  contractType: 'ERC721' | 'ERC1155',
  targetBlockNumber: number,
  itemName: string | undefined
}

export type ContractContextType = {
  listenONFTEvents: (txInfo: PendingTxType, historyIndex: number) => Promise<void>,
}

export const ContractContext = createContext<ContractContextType>({
  listenONFTEvents: async () => undefined,
})

