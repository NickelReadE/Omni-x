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
  const { balances, updateRefresh: refreshBalance } = useBalances()
  const { profile, nfts: userNfts, refreshNfts: refreshUserNfts } = useProfile(address)

  return (
    <DataContext.Provider
      value={{
        balances,
        refreshBalance,
        profile,
        userNfts,
        refreshUserNfts
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
