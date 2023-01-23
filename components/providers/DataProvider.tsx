import {createContext, ReactNode} from 'react'
import useBalances, {BalancesInformation} from '../../hooks/useBalances'
import useCollections from '../../hooks/useCollections'
import useProfile, {ProfileData} from '../../hooks/useProfile'
import useWallet from '../../hooks/useWallet'
import useMultiChainBalances, {ChainBalanceType} from '../../hooks/useMultiChainBalances'
import {NFTItem} from '../../interface/interface'
import {FullCollectionType} from '../../types/collections'

export type DataContextType = {
  balances: BalancesInformation,
  profile: ProfileData | undefined,
  userNfts: Array<NFTItem>,
  isCollectionLoading: boolean,
  collections: FullCollectionType[],
  isLoadingNfts: boolean,
  totalUSDCBalance: number,
  totalUSDTBalance: number,
  usdcAvailableChainIds: ChainBalanceType[],
  usdtAvailableChainIds: ChainBalanceType[],
  refreshBalance: () => void,
  refreshUserNfts: () => void,
  refreshProfile: () => void,
  refreshCollections: () => void,
  updateProfileData: (e: FormData) => void,
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
  isCollectionLoading: false,
  collections: [],
  isLoadingNfts: false,
  totalUSDCBalance: 0,
  totalUSDTBalance: 0,
  usdcAvailableChainIds: [],
  usdtAvailableChainIds: [],
  refreshUserNfts: () => undefined,
  refreshBalance: () => undefined,
  refreshProfile: () => undefined,
  refreshCollections: () => undefined,
  updateProfileData: () => undefined,
  onFaucet: () => undefined,
})

type DataProviderProps = {
  children?: ReactNode
}

export const DataProvider = ({
  children,
}: DataProviderProps): JSX.Element => {
  const { address } = useWallet()
  const { balances, updateRefresh: refreshBalance, faucet: onFaucet } = useBalances()
  const { totalUSDCBalance, totalUSDTBalance, usdcAvailableChainIds, usdtAvailableChainIds } = useMultiChainBalances()
  const { profile, isLoading: isLoadingNfts, nfts: userNfts, refreshNfts: refreshUserNfts, refreshProfile, updateProfileData } = useProfile(address)
  const { loading: isCollectionLoading, collections, refreshCollections } = useCollections()

  return (
    <DataContext.Provider
      value={{
        balances,
        profile,
        userNfts,
        isCollectionLoading,
        collections,
        isLoadingNfts,
        totalUSDCBalance,
        totalUSDTBalance,
        usdcAvailableChainIds,
        usdtAvailableChainIds,
        onFaucet,
        refreshBalance,
        refreshUserNfts,
        refreshProfile,
        refreshCollections,
        updateProfileData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
