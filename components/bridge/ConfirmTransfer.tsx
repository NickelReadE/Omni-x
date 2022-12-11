/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useMemo, useCallback, useEffect} from 'react'
import Image from 'next/image'
import {BigNumber, ethers} from 'ethers'
import { Dialog } from '@headlessui/react'
import {NFTItem} from '../../interface/interface'
import SpinLoader from '../collections/SpinLoader'
import {chainInfos, CHAIN_IDS, getBlockExplorer, getLayerzeroChainId, getProvider} from '../../utils/constants'
import {CHAIN_TYPE} from '../../types/enum'
import NetworkSelect from './NetworkSelect'
import useBridge from '../../hooks/useBridge'
import useWallet from '../../hooks/useWallet'
import useProgress from '../../hooks/useProgress'
import useContract from '../../hooks/useContract'
import {openSnackBar} from '../../redux/reducers/snackBarReducer'
import {
  decodeFromBytes, getERC1155Instance, getERC721Instance,
  getLayerZeroEndpointInstance, getOmnixBridge1155Instance, getOmnixBridgeInstance,
  getONFTCore1155Instance,
  getONFTCore721Instance
} from '../../utils/contracts'
import {PendingTxType} from '../../contexts/contract'
import {SecondaryButton} from '../common/buttons/SecondaryButton'

export enum ConfirmTransferStatus {
  APPROVING,
  TRANSFERRING,
  DONE,
}

interface IConfirmTransferProps {
  nft: NFTItem,
  open: boolean,
  image: string,
  collectionName: string,
  onClose: () => void,
  updateModal: (status: boolean) => void,
}

