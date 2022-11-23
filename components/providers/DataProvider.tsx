import { ReactNode } from 'react'
import { DataContext } from '../../contexts/data'
import useBalances from '../../hooks/useBalances'
import useCollections from '../../hooks/useCollections'
import useProfile from '../../hooks/useProfile'
import useWallet from '../../hooks/useWallet'
import useMultiChainBalances from '../../hooks/useMultiChainBalances'

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
  const { collections, refreshCollections } = useCollections()

  return (
    <DataContext.Provider
      value={{
        balances,
        profile,
        userNfts,
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
