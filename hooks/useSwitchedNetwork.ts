import { useContext, useEffect } from "react";
import { SwitchedNetworkContext, SwitchedNetworkContextType } from "../contexts/network";

export const useSwitchedNetwork = (callback?: any): SwitchedNetworkContextType => {
  const { switched, switchNetworkAsync } = useContext(SwitchedNetworkContext);

  useEffect(() => {
    if (switched && callback) {
      setTimeout(callback, 1000);
    }
  }, [callback, switched]);

  return {
    switched,
    switchNetworkAsync
  };
};
