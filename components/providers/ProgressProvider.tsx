/* eslint-disable react-hooks/exhaustive-deps */

import { useState, ReactNode, useEffect } from 'react'
import { ProgressContext } from '../../contexts/progress'
import useWallet from '../../hooks/useWallet'
import { PendingTxType}  from '../../contexts/contract'
import { createClient } from '@layerzerolabs/scan-client'

// const LZ_ENV = process ? (process.env as any)['LZ_ENV'] : 'testnet'
const client = createClient('testnet')

type ProgressProviderProps = {
  children?: ReactNode
}

export const ProgressProvider = ({
  children,
}: ProgressProviderProps): JSX.Element => {
  const [histories, setHistories] = useState<PendingTxType[]>([])
  const [pending, setPending] = useState<boolean>(false)
  const { address, provider } = useWallet()

  const addTxToHistories = async (txInfo: PendingTxType): Promise<number> => {
    if (txInfo.senderChainId && txInfo.targetChainId && txInfo.senderChainId != txInfo.targetChainId) {
      txInfo.lzPath = 'https://testnet.layerzeroscan.com'
    }

    const newHistories = [...histories, txInfo]
    
    setHistories(newHistories)
    localStorage.setItem('txHistories', JSON.stringify(newHistories))
    return newHistories.length - 1
  }

  const updateLzScanStatus = () => {
    const isTxCross = (txInfo: PendingTxType) => (txInfo.senderChainId && txInfo.targetChainId && txInfo.senderChainId != txInfo.targetChainId)

    histories.filter(txInfo => isTxCross(txInfo) && (!txInfo.lzPath || txInfo.lzPath === 'https://testnet.layerzeroscan.com'))
      .forEach(async (txInfo) => {
        const lzTxInfo = await client.getMessagesBySrcTxHash(txInfo.txHash || txInfo.destTxHash || '')

        if (lzTxInfo.messages.length > 0) {
          const lzMsg = lzTxInfo.messages[0]
          txInfo.lzPath = `https://testnet.layerzeroscan.com/${lzMsg.srcChainId}/address/${lzMsg.srcUaAddress}/message/${lzMsg.dstChainId}/address/${lzMsg.dstUaAddress}/nonce/${lzMsg.srcUaNonce}`

          await updateHistory(histories.indexOf(txInfo), txInfo)
        }
      })
  }

  const updateHistory = async (historyIndex: number, txInfo: PendingTxType) => {
    if (histories.length > historyIndex) {
      const newHistories = [...histories]
      newHistories[historyIndex] = txInfo
      setHistories(newHistories)
      localStorage.setItem('txHistories', JSON.stringify(newHistories))
    } else {
      await addTxToHistories(txInfo)
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

  useEffect(() => {
    setPending(histories.filter(
      (history) => history.lastTxAvailable
        ? (!history.txHash || !history.destTxHash || !history.lastTxHash)
        : history.type === 'gaslessMint' ? !history.txHash
          : (!history.txHash || !history.destTxHash)
    ).length > 0)

    const timerId = setInterval(updateLzScanStatus, 5000)

    return () => {
      clearInterval(timerId)
    }
  }, [histories])

  return (
    <ProgressContext.Provider
      value={{
        histories,
        pending,
        setPending,
        addTxToHistories,
        updateHistory,
        clearHistories,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
