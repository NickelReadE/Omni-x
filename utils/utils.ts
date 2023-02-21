import { CHAIN_TYPE } from "../types/enum";
import { CHAIN_IDS } from "./constants";
import { BigNumber } from "ethers";

interface ICrypto {
  [key: number]: string;
}
interface ICryptoObj {
  [key: number]: ICrypto;
}

interface IRpcDatafeed {
  [key: number]: string;
}

export const crypto_list: ICryptoObj = {
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: {
    [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: "0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7",
    [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
    [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: "0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b",
    [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: "0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676"
  },
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: {
    [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
    [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: "0x5974855ce31EE8E1fff2e76591CbF83D7110F151",
    [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
    [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: "0xe2A47e87C0f4134c8D06A41975F6860468b2F925",
    [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: "0x7CA57b0cA6367191c94C8914d7Df09A57655905f"
  },
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: {
    [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: "0x0D276FC14719f9292D5C1eA2198673d1f4269246"
  }
};

export const rpcDatafeedProvider: IRpcDatafeed = {
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: "https://rpc.ankr.com/eth",
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: "https://rpc.ankr.com/bsc",
  [CHAIN_IDS[CHAIN_TYPE.ARBITRUM]]: "https://rpc.ankr.com/arbitrum",
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: "https://rpc.ankr.com/avalanche",
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: "https://rpc.ankr.com/fantom",
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: "https://rpc.ankr.com/optimism",
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: "https://rpc.ankr.com/polygon"
};

export const rpcGasProvider: IRpcDatafeed = {
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: "https://rpc.ankr.com/eth",
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: "https://rpc.ankr.com/bsc",
  [CHAIN_IDS[CHAIN_TYPE.ARBITRUM]]: "https://rpc.ankr.com/arbitrum",
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: "https://api.avax.network/ext/bc/C/rpc",
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: "https://rpc.ankr.com/fantom",
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: "https://rpc.ankr.com/optimism",
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: "https://rpc.ankr.com/polygon"
};

export const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const serializeMakeOrder = (order: any) => {
  console.log(
    `["${order.isOrderAsk.toString()}","${order.signer}","${
      order.collection
    }","${order.price.toString()}","${order.tokenId.toString()}","${order.amount.toString()}","${order.strategy}","${
      order.currency
    }","${order.nonce.toString()}","${order.startTime.toString()}","${order.endTime.toString()}","${order.minPercentageToAsk.toString()}","${order.params.toString()}","${order.signature.toString()}"]`
  );
};

export const serializeTakeOrder = (order: any) => {
  console.log(
    `["${order.isOrderAsk.toString()}","${
      order.taker
    }","${order.price.toString()}","${order.tokenId.toString()}","${order.minPercentageToAsk.toString()}","${order.params.toString()}"]`
  );
};

export const calcVolumeUp = (volume1x: string, volume2x: string) => {
  const a = BigNumber.from(volume1x || "0");
  const b = BigNumber.from(volume2x || "0");

  if (a.gte(b)) {
    if (b.gt(0)) {
      return ~~(a.mul(100).div(b).toNumber() - 100);
    } else if (b.eq(0)) {
      return 0;
    }
    return 100;
  } else if (a.gt(0)) {
    return ~~(100 - b.mul(100).div(a).toNumber());
  } else if (b.eq(0)) {
    return -100;
  }
  return 0;
};

export const activeClasses = (index: number, selectedTab: number) => {
  return index === selectedTab ? "bg-primary-gradient" : "bg-[#303030]";
};

export const activeTextClasses = (index: number, selectedTab: number) => {
  return index === selectedTab ? "bg-primary-gradient bg-clip-text text-transparent" : "text-secondary";
};
