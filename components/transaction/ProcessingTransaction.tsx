import React, {useEffect, useState} from 'react'
import {PendingTxType} from '../../contexts/contract'
import Image from 'next/image'
import loading from '../../public/images/loading.gif'
import clear from '../../public/images/clear.png'
import viewExplorer from '../../public/images/viewExplorer.png'
import ethereum from '../../public/sidebar/ethereum_small.png'
import binance from '../../public/sidebar/binance_small.png'
import avax from '../../public/sidebar/avax_small.png'
import polygon from '../../public/sidebar/polygon_small.png'
import arbitrum from '../../public/sidebar/arbitrum_small.png'
import optimism from '../../public/sidebar/optimism_small.png'
import fantom from '../../public/sidebar/fantom_small.png'
import arrowRight from '../../public/images/arrowRight.png'
import {getBlockExplorer} from '../../utils/constants'

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
      <div className={'rounded-[8px] w-[250px] md:order-2 mr-[70px] px-4 flex flex-col justify-center shadow-md py-4'}>
        <div className="flex items-center justify-between">
          <span className="text-lg">{pending ? 'processing' : 'last transaction'}</span>
          {
            !(txInfo && txInfo.destTxHash)
              ?
              <Image src={loading} alt="loading" width={30} height={30} />
              :
              <Image src={clear} alt="clear" width={30} height={30} style={{ cursor: 'pointer' }} />
          }
        </div>
        {
          txInfo?.type === 'bridge'
            ?
            <div className='flex items-center justify-between'>
              <Image src={viewExplorer} alt="view Explorer" width={20} height={20} style={{ cursor: 'pointer' }} onClick={onViewExplorer} />
              {
                (txInfo?.senderChainId === 4 || txInfo?.senderChainId === 4) &&
                  <Image src={ethereum} alt="ethereum" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 97 || txInfo?.senderChainId === 97) &&
                  <Image src={binance} alt="binance" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 43113 || txInfo?.senderChainId === 43113) &&
                  <Image src={avax} alt="avax" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 80001 || txInfo?.senderChainId === 80001) &&
                  <Image src={polygon} alt="polygon" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 421611 || txInfo?.senderChainId === 421611) &&
                  <Image src={arbitrum} alt="arbitrum" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 69 || txInfo?.senderChainId === 69) &&
                  <Image src={optimism} alt="optimism" width={20} height={20} />
              }
              {
                (txInfo?.senderChainId === 4002 || txInfo?.senderChainId === 4002) &&
                  <Image src={fantom} alt="fantom" width={20} height={20} />
              }
              <Image src={arrowRight} alt="arrowRight" />
              {
                (txInfo?.targetChainId === 4 || txInfo?.targetChainId === 4) &&
                  <Image src={ethereum} alt="ethereum" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 97 || txInfo?.targetChainId === 97) &&
                  <Image src={binance} alt="binance" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 43113 || txInfo?.targetChainId === 43113) &&
                  <Image src={avax} alt="avax" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 80001 || txInfo?.targetChainId === 80001) &&
                  <Image src={polygon} alt="polygon" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 421611 || txInfo?.targetChainId === 421611) &&
                  <Image src={arbitrum} alt="arbitrum" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 69 || txInfo?.targetChainId === 69) &&
                  <Image src={optimism} alt="optimism" width={20} height={20} />
              }
              {
                (txInfo?.targetChainId === 4002 || txInfo?.targetChainId === 4002) &&
                  <Image src={fantom} alt="fantom" width={20} height={20} />
              }
              <Image
                src={viewExplorer}
                alt="view Explorer"
                width={20}
                height={20}
                style={{ cursor: (txInfo && txInfo.destTxHash) ? 'pointer' : 'auto', opacity: (txInfo && txInfo.destTxHash) ? 1 : 0.4 }}
                onClick={onViewExplorerOnDest}
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
