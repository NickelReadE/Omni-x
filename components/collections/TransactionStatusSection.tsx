import React from 'react'
import useWallet from '../../hooks/useWallet'
import { getBlockExplorer } from '../../utils/constants'

interface ITransactionStatusSectionProps {
  processing: boolean,
  txHash?: string,
  isTx: boolean
}

const TransactionStatusSection: React.FC<ITransactionStatusSectionProps> = ({
  processing,
  txHash,
  isTx
}) => {
  const { chainId } = useWallet()
  const explorer = getBlockExplorer(chainId)
  const txHashLink = txHash && `${explorer}/tx/${txHash}`

  return (
    <div className="tx-status-section">
      {isTx && (<>
        <div className="tx-status-row">
          <p className="tx-status-name">transaction status:</p>
          <p className="tx-status-value">{processing ? 'confirming...' : 'done'}</p>
        </div>
        
        <div className="tx-status-row">
          <p className="tx-status-name">transaction record:</p>
          <a className="tx-status-value tx-hash-ellipsis" href={txHashLink} target="_blank" rel="noreferrer">{txHash || ''}</a>
        </div>
      </>)}

      {!isTx && (<>
        <div className="tx-status-row">
          <p className="tx-status-name">action status:</p>
          <p className="tx-status-value">{processing ? 'waiting...' : 'done'}</p>
        </div>
      </>)}
      
    </div>
  )
}

export default TransactionStatusSection
