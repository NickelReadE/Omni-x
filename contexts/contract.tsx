import { createContext } from 'react'
import {NFTItem} from '../interface/interface'

export type PendingTxType = {
  txHash?: string,
  destTxHash?: string | undefined,
  lastTxHash?: string | undefined,
  type: 'bridge' | 'buy' | 'accept' | 'gaslessMint',
  senderChainId: number,
  senderAddress?: string,
  targetChainId: number,
  targetAddress: string,
  isONFTCore: boolean,
  nftItem?: NFTItem,
  contractType: string, // 'ERC721' | 'ERC1155',
  targetBlockNumber: number,
  senderBlockNumber?: number,
  itemName: string | undefined,
  lastTxAvailable?: boolean,
  colUrl?: string
}

export type ContractContextType = {
  listenONFTEvents: (txInfo: PendingTxType, historyIndex: number) => Promise<void>,
  errorHandler: (error: any) => void,
}

export const ContractContext = createContext<ContractContextType>({
  listenONFTEvents: async () => undefined,
  errorHandler: () => undefined,
})

