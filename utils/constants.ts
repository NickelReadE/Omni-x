import {ethers} from 'ethers'
import OmnixBridge from '../constants/OmnixBridge.json'
import OmnixBridge1155 from '../constants/OmnixBridge1155.json'
import OmnixExchange from '../constants/OmnixExchange.json'
import Strategy from '../constants/Strategy.json'
import TransferSelectorNFT from '../constants/TransferSelectorNFT.json'
import FundManager from '../constants/FundManager.json'
import OFT from '../constants/OFT.json'
import USDC from '../constants/USDC.json'
import USDT from '../constants/USDT.json'
import LZEndpoint from '../constants/LayerzeroEndpoints.json'
import ChainIds from '../constants/chainIds.json'
import CHAINS from '../constants/chains.json'

const omnixBridge: any = OmnixBridge
const omnixBridge1155: any = OmnixBridge1155
const omnixExchange: any = OmnixExchange
const strategy: any = Strategy
const transferSelectorNFT: any = TransferSelectorNFT
const fundManager: any = FundManager
const oft: any = OFT
const usdc: any = USDC
const usdt: any = USDT
const lzEndpoint: any = LZEndpoint
const chainIds: any = ChainIds

export const PROTOCAL_FEE = 2
export const CREATOR_FEE = 2

const environments: any = {
  mainnet: ['ethereum', 'bsc', 'avalanche', 'polygon', 'arbitrum', 'optimism', 'fantom'],
  testnet: ['rinkeby', 'bsc-testnet', 'fuji', 'mumbai', 'arbitrum-rinkeby', 'optimism-kovan', 'fantom-testnet']
}

export const CURRENCIES_LIST = [
  { value: 0, text: 'OMNI', icon: 'payment/omni.png' },
  { value: 1, text: 'USDC', icon: 'payment/usdc.png' },
  { value: 2, text: 'USDT', icon: 'payment/usdt.png' },
]

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
  'FundManager'

export const rpcProviders: { [key: number]: string } = {
  1:'https://mainnet.infura.io/v3/20504cdcff23477c9ed314d042d85a74',
  56:'https://bsc-dataseed.binance.org/',
  137:'https://polygon-rpc.com',
  43114:'https://api.avax.network/ext/bc/C/rpc',
  250:'https://rpcapi.fantom.network',
  10:'https://mainnet.optimism.io',
  42161:'https://arb1.arbitrum.io/rpc',
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  43113: 'https://api.avax-test.network/ext/bc/C/rpc',
  80001: 'https://speedy-nodes-nyc.moralis.io/99e98b2333a911011f42606d/polygon/mumbai',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  69: 'https://kovan.optimism.io',
  4002: 'https://rpc.testnet.fantom.network'
}

export const ONFT_CORE_INTERFACE_ID = '0x7bb0080b'
export const ONFT1155_CORE_INTERFACE_ID = '0x33577776'
export const ERC1155_INTERFACE_ID = '0xd9b67a26'
export const ERC712_INTERFACE_ID = '0x80ac58cd'

export const chainInfos: { [key: number]: { name: string; logo: string, officialName: string, currency: string } } = {
  1: {
    name: 'eth',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  56: {
    name: 'bsc',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  137: {
    name: 'polygon',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  43114: {
    name: 'avalanche',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  250: {
    name: 'fantom',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  10: {
    name: 'optimism',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  42161: {
    name: 'arbitrum',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  4: {
    name: 'rinkeby',
    logo: '/svgs/ethereum.svg',
    officialName: 'Rinkeby',
    currency: 'ETH'
  },
  97: {
    name: 'bsc-testnet',
    logo: '/svgs/binance.svg',
    officialName: 'BSC',
    currency: 'BNB'
  },
  43113: {
    name: 'fuji',
    logo: '/svgs/avax.svg',
    officialName: 'Fuji',
    currency: 'AVAX'
  },
  80001: {
    name: 'mumbai',
    logo: '/svgs/polygon.svg',
    officialName: 'Mumbai',
    currency: 'MATIC'
  },
  421611: {
    name: 'arbitrum-rinkeby',
    logo: '/svgs/arbitrum.svg',
    officialName: 'Arbitrum',
    currency: 'ArbETH'
  },
  69: {
    name: 'optimism-kovan',
    logo: '/svgs/optimism.svg',
    officialName: 'Optimism',
    currency: 'ETH'
  },
  4002: {
    name: 'fantom-testnet',
    logo: '/svgs/fantom.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  
}

export const getLayerzeroChainId = (chainId: number): number => {
  return chainIds[chainInfos[chainId].name]
}

export const chain_list: {[key: string]: number} = {
  'eth': 1,
  'bsc': 56,
  'matic': 137,
  'avalanche': 43114,
  'fantom': 250,
  'optimism': 10,
  'arbitrum': 42161,
  'bsc testnet': 97,
  'rinkeby': 4,
  'mumbai': 80001,
  'avalanche testnet': 43113
}

export const getChainIdFromName = (name: string): number => {
  return chain_list[name]
}

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
    return usdc[chainInfos[chainId].name]
  } else if (name === 'USDT') {
    return usdt[chainInfos[chainId].name]
  } else if (name === 'TransferSelectorNFT') {
    return transferSelectorNFT[chainInfos[chainId].name]
  } else if (name === 'FundManager') {
    return fundManager[chainInfos[chainId].name]
  }
}

export const getProvider = (chainId: number) => {
  const rpcURL = rpcProviders[chainId]
  console.log(rpcURL, chainInfos[chainId].name)

  return new ethers.providers.JsonRpcProvider(
    rpcURL,
    {
      name: chainInfos[chainId].name,
      chainId: chainId,
    }
  )
}

export const getChainInfo = (chainId: number) => {
  const filter = CHAINS.filter((item) => item.chainId === chainId)
  if (filter.length > 0) {
    return filter[0]
  }
  return null
}

const loopCurrencies = (currencies: any, idx: number, address?: string) => {
  if (Object.values(currencies).indexOf(address) != -1) {
    return CURRENCIES_LIST[idx]
  }
  return null
}

export const getCurrencyIconByAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const currency = loopCurrencies(currency_addr_list[idx], idx, address)
    if (currency) {
      return currency.icon
    }
  }
  
  return CURRENCIES_LIST[0].icon
}

export const getChainNameById = (chainId: number) => {
  return chainInfos[chainId].name
}

export const getCurrencyNameAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const currency = loopCurrencies(currency_addr_list[idx], idx, address)
    if (currency) {
      return currency.text
    }
  }
  
  return CURRENCIES_LIST[0].text
}

const chainIcons = Object.values(chainInfos).reduce((acc, cur) => {
  Object.assign(acc, { [cur.name]: cur.logo} )
  return acc
}, {})

export const getChainIconByCurrencyAddress = (address?: string) => {
  const currency_addr_list = [oft, usdc, usdt]
  
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const chainIdx = Object.values(currency_addr_list[idx]).indexOf(address)
    if (chainIdx != -1) {
      const chainName = Object.keys(currency_addr_list[idx])[chainIdx]
      return (chainIcons as any)[chainName]
    }
  }
  
  return (chainIcons as any)['rinkeby']
}