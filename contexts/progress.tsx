import { createContext } from 'react'
import {PendingTxType} from './contract'

export type ProgressContextType = {
  histories: PendingTxType[] | null,
  addTxToHistories: (txInfo: PendingTxType) => number,
  updateHistory: (historyIndex: number, txInfo: PendingTxType) => void,
  clearHistories: () => void
}

export const ProgressContext = createContext<ProgressContextType>({
  histories: [],
  addTxToHistories: () => -1,
  updateHistory: () => undefined,
  clearHistories: () => undefined,
})
