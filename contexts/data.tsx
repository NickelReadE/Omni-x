import { createContext } from 'react'
import { BalancesInformation } from '../hooks/useBalances'
import { ProfileData } from '../hooks/useProfile'
import { NFTItem } from '../interface/interface'

export type DataContextType = {
    balances: BalancesInformation,
    profile: ProfileData | undefined,
    userNfts: Array<NFTItem>,
    refreshBalance: () => void,
    refreshUserNfts: () => void,
    onFaucet: () => void,
}

export const DataContext = createContext<DataContextType>({
  balances: {
    omni: 0,
    usdc: 0,
    usdt: 0
  },
  profile: undefined,
  userNfts: [],
  refreshUserNfts: () => undefined,
  refreshBalance: () => undefined,
  onFaucet: () => undefined,
})
