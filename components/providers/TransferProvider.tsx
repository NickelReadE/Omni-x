import { ReactNode } from "react";
import { TransferContext } from "../../contexts/transfer";

type TransferProviderProps = {
  children?: ReactNode;
};

export const TransferProvider = ({ children }: TransferProviderProps): JSX.Element => {
  const isLoading = true;
  const faucet = () => {
    console.log("faucet");
  };

  return (
    <TransferContext.Provider
      value={{
        isLoading,
        onFaucet: faucet
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};
