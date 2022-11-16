import {ethers} from 'ethers'
import {crypto_list, rpcDatafeedProvider, rpcGasProvider} from '../utils/utils'
import Aggregator from '../constants/abis/AggregatvorV3.json'
import {CHAIN_TYPE} from '../types/enum'
import {CHAIN_IDS} from '../utils/constants'

const ASSETS_CHAIN_ID = {
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: CHAIN_IDS[CHAIN_TYPE.ETHEREUM],
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: CHAIN_IDS[CHAIN_TYPE.BINANCE],
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: CHAIN_IDS[CHAIN_TYPE.OPTIMISM],
}

export const getPriceForUSD = async (rpcChainId: number, chainId: number) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcDatafeedProvider[rpcChainId])
  const priceFeed = new ethers.Contract(crypto_list[rpcChainId][chainId], Aggregator, provider)
  let result: any = 0
  await priceFeed.latestRoundData()
    .then((roundData: any) => {
      result = (parseFloat((roundData.answer)) / 100000000.0)
    })
  return result.toFixed(3)

}
const getGasOnChain = async (chainId: number) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcGasProvider[chainId])
  const gasPrice = ethers.utils.formatUnits(await provider.getGasPrice(), 'gwei')
  return parseFloat(gasPrice).toFixed(3)
}

export const getGasOnChains = async (chainIds: number[]) => {
  const gasPrices: any = {}
  for (const chainId of chainIds) {
    gasPrices[chainId] = await getGasOnChain(chainId)
  }
  return gasPrices
}

export const getPriceFeeddata = async (chainIds: number[]): Promise<any[]> => {
  const prices: any = {}
  for (const chainId of chainIds) {
    prices[chainId] = await getPriceForUSD(ASSETS_CHAIN_ID[chainId], chainId)
  }
  return prices
}
