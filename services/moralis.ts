import axios from 'axios'
import {USDC_ADDRESS, USDT_ADDRESS} from '../utils/constants/addresses'
import {CHAIN_IDS} from '../utils/constants'
import {CHAIN_TYPE} from '../types/enum'
import {ethers} from 'ethers'

const moralisSupportChainIds = [
  CHAIN_IDS[CHAIN_TYPE.GOERLI],
  CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.MUMBAI],
]

const MORALIS_API_KEY = process.env.MORALIS_API_KEY

export const getERC20Balances = async (chainId: number, address: string) => {
  const balances = {
    chainId: chainId,
    usdc: 0,
    usdt: 0,
  }
  if (USDC_ADDRESS[chainId]) {
    try {
      const {data} = await axios.request({
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${address}/erc20`,
        params: {
          chain: `0x${(chainId).toString(16)}`,
          token_addresses: USDC_ADDRESS[chainId],
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': MORALIS_API_KEY as string
        }
      })
      if (data && data.length > 0) {
        balances.usdc = parseFloat(ethers.utils.formatUnits(data[0].balance, data[0].decimals))
      }
    } catch (e) {
      console.log(e)
    }
  }
  if (USDT_ADDRESS[chainId]) {
    const {data} = await axios.request({
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/${address}/erc20`,
      params: {
        chain: `0x${(chainId).toString(16)}`,
        token_addresses: USDT_ADDRESS[chainId],
      },
      headers: {accept: 'application/json', 'X-API-Key': MORALIS_API_KEY as string}
    })
    if (data && data.length > 0) {
      balances.usdt = parseFloat(ethers.utils.formatUnits(data[0].balance, data[0].decimals))
    }
  }
  return balances
}

export const getUserBalances = async (address: string) => {
  const balances: any[] = []
  for (const chainId of moralisSupportChainIds) {
    balances.push(await getERC20Balances(chainId, address))
  }
  return balances
}
