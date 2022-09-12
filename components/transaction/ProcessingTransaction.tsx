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
  const [hovered, setHovered] = useState(false)
  const [targetHovered, setTargetHovered] = useState(false)

  const onViewExplorer = () => {
    if (txInfo && txInfo.txHash && txInfo.senderChainId && hovered) {
      const explorer = getBlockExplorer(txInfo.senderChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.txHash}`, '_blank')
      }
    }
  }

  const onViewExplorerOnDest = () => {
    if (txInfo && txInfo.destTxHash && txInfo.targetChainId && targetHovered) {
      const explorer = getBlockExplorer(txInfo.targetChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.destTxHash}`, '_blank')
      }
    }
  }

  useEffect(() => {
    setPending(!txInfo.destTxHash)
  }, [txInfo])

  const onHover = (type: 'sender' | 'target') => {
    if (type === 'sender') {
      setHovered(true)
    } else {
      setTargetHovered(true)
    }
  }
  
  const onLeave = (type: 'sender' | 'target') => {
    if (type === 'sender') {
      setHovered(false)
    } else {
      setTargetHovered(false)
    }
  }
  
  return (
    <>
      <div className={'rounded-[8px] w-[250px] md:order-2 mr-[70px] px-4 flex flex-col justify-center py-2'}>
        {
          txInfo?.type === 'bridge'
            ?
            <div className='flex items-center justify-between'>
              <Image
                onMouseEnter={() => onHover('sender')}
                onMouseLeave={() => onLeave('sender')}
                src={hovered ? getChainIcons(txInfo.senderChainId).explorer : getChainIcons(txInfo.senderChainId).icon}
                alt="chain icon"
                width={18}
                height={18}
                onClick={onViewExplorer}
              />
              <Image src={arrowRight} alt="arrowRight" />
              <Image
                width={18}
                height={18}
                onMouseEnter={() => onHover('target')} onMouseLeave={() => onLeave('target')}
                src={(targetHovered && txInfo.destTxHash) ? getChainIcons(txInfo.targetChainId).explorer : getChainIcons(txInfo.targetChainId).icon}
                style={{ cursor: (txInfo && txInfo.destTxHash) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.destTxHash) ? 1 : 0.4 }}
                onClick={onViewExplorerOnDest}
                alt="chain icon"
              />
              <span className="text-md text-gray-500 w-[150px] truncate">{txInfo?.itemName}</span>
            </div>
            :
            <div />
        }
      </div>
    </>
  )
}

export default ProcessingTransaction
