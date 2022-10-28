import { useContext } from 'react'
import { DataContext, DataContextType } from '../contexts/data'

const useData = (): DataContextType => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within an WalletProvider')
  }
  return context
}

export default useData
