import OmnixBridge from '../../constants/addresses/OmnixBridge.json'
import OmnixBridge1155 from '../../constants/addresses/OmnixBridge1155.json'
import OmnixExchange from '../../constants/OmnixExchange.json'
import Strategy from '../../constants/Strategy.json'
import TransferSelectorNFT from '../../constants/TransferSelectorNFT.json'
import FundManager from '../../constants/FundManager.json'
import Stargate from '../../constants/Stargate.json'
import StargatePoolManager from '../../constants/StargatePoolManager.json'
import CurrencyManager from '../../constants/CurrencyManager.json'
import LZEndpoint from '../../constants/layerzero/LayerzeroEndpoints.json'
import { chainInfos } from './chains'
import { oft, usdc, usdt } from './currency'

const omnixBridge: any = OmnixBridge
const omnixBridge1155: any = OmnixBridge1155
const omnixExchange: any = OmnixExchange
const strategy: any = Strategy
const transferSelectorNFT: any = TransferSelectorNFT
const fundManager: any = FundManager

const stargate: any = Stargate
const stargatePoolManager: any = StargatePoolManager
const currencyManager: any = CurrencyManager
const lzEndpoint: any = LZEndpoint

export type ContractName =
    'Omnix' |
    'Omnix1155' |
    'LayerZeroEndpoint' |
    'OmnixExchange' |
    'Strategy' |
    'OMNI' |
    'USDC' |
    'USDT' |
    'TransferSelectorNFT' |
    'FundManager' |
    'StargateRouter' |
    'StargatePoolManager' |
    'CurrencyManager'


export const getAddressByName = (name: ContractName, chainId: number) => {
  if (name === 'Omnix') {
    return omnixBridge[chainInfos[chainId].name]
  } else if (name === 'Omnix1155') {
    return omnixBridge1155[chainInfos[chainId].name]
  } else if (name === 'LayerZeroEndpoint') {
    return lzEndpoint[chainInfos[chainId].name]
  } else if (name === 'OmnixExchange') {
    return omnixExchange[chainInfos[chainId].name]
  } else if (name === 'Strategy') {
    return strategy[chainInfos[chainId].name]
  } else if (name === 'OMNI') {
    return oft[chainInfos[chainId].name]
  } else if (name === 'USDC') {
    return usdc[chainId.toString()]
  } else if (name === 'USDT') {
    return usdt[chainId.toString()]
  } else if (name === 'TransferSelectorNFT') {
    return transferSelectorNFT[chainInfos[chainId].name]
  } else if (name === 'FundManager') {
    return fundManager[chainInfos[chainId].name]
  } else if (name === 'StargateRouter') {
    return stargate[chainInfos[chainId].name].router
  } else if (name === 'StargatePoolManager') {
    return stargatePoolManager[chainInfos[chainId].name]
  } else if (name === 'CurrencyManager') {
    return currencyManager[chainId.toString()]
  }
}