import { useState, ReactNode, useEffect } from 'react'
import { ProgressContext } from '../../contexts/progress'
import useWallet from '../../hooks/useWallet'
import {PendingTxType} from '../../contexts/contract'

type ProgressProviderProps = {
  children?: ReactNode
}

export const ProgressProvider = ({
  children,
}: ProgressProviderProps): JSX.Element => {
  const [histories, setHistories] = useState<PendingTxType[]>([])
  const { address, provider } = useWallet()

  const addTxToHistories = (txInfo: PendingTxType): number => {
    const newHistories = [...histories, txInfo]
    setHistories(newHistories)
    localStorage.setItem('txHistories', JSON.stringify(newHistories))
    return newHistories.length - 1
  }

  const updateHistory = (historyIndex: number, txInfo: PendingTxType) => {
    if (histories.length > historyIndex) {
      const newHistories = [...histories]
      newHistories[historyIndex] = txInfo
      setHistories(newHistories)
      localStorage.setItem('txHistories', JSON.stringify(newHistories))
    } else {
      addTxToHistories(txInfo)
    }
  }

  const clearHistories = () => {
    setHistories([])
    localStorage.removeItem('txHistories')
  }

  useEffect(() => {
    (async () => {
      const allHistories = localStorage.getItem('txHistories')
      const txInfos = allHistories ? JSON.parse(allHistories) : []
      setHistories(txInfos)
    })()
  }, [address, provider])

  return (
    <ProgressContext.Provider
      value={{
        histories,
        addTxToHistories,
        updateHistory,
        clearHistories,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
