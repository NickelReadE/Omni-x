import {ethers} from 'ethers'
import {CHAIN_IDS, RPC_PROVIDERS} from '../utils/constants'
import {CHAIN_TYPE} from '../types/enum'
import {USDC_ADDRESS} from '../utils/constants/addresses'
import ERC20Abi from '../constants/abis/ERC20.json'

const chainIds = [
  CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET],
]

export const getERC20BalanceFromDirectCall = async (address: string) => {
  const balances = []
  for (const chainId of chainIds) {
    const provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDERS[chainId])
    const usdcInstance = new ethers.Contract(USDC_ADDRESS[chainId], ERC20Abi, provider)
    const decimal = await usdcInstance.decimals()
    const balance = await usdcInstance.balanceOf(address)
    const usdcFormattedBalance = parseFloat(ethers.utils.formatUnits(balance, decimal))
    const usdtInstance = new ethers.Contract(USDC_ADDRESS[chainId], ERC20Abi, provider)
    const usdtDecimal = await usdtInstance.decimals()
    const usdtBalance = await usdtInstance.balanceOf(address)
    const usdtFormattedBalance = parseFloat(ethers.utils.formatUnits(usdtBalance, usdtDecimal))
    balances.push({
      chainId: chainId,
      usdc: usdcFormattedBalance,
      usdt: usdtFormattedBalance,
    })
  }
  return balances
}
