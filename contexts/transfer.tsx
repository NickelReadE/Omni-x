import { createContext } from "react";

export type TransferContextType = {
  isLoading: boolean;
  onFaucet: () => void;
};

export const TransferContext = createContext<TransferContextType>({
  isLoading: false,
  onFaucet: () => undefined
});
