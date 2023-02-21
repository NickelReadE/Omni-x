import { createContext } from "react";
import { PendingTxType } from "./contract";

export type ProgressContextType = {
  histories: PendingTxType[];
  pending: boolean;
  setPending: (pending: boolean) => void;
  addTxToHistories: (txInfo: PendingTxType) => Promise<number>;
  updateHistory: (historyIndex: number, txInfo: PendingTxType) => void;
  clearHistories: () => void;
};

export const ProgressContext = createContext<ProgressContextType>({
  histories: [],
  pending: false,
  setPending: () => undefined,
  addTxToHistories: async () => -1,
  updateHistory: () => undefined,
  clearHistories: () => undefined
});
