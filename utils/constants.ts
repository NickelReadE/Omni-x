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
  80001: 'https://polygon-mumbai.g.alchemy.com/v2/H2EfIYrKg--DbTdHW37WJaSVuaJvTF0T',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  69: 'https://kovan.optimism.io',
  4002: 'https://rpc.testnet.fantom.network'
}

export const ONFT_CORE_INTERFACE_ID = '0x7bb0080b'
export const ONFT1155_CORE_INTERFACE_ID = '0x33577776'
export const ERC1155_INTERFACE_ID = '0xd9b67a26'
export const ERC712_INTERFACE_ID = '0x80ac58cd'
export const ERC2189_INTERFACE_ID = '0x2a55205a'

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

// export const currencies_list = [
//   { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
//   { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
//   { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
// ]

export const currencies_list: { [key: number]: Array<{ value: number; text: string, icon: string, address: string }> } = {
  1: [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  56: [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  137:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  43114:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  250:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  10:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  42161:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ],
  4:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xE9956C00aaeCa65C89F4C9AcDEbd36A1784F0B86' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  97:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xBfB4D3441f190014C5111f566e6AbE8a93E862D8' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0xF49E250aEB5abDf660d643583AdFd0be41464EfD' },
  ],
  43113:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x417456563aF8e98d8ddF2915750E72Fa23C8224F' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x4A0D1092E9df255cf95D72834Ea9255132782318' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  80001:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  421611:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1EA8Fb2F671620767f41559b663b86B1365BBc3d' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  69:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x567f39d9e6d02078F357658f498F80eF087059aa' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
  4002:  [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x076488D244A73DA4Fa843f5A8Cd91F655CA81a1e' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '' },
  ],
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

export const getCurrencyIconByAddress = (address?: string) => {
  const loopCurrencies = (currencies: any, idx: number) => {
    if (Object.values(currencies).indexOf(address) != -1) {
      return CURRENCIES_LIST[idx].icon
    }
    return null
  }

  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const icon = loopCurrencies(currency_addr_list[idx], idx)
    if (icon) {
      return icon
    }
  }
  
  return CURRENCIES_LIST[0].icon
}

export const getChainNameById = (chainId: number) => {
  return chainInfos[chainId].name
}

export const getCurrencyNameAddress = (address: string) => {
  const loopCurrencies = (currencies: any, idx: number) => {
    if (Object.values(currencies).indexOf(address) != -1) {
      return CURRENCIES_LIST[idx].text
    }
    return null
  }

  const currency_addr_list = [oft, usdc, usdt]
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const text = loopCurrencies(currency_addr_list[idx], idx)
    if (text) {
      return text
    }
  }
  
  return CURRENCIES_LIST[0].text
}
export const getBlockExplorer = (chainId: number) => {
  const chainInfo = getChainInfo(chainId)
  if (chainInfo) {
    return chainInfo.explorers?.[0]?.url
  }
  return null
}
