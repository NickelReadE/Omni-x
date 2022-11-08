import React, {useState, useMemo} from 'react'
import LazyLoad from 'react-lazyload'
import Image from 'next/image'
import {BigNumber, ethers} from 'ethers'
import {NFTItem} from '../../interface/interface'
import PngCheck from '../../public/images/check.png'
import useWallet from '../../hooks/useWallet'
import SpinLoader from '../collections/SpinLoader'
import {chainInfos, CHAIN_IDS, getBlockExplorer} from '../../utils/constants'
import { CHAIN_TYPE } from '../../types/enum'

export enum ConfirmTransferStatus {
  APPROVING,
  TRANSFERRING,
  DONE,
}

interface IConfirmTransferProps {
  updateModal: (status: boolean) => void,
  onTransfer: () => void,
  status: ConfirmTransferStatus | undefined,
  approveTxHash: string | undefined,
  selectedNFTItem?: NFTItem,
  senderChain: number,
  targetChain: number,
  estimatedFee: BigNumber,
  image: string
}

const ConfirmTransfer: React.FC<IConfirmTransferProps> = ({
  updateModal,
  onTransfer,
  status,
  approveTxHash,
  selectedNFTItem,
  senderChain,
  targetChain,
  estimatedFee,
  image
}) => {
  const { chainId } = useWallet()

  const [imageError, setImageError] = useState(false)
  const explorer = getBlockExplorer(chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI])
  const approveTxHashLink = useMemo(() => {
    return approveTxHash && `${explorer}/tx/${approveTxHash}`
  }, [approveTxHash, explorer])

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <div className='w-[14px]'>&nbsp;</div>
              <h4 className="text-2xl font-semibold">
                Send Confirmation
              </h4>
              <button
                className="p-1 bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => updateModal(false)}
              >
                <span className="bg-transparent text-black text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative px-8 flex-auto">
              <p className="my-4 text-center text-slate-500 text-lg leading-relaxed">
                You are transferring this NFT:
              </p>
              <div className="flex flex-col items-center justify-center">
                <div className='w-[250px] h-[250px] rounded-sm'>
                  {
                    selectedNFTItem &&
                      <>
                        <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>} style={{ width: '100%', height: '100%' }}>
                          <img className="rounded-[8px]" src={imageError ? '/images/omnix_logo_black_1.png' : image} style={{ width: '100%', height: '100%' }} alt="nft-image" onError={() => {
                            setImageError(true)
                          }} data-src={image}/>
                        </LazyLoad>
                      </>
                  }
                </div>
                {
                  selectedNFTItem &&
                    <div className='my-2 flex items-center justify-center w-[250px]'>
                      {
                        selectedNFTItem.name !== '' &&
                          <p className="mr-3 text-md text-center text-slate-500 leading-relaxed">
                            {selectedNFTItem.name}
                          </p>
                      }
                      <p className="text-md text-center text-slate-500 leading-relaxed">
                        {`#${selectedNFTItem.token_id}`}
                      </p>
                    </div>
                }
              </div>
              {
                status === undefined ? (
                  <>
                    <div className="flex items-center justify-around mt-1">
                      <div className="flex flex-col">
                        <p>From:</p>
                        <div className="flex flex-col items-center px-[15px] py-[10px] bg-[#F6F8FC] rounded-md border-2 border-[#E9ECEF] min-w-[95px] min-h-[78px]">
                          <p>
                            <img src={chainInfos[senderChain].logo} width={30} height={30} style={{ width: 30, height: 30 }} alt={'Sender chain'} />
                          </p>
                          <p>{chainInfos[senderChain].officialName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p>To:</p>
                        <div className="flex flex-col items-center px-[15px] py-[10px] bg-[#F6F8FC] rounded-md border-2 border-[#E9ECEF] min-w-[95px] min-h-[78px]">
                          <p>
                            <img src={chainInfos[targetChain].logo} width={30} height={30} style={{ width: 30, height: 30 }} alt={'Target chain'} />
                          </p>
                          <p>{chainInfos[targetChain].officialName}</p>
                        </div>
                      </div>
                    </div><div className="flex items-center justify-around my-5">
                      <p>Gas Cost:</p>
                      <p>{estimatedFee != undefined && ethers.utils.formatEther(estimatedFee)}&nbsp;{chainInfos[senderChain].currency}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`section-header ${status === ConfirmTransferStatus.APPROVING ? 'active' : ''}`}>
                      <p className="section-no">1</p>
                      <p className="section-title">Approve Collection</p>
                      {status === ConfirmTransferStatus.TRANSFERRING && (
                        <Image src={PngCheck} alt="completed" width={18} height={18}/>
                      )}
                      {status === ConfirmTransferStatus.APPROVING && (
                        <SpinLoader />
                      )}
                    </div>
                    <div className="tx-status-section">
                      {status === ConfirmTransferStatus.APPROVING && (<>
                        <div className="text-md w-[250px] leading-18">
                          <p className="">Please confirm the transaction in your wallet to begin transfer.</p>
                        </div>
                          
                        <div className="tx-status-row">
                          <p className="tx-status-name">transaction status:</p>
                          <p className="tx-status-value">{status === ConfirmTransferStatus.APPROVING ? 'confirming...' : 'done'}</p>
                        </div>
                      
                        <div className="tx-status-row">
                          <p className="tx-status-name">transaction record:</p>
                          <a className="tx-status-value tx-hash-ellipsis" href={approveTxHashLink} target="_blank" rel="noreferrer">{approveTxHash || ''}</a>
                        </div>
                      </>)}
                    </div>
                      
                    <div className={`section-header mt-3 ${status === ConfirmTransferStatus.TRANSFERRING ? 'active' : ''}`}>
                      <p className="section-no">2</p>
                      <p className="section-title">Complete Transfer</p>
                      {status === ConfirmTransferStatus.TRANSFERRING && (
                        <SpinLoader />
                      )}
                    </div>
                    <div className='tx-status-section mb-3'>
                      {status === ConfirmTransferStatus.TRANSFERRING && (<>
                        <div className="text-md w-[250px] leading-18">
                          <p className="">Please confirm the transaction in your wallet to complete the transfer.</p>
                        </div>
                      </>)}
                    </div>
                      
                    {status === ConfirmTransferStatus.DONE && 
                    <div className="mb-3 congrats-section" style={{marginTop: 12}}>
                      <p className="congrats-title">Congrats!</p>
                      <p className="congrats-description">your NFT is on the way</p>
                    </div>
                    }
                  </>
                )
              }
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
              {
                status === undefined ? (
                  <button
                    className="text-left bg-p-400 rounded-md px-6 py-3 text-white hover:bg-p-700 font-semibold hover:shadow-xl ease-linear active transition-all duration-150 disabled:opacity-50"
                    type="button"
                    onClick={() => onTransfer()}
                  >
                    Transfer
                  </button>
                ) : (
                  <button
                    className="text-left bg-p-400 rounded-md px-6 py-3 text-white hover:bg-p-700 font-semibold hover:shadow-xl ease-linear active transition-all duration-150 disabled:opacity-50"
                    type="button"
                    disabled={status !== ConfirmTransferStatus.DONE}
                    onClick={() => updateModal(false)}
                  >
                    Close
                  </button>
                )
              }
              
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default ConfirmTransfer
