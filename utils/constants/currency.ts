import { BigNumber, BigNumberish, ethers } from 'ethers'
import OFT from '../../constants/OFT.json'
import USDC from '../../constants/USDC.json'
import USDT from '../../constants/USDT.json'
import {ChainIds as ChainIDS} from '../../types/enum'
import { ContractName } from './contracts'

export const oft: any = OFT
export const usdc: any = USDC
export const usdt: any = USDT

export const CURRENCIES_LIST = [
  {value: 0, text: 'OMNI', decimals: 18, icon: 'payment/omni.png'},
  {value: 1, text: 'USDC', decimals: 6, icon: 'payment/usdc.png'},
  {value: 2, text: 'USDT', decimals: 18, icon: 'payment/usdt.png'},
]
  
export const STABLECOIN_DECIMAL: any = {
  [ChainIDS.BINANCE]: {
    [USDT[ChainIDS.BINANCE]]: 18,
  },
  [ChainIDS.AVALANCHE]: {
    [USDC[ChainIDS.AVALANCHE]]: 6,
  },
  [ChainIDS.POLYGON]: {
    [USDC[ChainIDS.POLYGON]]: 6,
  },
  [ChainIDS.FANTOM]: {
    [USDC[ChainIDS.FANTOM]]: 6,
  },
  [ChainIDS.ETHEREUM]: {
    [USDC[ChainIDS.ETHEREUM]]: 6,
  },
  [ChainIDS.ARBITRUM]: {
    [USDC[ChainIDS.ARBITRUM]]: 6,
  },
  [ChainIDS.OPTIMISM]: {
    [USDC[ChainIDS.OPTIMISM]]: 6,
  },
}
  
export const currencies_list: { [key: number]: Array<{ value: number; text: string, icon: string, address: string }> } = {
  1: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  56: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  137: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  43114: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  250: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  10: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  42161: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xc375c320cae7b874cb54a46f7158bbfb09bbf879'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  4: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xE9956C00aaeCa65C89F4C9AcDEbd36A1784F0B86'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad'},
  ],
  5: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x918460AE47177f1Ce471a384f1a5768b6e443138'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: ''},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
  97: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0xBfB4D3441f190014C5111f566e6AbE8a93E862D8'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: ''},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0xF49E250aEB5abDf660d643583AdFd0be41464EfD'},
  ],
  43113: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x417456563aF8e98d8ddF2915750E72Fa23C8224F'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x4A0D1092E9df255cf95D72834Ea9255132782318'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
  80001: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x48894014441Aaf5015EF52a9eC49e147f965cB8b'},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
  421611: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: ''},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x1EA8Fb2F671620767f41559b663b86B1365BBc3d'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
  69: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: ''},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x567f39d9e6d02078F357658f498F80eF087059aa'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
  4002: [
    {value: 0, text: 'OMNI', icon: 'payment/omni.png', address: ''},
    {value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0x076488D244A73DA4Fa843f5A8Cd91F655CA81a1e'},
    {value: 2, text: 'USDT', icon: 'payment/usdt.png', address: ''},
  ],
}

const DECIMAL_MAP = (CURRENCIES_LIST.reduce((acc, c) => {
  (acc as any)[c.text] = c.decimals
  return acc
}, {})) as any
  
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
      return `/images/${currency.icon}`
    }
  }
  
  return `/images/${CURRENCIES_LIST[0].icon}`
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

export const formatCurrency = (price: BigNumberish, currencyName: string) => {
  if (price) return ethers.utils.formatUnits(price, DECIMAL_MAP[currencyName])
  return '0'
}
  
export const parseCurrency = (price: string, currencyName: string) => {
  if (price) return ethers.utils.parseUnits(price, DECIMAL_MAP[currencyName])
  return BigNumber.from(0)
}
  

export const isUsdcOrUsdt = (address?: string) => {
  const currency_addr_list = [usdc, usdt]
  
  for (let idx = 0; idx < currency_addr_list.length; idx++) {
    const chainIdx = Object.values(currency_addr_list[idx]).indexOf(address)
    if (chainIdx != -1) {
      return true
    }
  }

  return false
}

export const getValidCurrencies = (chainId: number) => {
  if (chainId === ChainIDS.BINANCE) {
    return [CURRENCIES_LIST[0], CURRENCIES_LIST[2]]
  }
  
  return [CURRENCIES_LIST[0], CURRENCIES_LIST[1]]
}

export const getConversionRate = (currencyFrom: ContractName, currencyTo: ContractName) => {
  // if decimals is positive, price1 = price2 * 10 ** decimals
  // if decimals is negative, price1 = price2 / 10 ** (decimals - 100)
    
  const decimals = DECIMAL_MAP[currencyFrom] - DECIMAL_MAP[currencyTo]
  
  if (decimals < 0) return 100 - decimals
  return decimals
}

export const validateCurrencyName = (currencyName: ContractName, chainId: number) => {
  if (chainId === ChainIDS.BINANCE) {
    if (currencyName === 'USDC')
      return 'USDT'
  } else {
    if (currencyName === 'USDT')
      return 'USDC'
  }
  return currencyName
}