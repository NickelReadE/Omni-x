import {useEffect, useMemo, useState} from 'react'
import useWallet from './useWallet'
import {getUserBalances} from '../services/moralis'
import {getERC20Balances} from '../services/alchemy'
import {getERC20BalanceFromDirectCall} from '../services/erc20'

export type Balances = {
  chainId: number,
  usdc: number,
  usdt: number,
}

export type ChainBalanceType = {
  chainId: number,
  balance: number,
}

type BalancesType = {
  balances: Balances[],
  usdcAvailableChainIds: ChainBalanceType[],
  usdtAvailableChainIds: ChainBalanceType[],
  totalUSDCBalance: number,
  totalUSDTBalance: number,
  updateRefresh: () => void,
}

const useMultiChainBalances = (): BalancesType => {
  const { address } = useWallet()

  const [refresh, setRefresh] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balances[]>([])

  const updateRefresh = () => {
    setRefresh(!refresh)
  }

  const usdcAvailableChainIds = useMemo(() => {
    return balances.filter(b => b.usdc > 0).map(b => {
      return {
        chainId: b.chainId,
        balance: b.usdc
      }
    })
  }, [balances])

  const usdtAvailableChainIds = useMemo(() => {
    return balances.filter(b => b.usdt > 0).map(b => {
      return {
        chainId: b.chainId,
        balance: b.usdt
      }
    })
  }, [balances])

  const totalUSDCBalance = useMemo(() => {
    return balances.reduce((acc, cur) => acc + cur.usdc, 0)
  }, [balances])

  const totalUSDTBalance = useMemo(() => {
    return balances.reduce((acc, cur) => acc + cur.usdt, 0)
  }, [balances])

  useEffect(() => {
    (async () => {
      if (address) {
        const moralisBalances = await getUserBalances(address)
        const alchemyBalances = await getERC20Balances(address)
        const directBalances = await getERC20BalanceFromDirectCall(address)
        setBalances([...moralisBalances, ...alchemyBalances, ...directBalances])
      }
    })()
  }, [address, refresh])

  return {
    balances,
    totalUSDCBalance,
    totalUSDTBalance,
    usdcAvailableChainIds,
    usdtAvailableChainIds,
    updateRefresh,
  }
}

export default useMultiChainBalances
