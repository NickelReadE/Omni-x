import { ReactNode } from 'react'
import { DataContext } from '../../contexts/data'
import useBalances from '../../hooks/useBalances'
import useProfile from '../../hooks/useProfile'
import useWallet from '../../hooks/useWallet'

type DataProviderProps = {
  children?: ReactNode
}

export const DataProvider = ({
  children,
}: DataProviderProps): JSX.Element => {
  const { address } = useWallet()
  const { balances, updateRefresh: refreshBalance, faucet: onFaucet } = useBalances()
  const { profile, refreshProfile, updateProfileData, nfts: userNfts, refreshNfts: refreshUserNfts } = useProfile(address)

  return (
    <DataContext.Provider
      value={{
        balances,
        profile,
        userNfts,
        onFaucet,
        refreshBalance,
        refreshUserNfts,
        refreshProfile,
        updateProfileData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
