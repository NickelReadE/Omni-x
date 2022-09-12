import React, {useEffect, useState} from 'react'
import {PendingTxType} from '../../contexts/contract'
import Image from 'next/image'
import arrowRight from '../../public/images/arrowRight.png'
import {getBlockExplorer, getChainIcons} from '../../utils/constants'

type ProcessingTransactionProps = {
  txInfo: PendingTxType
}

const ProcessingTransaction = ({ txInfo }: ProcessingTransactionProps): JSX.Element => {
  const [pending, setPending] = useState(true)

  const onViewExplorer = () => {
    if (txInfo && txInfo.txHash && txInfo.senderChainId) {
      const explorer = getBlockExplorer(txInfo.senderChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.txHash}`, '_blank')
      }
    }
  }

  const onViewExplorerOnDest = () => {
    if (txInfo && txInfo.destTxHash && txInfo.targetChainId) {
      const explorer = getBlockExplorer(txInfo.targetChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.destTxHash}`, '_blank')
      }
    }
  }

  useEffect(() => {
    setPending(!txInfo.destTxHash)
  }, [txInfo])

  return (
    <>
      <div className={'rounded-[8px] w-[250px] md:order-2 mr-[70px] px-4 flex flex-col justify-center py-2'}>
        {
          txInfo?.type === 'bridge'
            ?
            <div className='flex items-center justify-between'>
              <Image src={getChainIcons(txInfo.senderChainId).explorer} alt="chain icon" width={18} height={18} style={{ cursor: 'pointer' }} onClick={onViewExplorer} />
              <Image src={getChainIcons(txInfo.senderChainId).icon} alt="chain icon" width={18} height={18} />
              <Image src={arrowRight} alt="arrowRight" />
              <Image src={getChainIcons(txInfo.targetChainId).icon} alt="chain icon" width={18} height={18} />
              <Image
                src={getChainIcons(txInfo.targetChainId).explorer}
                width={18}
                height={18}
                style={{ cursor: (txInfo && txInfo.destTxHash) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.destTxHash) ? 1 : 0.4 }}
                onClick={onViewExplorerOnDest}
                alt="chain icon"
              />
              <span className="text-md text-gray-500 w-[90px] truncate">{txInfo?.itemName}</span>
            </div>
            :
            <div />
        }
      </div>
    </>
  )
}

export default ProcessingTransaction
