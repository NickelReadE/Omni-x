import {useEffect, useMemo, useState} from 'react'
import useWallet from './useWallet'
import {getUserBalances} from '../services/moralis'
import {getERC20Balances} from '../services/alchemy'

export type Balances = {
  chainId: number,
  usdc: number,
  usdt: number,
}

type BalancesType = {
  balances: Balances[],
  usdcAvailableChainIds: number[],
  usdtAvailableChainIds: number[],
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
    return balances.filter(b => b.usdc > 0).map(b => b.chainId)
  }, [balances])

  const usdtAvailableChainIds = useMemo(() => {
    return balances.filter(b => b.usdt > 0).map(b => b.chainId)
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
        setBalances([...moralisBalances, ...alchemyBalances])
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
