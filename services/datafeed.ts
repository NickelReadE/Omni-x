import { ethers } from "ethers";
import axios from "axios";
import { crypto_list, rpcDatafeedProvider } from "../utils/utils";
import Aggregator from "../constants/abis/AggregatvorV3.json";
import { CHAIN_TYPE } from "../types/enum";
import { CHAIN_IDS, getProvider } from "../utils/constants";

const ASSETS_CHAIN_ID = {
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: CHAIN_IDS[CHAIN_TYPE.ETHEREUM],
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: CHAIN_IDS[CHAIN_TYPE.OPTIMISM]
};

export const getPriceForUSD = async (rpcChainId: number, chainId: number) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcDatafeedProvider[rpcChainId]);
  const priceFeed = new ethers.Contract(crypto_list[rpcChainId][chainId], Aggregator, provider);
  let result: any = 0;
  try {
    const roundData = await priceFeed.latestRoundData();
    result = parseFloat(roundData.answer) / 100000000.0;
  } catch (e) {
    console.error(`While getting roundData for ${chainId} on ${rpcChainId}: `, e);
  }
  return result.toFixed(3);
};

const getGasOnChain = async (chainId: number) => {
  let gasPrice = "0";
  try {
    const provider = getProvider(chainId);
    const _gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(_gasPrice, "gwei");
  } catch (e) {
    console.error(`While getting gas price for ${chainId}: `, e);
  }
  return parseFloat(gasPrice).toFixed(3);
};

export const getGasOnChains = async (chainIds: number[]) => {
  const gasPrices: any = {};
  for (const chainId of chainIds) {
    gasPrices[chainId] = await getGasOnChain(chainId);
  }
  return gasPrices;
};

export const getPriceFeeddata = async (): Promise<any[]> => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,avalanche-2,matic-network,fantom&vs_currencies=usd"
  );
  const prices: any = {};

  prices[CHAIN_IDS[CHAIN_TYPE.ETHEREUM]] = data.ethereum.usd;
  prices[CHAIN_IDS[CHAIN_TYPE.BINANCE]] = data.binancecoin.usd;
  prices[CHAIN_IDS[CHAIN_TYPE.AVALANCHE]] = data["avalanche-2"].usd;
  prices[CHAIN_IDS[CHAIN_TYPE.POLYGON]] = data["matic-network"].usd;
  prices[CHAIN_IDS[CHAIN_TYPE.FANTOM]] = data.fantom.usd;

  // for (const chainId of chainIds) {
  //   prices[chainId] = await getPriceForUSD(ASSETS_CHAIN_ID[chainId], chainId)
  // }
  return prices;
};
