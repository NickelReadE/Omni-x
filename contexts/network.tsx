import { createContext } from "react";

export type SwitchedNetworkContextType = {
  switched: number;
  switchNetworkAsync: any;
};

export const SwitchedNetworkContext = createContext<SwitchedNetworkContextType>({
  switched: 0,
  switchNetworkAsync: undefined
});
