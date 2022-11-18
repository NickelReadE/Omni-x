import { BigNumber, BigNumberish, ethers } from 'ethers'
import OFT from '../../constants/addresses/OFT.json'
import USDC from '../../constants/addresses/USDC.json'
import USDT from '../../constants/addresses/USDT.json'
import WETH from '../../constants/addresses/WETH.json'
import {ChainIds as ChainIDS} from '../../types/enum'
import { ContractName } from './contracts'

export const oft: any = OFT
export const usdc: any = USDC
export const usdt: any = USDT
export const weth: any = WETH

export const CURRENCY_OMNI = {value: 0, text: 'OMNI', icon: 'payment/omni.png'}
export const CURRENCY_USDC = {value: 1, text: 'USDC', icon: 'payment/usdc.png'}
export const CURRENCY_USDT = {value: 2, text: 'USDT', icon: 'payment/usdt.png'}
export const CURRENCY_WETH = {value: 3, text: 'WETH', icon: 'payment/eth.png'}

const getCurrency = (currency: any, address: string, decimals: number) => ({...currency, address, decimals})

export const VALID_CURRENCIES = {
  [ChainIDS.BINANCE]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.BINANCE], 18),
    getCurrency(CURRENCY_USDT, oft[ChainIDS.BINANCE], 18),
  ],
  [ChainIDS.AVALANCHE]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.AVALANCHE], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.AVALANCHE], 6),
  ],
  [ChainIDS.POLYGON]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.POLYGON], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.POLYGON], 6),
  ],
  [ChainIDS.FANTOM]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.FANTOM], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.FANTOM], 6),
  ],
  [ChainIDS.ETHEREUM]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.ETHEREUM], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.ETHEREUM], 6),
    getCurrency(CURRENCY_WETH, weth[ChainIDS.ETHEREUM], 18),
  ],
  [ChainIDS.ARBITRUM]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.ARBITRUM], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.ARBITRUM], 6),
    getCurrency(CURRENCY_WETH, weth[ChainIDS.ARBITRUM], 18),
  ],
  [ChainIDS.OPTIMISM]: [
    getCurrency(CURRENCY_OMNI, oft[ChainIDS.OPTIMISM], 18),
    getCurrency(CURRENCY_USDC, usdc[ChainIDS.OPTIMISM], 6),
    getCurrency(CURRENCY_WETH, weth[ChainIDS.OPTIMISM], 18),
  ]
}

export const CURRENCIES_LIST = [
  {value: 0, text: 'OMNI', decimals: 18, icon: 'payment/omni.png'},
  {value: 1, text: 'USDC', decimals: 6, icon: 'payment/usdc.png'},
  {value: 2, text: 'USDT', decimals: 18, icon: 'payment/usdt.png'},
  {value: 3, text: 'WETH', decimals: 18, icon: 'payment/eth.png'},
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
  return (VALID_CURRENCIES as any)[chainId]
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