const ConfirmTransfer: React.FC<IConfirmTransferProps> = ({
  nft,
  open,
  image,
  collectionName,
  onClose,
  updateModal,
}) => {
  const { chainId, address, provider, signer } = useWallet()
  const { estimateGasFee, estimateGasFeeONFTCore, unwrapInfo, selectedUnwrapInfo, validateOwNFT, validateONFT } = useBridge()
  const { addTxToHistories } = useProgress()
  const { listenONFTEvents } = useContract()

  const [status, setStatus] = useState<ConfirmTransferStatus | undefined>(undefined)
  const [estimatedFee, setEstimatedFee] = useState<BigNumber>(BigNumber.from('0'))
  const [target, setTarget] = useState<string>('me')
  const [isONFTCore, setIsONFTCore] = useState(false)
  const [networkOption, setNetworkOption] = useState<any>()
  const [approveTxHash, setApproveTxHash] = useState<string>('')

  const explorer = getBlockExplorer(chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI])

  const senderChainId = chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI]

  const targetChainId = useMemo(() => {
    if (networkOption) {
      return networkOption.value
    }
    return 0
  }, [networkOption])

  const approveTxHashLink = useMemo(() => {
    return approveTxHash && `${explorer}/tx/${approveTxHash}`
  }, [approveTxHash, explorer])

  useEffect(() => {
    (async () => {
      if (targetChainId === 0) return
      if (senderChainId === targetChainId) return
      if (senderChainId !== nft.chain_id) return
      const isONFTCore = await validateONFT(nft)
      setIsONFTCore(isONFTCore)
      let gasFee
      if (isONFTCore) {
        gasFee = await estimateGasFeeONFTCore(nft, senderChainId, targetChainId)
      } else {
        gasFee = await estimateGasFee(nft, senderChainId, targetChainId)
      }
      setEstimatedFee(gasFee)
    })()
  }, [nft, targetChainId, senderChainId])

  const onTransfer = async () => {
    if (!signer) return
    if (!chainId) return
    if (chainId === targetChainId) return
    if (!address) return

    const lzEndpointInstance = getLayerZeroEndpointInstance(chainId, provider)
    const lzTargetChainId = getLayerzeroChainId(targetChainId)
    const _signerAddress = address

    const targetProvider = getProvider(targetChainId)
    try {
      if (isONFTCore) {
        if (nft.contract_type === 'ERC721') {
          const onftCoreInstance = getONFTCore721Instance(nft.token_address, chainId, signer)
          const remoteAddresses = await onftCoreInstance.getTrustedRemote(lzTargetChainId)
          const targetONFTCoreAddress = decodeFromBytes(remoteAddresses)
          const tx = await onftCoreInstance.sendFrom(
            address,
            lzTargetChainId,
            address,
            nft.token_id,
            address,
            ethers.constants.AddressZero,
            '0x',
            { value: estimatedFee }
          )
          const blockNumber = await targetProvider.getBlockNumber()
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChainId,
            targetAddress: targetONFTCoreAddress,
            isONFTCore: true,
            contractType: 'ERC721',
            nftItem: nft,
            targetBlockNumber: blockNumber,
            itemName: nft.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          setStatus(ConfirmTransferStatus.TRANSFERRING)
          await tx.wait()
          setStatus(ConfirmTransferStatus.DONE)
        } else if (nft.contract_type === 'ERC1155') {
          const onft1155CoreInstance = getONFTCore1155Instance(nft.token_address, chainId, signer)
          const remoteAddresses = await onft1155CoreInstance.getTrustedRemote(lzTargetChainId)
          const targetONFT1155CoreAddress = decodeFromBytes(remoteAddresses)
          const blockNumber = await targetProvider.getBlockNumber()
          // setStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await onft1155CoreInstance.sendFrom(
            _signerAddress,
            lzTargetChainId,
            _signerAddress,
            nft.token_id,
            nft.amount,
            _signerAddress,
            ethers.constants.AddressZero,
            '0x',
            { value: estimatedFee }
          )
          setStatus(ConfirmTransferStatus.TRANSFERRING)
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChainId,
            targetAddress: targetONFT1155CoreAddress,
            targetBlockNumber: blockNumber,
            isONFTCore: true,
            contractType: 'ERC1155',
            nftItem: nft,
            itemName: nft.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          await tx.wait()
          setStatus(ConfirmTransferStatus.DONE)
        }
      } else {
        if (nft.contract_type === 'ERC721') {
          const contractInstance = getOmnixBridgeInstance(chainId, signer)
          const erc721Instance = getERC721Instance(nft.token_address, 0, signer)
          const noSignerOmniXInstance = getOmnixBridgeInstance(targetChainId, null)
          const dstAddress = await noSignerOmniXInstance.persistentAddresses(nft.token_address)
          const blockNumber = await targetProvider.getBlockNumber()

          let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
          if (dstAddress !== ethers.constants.AddressZero) {
            adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
          }
          const operator = await erc721Instance.getApproved(BigNumber.from(nft.token_id))
          if (operator !== contractInstance.address) {
            setStatus(ConfirmTransferStatus.APPROVING)
            const tx = await erc721Instance.approve(contractInstance.address, BigNumber.from(nft.token_id))
            setApproveTxHash(tx.hash)
            await tx.wait()
          }

          setStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await contractInstance.wrap(lzTargetChainId, nft.token_address, BigNumber.from(nft.token_id), adapterParams, {
            value: estimatedFee
          })
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChainId,
            targetAddress: '',
            isONFTCore: false,
            contractType: 'ERC721',
            nftItem: nft,
            targetBlockNumber: blockNumber,
            itemName: nft.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          await tx.wait()
          setStatus(ConfirmTransferStatus.DONE)
        } else if (nft.contract_type === 'ERC1155') {
          const contractInstance = getOmnixBridge1155Instance(chainId, signer)
          const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChainId, null)
          const erc1155Instance = getERC1155Instance(nft.token_address, 0, signer)
          const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(nft.token_address)
          const blockNumber = await targetProvider.getBlockNumber()

          let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
          if (dstAddress !== ethers.constants.AddressZero) {
            adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
          }
          const operator = await erc1155Instance.isApprovedForAll(_signerAddress, contractInstance.address)
          if (!operator) {
            setStatus(ConfirmTransferStatus.APPROVING)
            const tx = await erc1155Instance.setApprovalForAll(contractInstance.address, true)
            setApproveTxHash(tx.hash)
            await tx.wait()
          }
          // Estimate fee from layerzero endpoint
          const _tokenURI = await erc1155Instance.uri(nft.token_id)
          const _payload = ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'string', 'uint256', 'uint256'],
            [nft.token_address, _signerAddress, _tokenURI, nft.token_id, nft.amount]
          )
          const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)

          setStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await contractInstance.wrap(lzTargetChainId, nft.token_address, BigNumber.from(nft.token_id), BigNumber.from(nft.amount), adapterParams, {
            value: estimatedFee.nativeFee
          })
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChainId,
            targetAddress: '',
            isONFTCore: false,
            contractType: 'ERC1155',
            nftItem: nft,
            targetBlockNumber: blockNumber,
            itemName: nft.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          await tx.wait()
          setStatus(ConfirmTransferStatus.DONE)
        }
      }
    } catch (err) {
      console.error(err)
      setStatus(undefined)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className={'pt-4 px-10 pb-8 z-50'}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className={'max-w-[400px] shadow-[0_0_250px_rgba(0,0,0,1)] w-full bg-primary-gradient backdrop-blur-[10px] rounded-lg p-[1px]'}>
          <Dialog.Panel
            className={'w-full bg-[#161616] backdrop-blur-[10px] rounded-lg p-8'}>
            <Dialog.Title>
              <div className="text-primary-light text-xg2 font-bold">send item</div>
            </Dialog.Title>
            <div className='flex flex-col justify-between mt-6'>
              <div className={'flex justify-center'}>
                <div className={'flex flex-col'}>
                  <div className={'bg-primary-gradient p-[1px] rounded'}>
                    <img alt={'nftImage'} className='bg-primary rounded' width={190} height={190} src={image}/>
                  </div>
                  <p className={'text-primary-light mt-3 font-medium'}>#{nft?.token_id}</p>
                  <p className='text-secondary font-medium'>{collectionName}</p>
                </div>
              </div>
            </div>
            <div className="border-0 rounded-lg relative flex flex-col w-full outline-none focus:outline-none">
              {/*body*/}
              <div className="relative flex-auto">
                {
                  status === undefined ? (
                    <>
                      <div className={'flex mt-5'}>
                        <span className={'font-medium text-primary-light text-md mr-6 h-6 flex items-center'}>to:</span>
                        <div className={'flex flex-col w-full'}>
                          <div className={'flex'}>
                            <span
                              className={`cursor-pointer border-[1px] rounded-full h-6 px-2 flex items-center justify-center text-md font-medium ${target === 'me' ? 'text-primary-green border-primary-green' : 'text-secondary border-secondary'}`}
                              onClick={() => setTarget('me')}>me</span>
                            <span
                              className={`cursor-pointer border-[1px] rounded-full h-6 px-2 flex items-center justify-center text-md font-medium  ${target === 'other' ? 'text-primary-green border-primary-green' : 'text-secondary border-secondary'} ml-2`}
                              onClick={() => setTarget('other')}>other</span>
                          </div>
                          {
                            target === 'other' && (
                              <div className={'flex w-full mt-3'}>
                                <input
                                  className={'w-full bg-transparent rounded-full text-primary-light text-md border-[1px] border-secondary pl-4 h-6'}
                                  placeholder={'enter address...'}/>
                              </div>
                            )
                          }
                          <div className={'mt-3'}>
                            <NetworkSelect value={networkOption} onChange={(value: any) => setNetworkOption(value)}/>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-primary-light text-md font-medium mt-3">
                        <span className={'mr-3'}>gas cost:</span>
                        <p>{estimatedFee != undefined && ethers.utils.formatEther(estimatedFee)}&nbsp;{chainInfos[senderChainId].currency}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`flex items-center mt-6 ${status === ConfirmTransferStatus.APPROVING ? 'active' : ''}`}>
                        <p className={`${status === ConfirmTransferStatus.APPROVING ? 'bg-primary-gradient' : 'bg-secondary'} w-[18px] h-[18px] rounded-full text-black text-md flex items-center justify-center font-bold`}>1</p>
                        <p className={`${status === ConfirmTransferStatus.APPROVING ? 'bg-primary-gradient bg-clip-text text-transparent' : 'text-secondary'} px-2 text-lg font-bold`}>Approve
                          Collection</p>
                        {(status === ConfirmTransferStatus.TRANSFERRING || status === ConfirmTransferStatus.DONE) && (
                          <Image src={'/images/icons/check.svg'} alt="completed" width={18} height={18}/>
                        )}
                        {status === ConfirmTransferStatus.APPROVING && (
                          <SpinLoader/>
                        )}
                      </div>
                      <div className="tx-status-section text-[12px] leading-[16px] text-[#A0B3CC] mt-4">
                        {status === ConfirmTransferStatus.APPROVING && (<>
                          <div className="text-primary-light text-[14px] leading-[17px]">
                            <p className="">Please confirm the transaction in your wallet to begin transfer.</p>
                          </div>

                          <div className="tx-status-row flex items-center">
                            <p className="text-primary-light text-[14px] leading-[17px]">transaction status:</p>
                            <p className="text-primary-light text-[14px] leading-[17px] ml-3">{status === ConfirmTransferStatus.APPROVING ? 'confirming...' : 'done'}</p>
                          </div>

                          <div className="tx-status-row flex items-center">
                            <p className="text-primary-light text-[14px] leading-[17px]">transaction record:</p>
                            <a className="text-primary-light text-[14px] leading-[17px] ml-3 tx-hash-ellipsis"
                              href={approveTxHashLink} target="_blank" rel="noreferrer">{approveTxHash || ''}</a>
                          </div>
                        </>)}
                      </div>

                      <div
                        className={`flex items-center mt-3 ${status === ConfirmTransferStatus.TRANSFERRING ? 'active' : ''}`}>
                        <p className={`${status === ConfirmTransferStatus.TRANSFERRING ? 'bg-primary-gradient' : 'bg-secondary'} w-[18px] h-[18px] rounded-full text-black text-md flex items-center justify-center font-bold`}>2</p>
                        <p className={`${status === ConfirmTransferStatus.TRANSFERRING ? 'bg-primary-gradient bg-clip-text text-transparent' : 'text-secondary'} px-2 text-lg font-bold`}>Complete
                          Transfer</p>
                        {status === ConfirmTransferStatus.DONE && (
                          <Image src={'/images/icons/check.svg'} alt="completed" width={18} height={18}/>
                        )}
                        {status === ConfirmTransferStatus.TRANSFERRING && (
                          <SpinLoader/>
                        )}
                      </div>
                      <div className='tx-status-section mb-3'>
                        {status === ConfirmTransferStatus.TRANSFERRING && (<>
                          <div className="mt-3 text-primary-light text-[14px] leading-[17px]">
                            <p className="">Please confirm the transaction in your wallet to complete the transfer.</p>
                          </div>
                        </>)}
                      </div>

                      {status === ConfirmTransferStatus.DONE &&
                          <div className="my-3">
                            <p className="bg-primary-gradient bg-clip-text text-transparent font-bold text-xg1">Congrats!</p>
                            <p className="text-lg text-primary-light font-medium mt-2">your NFT is on the way</p>
                          </div>
                      }
                    </>
                  )
                }
              </div>
              {/*footer*/}
              <div className="mt-20 flex justify-center">
                {(status !== undefined) ? (
                  <SecondaryButton text={'close'} onClick={() => updateModal(false)}/>
                ) : (
                  <SecondaryButton text={'send'} onClick={onTransfer}/>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmTransfer
