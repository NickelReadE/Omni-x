import { Alchemy } from 'alchemy-sdk'
import {arbitrumSettings, CHAIN_IDS, ethSettings, mumbaiSettings, optimismSettings} from '../utils/constants'
import {USDC_ADDRESS, USDT_ADDRESS} from '../utils/constants/addresses'
import {CHAIN_TYPE} from '../types/enum'

const ethAlchemy = new Alchemy(ethSettings)
const arbitrumAlchemy = new Alchemy(arbitrumSettings)
const optimismAlchemy = new Alchemy(optimismSettings)
const mumbaiAlchemy = new Alchemy(mumbaiSettings)

export const getERC20Balances = async (address: string) => {
  const balances = [
    { chainId: CHAIN_IDS[CHAIN_TYPE.GOERLI], usdc: 0, usdt: 0 },
    { chainId: CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET], usdc: 0, usdt: 0 },
    { chainId: CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET], usdc: 0, usdt: 0 },
    { chainId: CHAIN_IDS[CHAIN_TYPE.MUMBAI], usdc: 0, usdt: 0 },
  ]
  try {
    const ethBalance = await ethAlchemy.core.getTokenBalances(address, [USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]], USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]])
    if (ethBalance && ethBalance.tokenBalances.length > 0) {
      for (const tokenBalance of ethBalance.tokenBalances) {
        if (tokenBalance.contractAddress === USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[0].usdc = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        } else if (tokenBalance.contractAddress === USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[0].usdt = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        }
      }
    }
  } catch (e) {
    console.error(e)
  }

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

  try {
    const mumbaiBalance = await mumbaiAlchemy.core.getTokenBalances(address, [USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.MUMBAI]], USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.MUMBAI]]])
    if (mumbaiBalance && mumbaiBalance.tokenBalances.length > 0) {
      for (const tokenBalance of mumbaiBalance.tokenBalances) {
        if (tokenBalance.contractAddress === USDC_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[3].usdc = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        } else if (tokenBalance.contractAddress === USDT_ADDRESS[CHAIN_IDS[CHAIN_TYPE.GOERLI]]) {
          balances[3].usdt = tokenBalance.tokenBalance ? parseFloat(tokenBalance.tokenBalance) : 0
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  return balances
}
