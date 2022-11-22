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
type CurrencyType = {value: number, text: string, icon: string, address: string, decimals: number}

export const VALID_CURRENCIES: {[chain: number | string]: CurrencyType[]} = {
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
  ],
  [ChainIDS.APTOS]: [
  ]
}

export const getCurrencyIconByAddress = (address?: string) => {
  for (const chain in VALID_CURRENCIES) {
    const currency = VALID_CURRENCIES[chain].find(c => c.address.toLowerCase() === address?.toLowerCase())
    if (currency) {
      return `/images/${currency.icon}`
    }
  }

  return `/images/${CURRENCY_OMNI.icon}`
}

export const getCurrencyNameAddress = (address?: string) => {
  for (const chain in VALID_CURRENCIES) {
    const currency = VALID_CURRENCIES[chain].find(c => c.address.toLowerCase() === address?.toLowerCase())
    if (currency) {
      return currency.text
    }
  }

  return CURRENCY_OMNI.text
}

export const getDecimals = (chainId: number, currencyName: string) => {
  const currency = VALID_CURRENCIES[chainId].find(c => c.text === currencyName)
  return currency ? currency.decimals : 18
}

export const getDecimalsByAddress = (chainId: number, currencyAddr: string) => {
  const currency = VALID_CURRENCIES[chainId].find(c => c.address === currencyAddr)
  return currency ? currency.decimals : 18
}

export const formatCurrency = (price: BigNumberish, chainId: number, currencyName: string) => {
  if (price) return ethers.utils.formatUnits(price, getDecimals(chainId, currencyName))
  return '0'
}

export const parseCurrency = (price: string, chainId: number, currencyName: string) => {
  if (price) return ethers.utils.parseUnits(price, getDecimals(chainId, currencyName))
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

export const getConversionRate = (fromChainId: number, currencyFrom: ContractName, toChainId: number, currencyTo: ContractName) => {
  // if decimals is positive, price1 = price2 * 10 ** decimals
  // if decimals is negative, price1 = price2 / 10 ** (decimals - 100)

  const decimals = getDecimals(fromChainId, currencyFrom) - getDecimals(toChainId, currencyTo)

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
