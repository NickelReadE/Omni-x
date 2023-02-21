import { useContext } from "react";
import { MessageContextType, MessageContext } from "../components/providers/MessageProvider";

const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within an WalletProvider");
  }
  return context;
};

export default useMessage;
