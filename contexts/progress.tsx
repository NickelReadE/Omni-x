import { createContext } from 'react'
import {NFTItem} from '../interface/interface'
import {BigNumber} from 'ethers'

export type PendingTxType = {
  txHash: string,
  type: 'bridge' | 'buy' | 'sell' | 'bid',
  senderChainId: number | undefined,
  targetChainId: number | undefined,
  itemName: string | undefined
}

export type ProgressContextType = {
  pending: boolean,
  txInfo: PendingTxType | null,
  setPendingTxInfo: (txInfo: PendingTxType | null) => Promise<void>,
  estimateGasFee: (selectedNFTItem: NFTItem, senderChainId: number, targetChainId: number) => Promise<BigNumber>,
}

export const ProgressContext = createContext<ProgressContextType>({
  pending: false,
  txInfo: null,
  setPendingTxInfo: async () => undefined,
  estimateGasFee: async () => BigNumber.from('0'),
})

