import React, {useState, useMemo} from 'react'
import Image from 'next/image'
import {ethers} from 'ethers'
import {Dialog} from '@material-ui/core'
import {NFTItem} from '../../interface/interface'
import PngCheck from '../../public/images/check.png'
import useWallet from '../../hooks/useWallet'
import SpinLoader from '../collections/SpinLoader'
import {chainInfos, CHAIN_IDS, getBlockExplorer} from '../../utils/constants'
import {CHAIN_TYPE} from '../../types/enum'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import {createStyles, makeStyles} from '@material-ui/core/styles'
import NetworkSelect from './NetworkSelect'

export enum ConfirmTransferStatus {
  APPROVING,
  TRANSFERRING,
  DONE,
}

interface IConfirmTransferProps {
  nft?: NFTItem,
  open: boolean,
  image: string,
  collectionName: string,
  onClose: () => void,
  updateModal: (status: boolean) => void,
}

const useStyles = makeStyles(() =>
  createStyles({
    rootContent: {
      padding: '16px 40px 32px 40px'
    },
    dlgWidth: {
      maxWidth: 500,
      width: '800px',
      background: 'rgba(22, 22, 22, 0.9)',
      boxShadow: '0px 0px 250px #000000',
      backdropFilter: 'blur(10px)',
      borderRadius: 8
    }
  }),
)

const ConfirmTransfer: React.FC<IConfirmTransferProps> = ({
  nft,
  open,
  image,
  collectionName,
  onClose,
  updateModal,
}) => {
  const { chainId } = useWallet()
  const classes = useStyles()

  const [status, setStatus] = useState<ConfirmTransferStatus | undefined>(undefined)
  const [estimatedFee, setEstimatedFee] = useState<string>('0')
  const [target, setTarget] = useState<string>('me')
  const [networkOption, setNetworkOption] = useState<any>()

  const explorer = getBlockExplorer(chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI])

  const senderChain = chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI]

  const targetChainId = useMemo(() => {
    if (networkOption) {
      return networkOption.value
    }
  }, [networkOption])

  const approveTxHash = useMemo(() => {
    return ''
  }, [nft])

  const approveTxHashLink = useMemo(() => {
    return approveTxHash && `${explorer}/tx/${approveTxHash}`
  }, [approveTxHash, explorer])

  const onTransfer = () => {
    console.log('onTransfer')
  }

  return (
    <Dialog open={open} onClose={onClose}  aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={'py-6 px-10 m-0'}>
        <div className="mt-5">
          <div className="text-primary-light text-xg2 font-bold">send item</div>
        </div>
      </DialogTitle>
      <DialogContent className={classes.rootContent}>
        <div className='flex flex-col justify-between'>
          <div className={'flex justify-center'}>
            <div className={'flex flex-col'}>
              <div className={'bg-primary-gradient p-[1px] rounded'}>
                <img alt={'nftImage'} className='bg-primary rounded' width={190} height={190} src={image} />
              </div>
              <p className={'text-primary-light mt-3'}>#{nft?.token_id}</p>
              <p className='text-secondary font-medium'>{collectionName}</p>
            </div>
          </div>
        </div>
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
          {/*body*/}
          <div className="relative px-8 flex-auto">
            {
              status === undefined ? (
                <>
                  <div className={'flex mt-5'}>
                    <span className={'font-medium text-primary-light text-md mr-6 h-6 flex items-center'}>to:</span>
                    <div className={'flex flex-col w-full'}>
                      <div className={'flex'}>
                        <span className={`cursor-pointer border-[1px] rounded-full h-6 px-2 flex items-center justify-center text-md font-medium ${target === 'me' ? 'text-primary-green border-primary-green' : 'text-secondary border-secondary'}`} onClick={() => setTarget('me')}>me</span>
                        <span className={`cursor-pointer border-[1px] rounded-full h-6 px-2 flex items-center justify-center text-md font-medium  ${target === 'other' ? 'text-primary-green border-primary-green' : 'text-secondary border-secondary'} ml-2`} onClick={() => setTarget('other')}>other</span>
                      </div>
                      {
                        target === 'other' && (
                          <div className={'flex w-full mt-3'}>
                            <input className={'w-full bg-transparent rounded-full text-primary-light text-md border-[1px] border-secondary pl-4 h-6'} placeholder={'enter address...'} />
                          </div>
                        )
                      }
                      <div className={'mt-3'}>
                        <NetworkSelect value={networkOption} onChange={(value: any) => setNetworkOption(value)} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-primary-light text-md font-medium mt-2">
                    <span className={'mr-3'}>gas cost:</span>
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
          <div className="mt-20 flex justify-center">
            {(status !== undefined) ? (
              <button
                className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
                disabled={status !== ConfirmTransferStatus.DONE}
                onClick={() => updateModal(false)}>
                  close
              </button>
            ) : (
              <button
                className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
                onClick={onTransfer}>
                  send
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmTransfer
