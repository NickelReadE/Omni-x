import { Alchemy } from 'alchemy-sdk'
import {arbitrumSettings, CHAIN_IDS, optimismSettings} from '../utils/constants'
import {USDC_ADDRESS, USDT_ADDRESS} from '../utils/constants/addresses'
import {CHAIN_TYPE} from '../types/enum'

const arbitrumAlchemy = new Alchemy(arbitrumSettings)
const optimismAlchemy = new Alchemy(optimismSettings)

export const getERC20Balances = async (address: string) => {
  const balances = [
    { chainId: CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET], usdc: 0, usdt: 0 },
    { chainId: CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET], usdc: 0, usdt: 0 },
  ]

  try {
    const arbitrumBalance = await arbitrumAlchemy.core.getTokenBalances(address, [USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]], USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]]])

    if (arbitrumBalance && arbitrumBalance.tokenBalances.length > 0) {
      for (const tokenBalance of arbitrumBalance.tokenBalances) {
        if (tokenBalance.contractAddress === USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[1].usdc = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        } else if (tokenBalance.contractAddress === USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[1].usdt = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  try {
    const optimismBalance = await optimismAlchemy.core.getTokenBalances(address, [USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]]])
    if (optimismBalance && optimismBalance.tokenBalances.length > 0) {
      for (const tokenBalance of optimismBalance.tokenBalances) {
        if (tokenBalance.contractAddress === USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[2].usdc = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        } else if (tokenBalance.contractAddress === USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[2].usdt = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

  return balances
}
