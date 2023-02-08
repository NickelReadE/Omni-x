import React, {useState} from 'react'
import {PendingTxType} from '../../contexts/contract'
import {getBlockExplorer, getChainIcons} from '../../utils/constants'

type ProcessingTransactionProps = {
  txInfo: PendingTxType
}

const ProcessingTransaction = ({ txInfo }: ProcessingTransactionProps): JSX.Element => {
  const [hovered, setHovered] = useState(false)
  // const [targetHovered, setTargetHovered] = useState(false)
  // const [lastHovered, setLastHovered] = useState(false)

  const onViewExplorer = () => {
    if (txInfo && txInfo.lzPath) {
      window.open(txInfo.lzPath)
    } else if (txInfo && txInfo.txHash && txInfo.senderChainId && hovered) {
      const explorer = getBlockExplorer(txInfo.senderChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.txHash}`, '_blank')
      }
    }
  }

  // const onViewExplorerOnDest = () => {
  //   if (txInfo && txInfo.destTxHash && txInfo.targetChainId && targetHovered) {
  //     const explorer = getBlockExplorer(txInfo.targetChainId)
  //     if (explorer) {
  //       window.open(`${explorer}/tx/${txInfo.destTxHash}`, '_blank')
  //     }
  //   }
  // }

  // const onViewExplorerOnLast = () => {
  //   if (txInfo && txInfo.lastTxHash && txInfo.targetChainId && lastHovered) {
  //     const explorer = getBlockExplorer(txInfo.targetChainId)
  //     if (explorer) {
  //       window.open(`${explorer}/tx/${txInfo.lastTxHash}`, '_blank')
  //     }
  //   }
  // }

  const onHover = (type: 'sender' | 'target' | 'last') => {
    if (type === 'sender') {
      setHovered(true)
    } else if (type === 'last') {
      // setLastHovered(true)
    } else {
      // setTargetHovered(true)
    }
  }

  const onLeave = (type: 'sender' | 'target' | 'last') => {
    if (type === 'sender') {
      setHovered(false)
    } else if (type === 'last') {
      // setLastHovered(false)
    } else {
      // setTargetHovered(false)
    }
  }

  const txDone = txInfo.type === 'gaslessMint' ? !!txInfo.txHash : (txInfo.txHash && txInfo.destTxHash)
  const renderContent = (txInfo: PendingTxType) => {
    return (
      <div className='flex items-center justify-between px-3'>
        <span className="bg-repost-gradient bg-clip-text text-transparent w-[35px] truncate text-[14px] leading-[18px] font-bold">
          {txInfo.type === 'bridge' && 'xfer:'}
          {txInfo.type === 'buy' && 'buy:'}
          {txInfo.type === 'accept' && 'sell:'}
          {txInfo.type === 'gaslessMint' && 'mint:'}
        </span>
        {txInfo.lzPath ? (
          <img
            onMouseEnter={() => onHover('sender')}
            onMouseLeave={() => onLeave('sender')}
            src={hovered ? getChainIcons(txInfo.senderChainId).explorer : 'images/chain/lz_icon.svg'}
            style={{ cursor: (hovered) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.txHash) ? 1 : 0.4 }}
            alt="chain icon"
            width={20}
            height={20}
            onClick={onViewExplorer}
          />
        ) : (
          <img
            onMouseEnter={() => onHover('sender')}
            onMouseLeave={() => onLeave('sender')}
            src={hovered ? getChainIcons(txInfo.senderChainId).explorer : getChainIcons(txInfo.senderChainId).icon}
            style={{ cursor: (hovered) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.txHash) ? 1 : 0.4 }}
            alt="chain icon"
            width={20}
            height={20}
            onClick={onViewExplorer}
          />
        )}
        {/* {txInfo.type != 'gaslessMint' && (<>
          <div className={'w-4 h-4 flex items-center justify-center'}>
            <img src={'/images/icons/arrow_right.svg'} alt="arrowRight" />
          </div>
          <img
            width={20}
            height={20}
            onMouseEnter={() => onHover('target')}
            onMouseLeave={() => onLeave('target')}
            src={(targetHovered && txInfo.destTxHash) ? getChainIcons(txInfo.targetChainId).explorer : getChainIcons(txInfo.targetChainId).icon}
            style={{ cursor: (txInfo && txInfo.destTxHash) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.destTxHash) ? 1 : 0.4 }}
            onClick={onViewExplorerOnDest}
            alt="chain icon"
          />
        </>)}
        {txInfo.lastTxAvailable && (<>
          <Image src={arrowRight} alt="arrowRight" />
          <img
            width={20}
            height={20}
            onMouseEnter={() => onHover('last')}
            onMouseLeave={() => onLeave('last')}
            src={(lastHovered && txInfo.lastTxHash) ? getChainIcons(txInfo.targetChainId).explorer : getChainIcons(txInfo.targetChainId).icon}
            style={{ cursor: (txInfo && txInfo.lastTxHash) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.lastTxHash) ? 1 : 0.4 }}
            onClick={onViewExplorerOnLast}
            alt="chain icon"
          />
        </>)} */}
        <span className="text-md text-primary-light ml-1 w-[120px] truncate">{txInfo?.itemName}</span>
        {txDone && <img src='images/tx_check.svg' alt='tx check'/>}
      </div>
    )
  }

  return (
    <>
      <div className={'rounded-lg w-full h-[40px] md:order-2 mr-[70px] flex flex-col justify-center py-2'}>
        { txInfo.type === 'bridge' && renderContent(txInfo) }
        { txInfo.type === 'buy' && renderContent(txInfo) }
        { txInfo.type === 'accept' && renderContent(txInfo) }
        { txInfo.type === 'gaslessMint' && renderContent(txInfo) }
      </div>
    </>
  )
}

export default ProcessingTransaction
