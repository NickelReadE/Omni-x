/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BigNumber, ethers } from 'ethers'
import Image from 'next/image'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import LazyLoad from 'react-lazyload'
import { Dialog } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useNetwork, useSwitchNetwork, useBalance } from 'wagmi'
import useWallet from '../hooks/useWallet'
import { NFTItem } from '../interface/interface'
import {
  decodeFromBytes,
  getERC1155Instance,
  getERC721Instance,
  getLayerZeroEndpointInstance,
  getOmnixBridge1155Instance,
  getOmnixBridgeInstance,
  getONFTCore1155Instance,
  getONFTCore721Instance,
} from '../utils/contracts'
import {
  chainInfos,
  CHAIN_IDS,
  getChainInfo,
  getLayerzeroChainId,
  getProvider,
  numberLocalize,
  SUPPORTED_CHAIN_IDS,
} from '../utils/constants'
import ConfirmTransfer, { ConfirmTransferStatus } from './bridge/ConfirmTransfer'
import ConfirmUnwrap from './bridge/ConfirmUnwrap'
import UserEdit from './user/UserEdit'
import useBridge from '../hooks/useBridge'
import useProgress from '../hooks/useProgress'
import useContract from '../hooks/useContract'
import { PendingTxType } from '../contexts/contract'
import { ChainIds, CHAIN_TYPE } from '../types/enum'
import useData from '../hooks/useData'
import {openSnackBar} from '../redux/reducers/snackBarReducer'

interface RefObject {
  offsetHeight: number
}

const useStyles = makeStyles({
  paper: {
    padding: '0rem 2rem 0rem 0rem',
    width: '90%',
    maxWidth: '100%',
  },
})

const SideBar: React.FC = () => {
  const {
    provider,
    signer,
    address,
    chainId,
    disconnect,
  } = useWallet()
  const { data: nativeBalance } = useBalance({
    addressOrName: address
  })
  const classes = useStyles()
  const { estimateGasFee, estimateGasFeeONFTCore, unwrapInfo, selectedUnwrapInfo, validateOwNFT, validateONFT } = useBridge()
  const { addTxToHistories } = useProgress()
  const { listenONFTEvents } = useContract()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { balances, profile, userNfts: nfts, refreshUserNfts } = useData()
  const dispatch = useDispatch()

  const ref = useRef(null)
  const menu_profile = useRef<HTMLUListElement>(null)
  const menu_ethereum = useRef<HTMLUListElement>(null)
  const menu_wallets = useRef<HTMLDivElement>(null)
  const menu_watchlist = useRef<HTMLDivElement>(null)
  const menu_bridge = useRef<HTMLDivElement>(null)
  const menu_cart = useRef<HTMLDivElement>(null)

  const [showSidebar, setShowSidebar] = useState(false)
  const [onMenu, setOnMenu] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [fixed, setFixed] = useState(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)
  const [isFirstDrag, setIsFirstDrag] = useState(true)
  const [offsetMenu, setOffsetMenu] = useState(0)
  const [avatarError, setAvatarError] = useState(false)
  const [selectedNFTItem, setSelectedNFTItem] = useState<NFTItem>()
  const [isONFTCore, setIsONFTCore] = useState(false)
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [imageError, setImageError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dragEnd, setDragEnd] = useState(false)
  const [targetChain, setTargetChain] = useState(ChainIds.ETHEREUM)
  const [transferStatus, setTransferStatus] = useState<ConfirmTransferStatus | undefined>()
  const [approveTxHash, setApproveTxHash] = useState<string | undefined>()
  const [estimatedFee, setEstimatedFee] = useState<BigNumber>(BigNumber.from('0'))
  const [isONFT, setIsONFT] = useState(false)
  const [unwrap, setUnwrap] = useState(false)
  const [bOpenModal, setOpenModal] = useState(false)

  const { setNodeRef } = useDroppable({
    id: 'droppable',
    data: {
      accepts: ['NFT'],
    }
  })

  // Drag and drop event monitor
  useDndMonitor({
    onDragStart() {
      setDragOver(true)
      setDragEnd(false)
      setShowSidebar(true)
      setOnMenu(true)
      setFixed(true)
      setExpandedMenu(5)
    },
    onDragOver() {
      setDragEnd(false)
    },
    onDragEnd(event) {
      const { active: { id } } = event
      if (id.toString().length > 0 && (event.over !== null || isFirstDrag)) {
        const tokenId = id.toString().split('-')[1]
        const collectionAddress = id.toString().split('-')[2]
        const selectedItem = nfts.find((item) => item.token_id == tokenId && item.collection_address === collectionAddress)
        if (selectedItem) {
          setSelectedNFTItem(selectedItem)
          validateOwNFT(selectedItem).then((res) => {
            setIsONFT(res)
          })
          const metadata = selectedItem.metadata
          setImageError(false)
          if (metadata) {
            try {
              // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
              const image_uri = JSON.parse(metadata).image
              setImage(image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
            } catch (err) {
              console.log(err)
              setImage('/images/omnix_logo_black_1.png')
            }
          }
        }
      }
      setDragEnd(true)
      setDragOver(false)
    },
    onDragCancel() {
      setDragEnd(false)
      setDragOver(false)
    },
  })

  useLayoutEffect(() => {
    if (menu_profile.current && expandedMenu == 1) {
      const current: RefObject = menu_profile.current
      setOffsetMenu(current.offsetHeight)
    }
    if (menu_ethereum.current && expandedMenu == 2) {
      const current: RefObject = menu_ethereum.current
      setOffsetMenu(current.offsetHeight)
    }
    if (menu_wallets.current && expandedMenu == 3) {
      const current: RefObject = menu_wallets.current
      setOffsetMenu(current.offsetHeight)
    }
    if (menu_watchlist.current && expandedMenu == 4) {
      const current: RefObject = menu_watchlist.current
      setOffsetMenu(current.offsetHeight)
    }
    if (menu_bridge.current && expandedMenu == 5) {
      const current: RefObject = menu_bridge.current
      setOffsetMenu(current.offsetHeight)
    }
    if (menu_cart.current && expandedMenu == 6) {
      const current: RefObject = menu_cart.current
      setOffsetMenu(current.offsetHeight)
    }
  }, [expandedMenu])

  const hideSidebar = () => {
    if (!onMenu) {
      setExpandedMenu(0)
      setOffsetMenu(0)
      setShowSidebar(false)
      setOnMenu(false)
    }
  }

  const onLeaveMenu = () => {
    if (!fixed) {
      onLeave()
    }
  }

  const onLeave = () => {
    setExpandedMenu(0)
    setOffsetMenu(0)
    setShowSidebar(false)
    setOnMenu(false)
  }

  const toggleMenu = (menu: number) => {
    setExpandedMenu(menu == expandedMenu ? 0 : menu)
    setFixed(false)
  }

  const fixMenu = (menu: number) => {
    setExpandedMenu(menu == expandedMenu ? 0 : menu)
    setFixed(!fixed)
    setIsFirstDrag(!isFirstDrag)
  }

  const handleTargetChainChange = (networkIndex: number) => {
    setTargetChain(networkIndex)
  }

  const handleTransfer = async () => {
    if (!selectedNFTItem) return
    if (!targetChain) return
    if (!profile) return
    if (!signer) return
    if (!chainId) return
    if (chainId !== selectedNFTItem.chain_id) {
      return switchNetwork?.(selectedNFTItem.chain_id)
    }
    if (chainId === targetChain) return

    const isONFTCore = await validateONFT(selectedNFTItem)
    setIsONFTCore(isONFTCore)
    try {
      let gasFee
      if (isONFTCore) {
        gasFee = await estimateGasFeeONFTCore(selectedNFTItem, chainId, targetChain)
      } else {
        gasFee = await estimateGasFee(selectedNFTItem, chainId, targetChain)
      }
      if (nativeBalance?.value.lt(gasFee)) {
        return dispatch(openSnackBar( { message: 'Insufficient balance', status: 'warning' }))
      }
      setEstimatedFee(gasFee)
      setConfirmTransfer(true)
    } catch (e) {
      console.error(e)
    } finally {
      setTransferStatus(undefined)
    }
  }

  const onTransfer = async () => {
    if (!selectedNFTItem) return
    if (!signer) return
    if (!chainId) return
    if (chainId === targetChain) return
    if (!address) return

    const lzEndpointInstance = getLayerZeroEndpointInstance(chainId, provider)
    const lzTargetChainId = getLayerzeroChainId(targetChain)
    const _signerAddress = address

    const targetProvider = getProvider(targetChain)
    try {
      if (isONFTCore) {
        if (selectedNFTItem.contract_type === 'ERC721') {
          const onftCoreInstance = getONFTCore721Instance(selectedNFTItem.token_address, chainId, signer)
          const remoteAddresses = await onftCoreInstance.getTrustedRemote(lzTargetChainId)
          const targetONFTCoreAddress = decodeFromBytes(remoteAddresses)
          setTransferStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await onftCoreInstance.sendFrom(
            address,
            lzTargetChainId,
            address,
            selectedNFTItem.token_id,
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
            targetChainId: targetChain,
            targetAddress: targetONFTCoreAddress,
            isONFTCore: true,
            contractType: 'ERC721',
            nftItem: selectedNFTItem,
            targetBlockNumber: blockNumber,
            itemName: selectedNFTItem.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          onLeave()
          await tx.wait()
          setTransferStatus(ConfirmTransferStatus.DONE)
        } else if (selectedNFTItem.contract_type === 'ERC1155') {
          const onft1155CoreInstance = getONFTCore1155Instance(selectedNFTItem.token_address, chainId, signer)
          const remoteAddresses = await onft1155CoreInstance.getTrustedRemote(lzTargetChainId)
          const targetONFT1155CoreAddress = decodeFromBytes(remoteAddresses)
          const blockNumber = await targetProvider.getBlockNumber()
          setTransferStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await onft1155CoreInstance.sendFrom(
            _signerAddress,
            lzTargetChainId,
            _signerAddress,
            selectedNFTItem.token_id,
            selectedNFTItem.amount,
            _signerAddress,
            ethers.constants.AddressZero,
            '0x',
            { value: estimatedFee }
          )
          onLeave()
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChain,
            targetAddress: targetONFT1155CoreAddress,
            targetBlockNumber: blockNumber,
            isONFTCore: true,
            contractType: 'ERC1155',
            nftItem: selectedNFTItem,
            itemName: selectedNFTItem.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          await tx.wait()
          setTransferStatus(ConfirmTransferStatus.DONE)
        }
      } else {
        if (selectedNFTItem.contract_type === 'ERC721') {
          const contractInstance = getOmnixBridgeInstance(chainId, signer)
          const erc721Instance = getERC721Instance(selectedNFTItem.token_address, 0, signer)
          const noSignerOmniXInstance = getOmnixBridgeInstance(targetChain, null)
          const dstAddress = await noSignerOmniXInstance.persistentAddresses(selectedNFTItem.token_address)
          const blockNumber = await targetProvider.getBlockNumber()

          let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
          if (dstAddress !== ethers.constants.AddressZero) {
            adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
          }
          const operator = await erc721Instance.getApproved(BigNumber.from(selectedNFTItem.token_id))
          if (operator !== contractInstance.address) {
            setTransferStatus(ConfirmTransferStatus.APPROVING)
            const tx = await erc721Instance.approve(contractInstance.address, BigNumber.from(selectedNFTItem.token_id))
            setApproveTxHash(tx.hash)
            await tx.wait()
          }

          setTransferStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await contractInstance.wrap(lzTargetChainId, selectedNFTItem.token_address, BigNumber.from(selectedNFTItem.token_id), adapterParams, {
            value: estimatedFee
          })
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChain,
            targetAddress: '',
            isONFTCore: false,
            contractType: 'ERC721',
            nftItem: selectedNFTItem,
            targetBlockNumber: blockNumber,
            itemName: selectedNFTItem.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          onLeave()
          await tx.wait()
          setTransferStatus(ConfirmTransferStatus.DONE)
          setSelectedNFTItem(undefined)
        } else if (selectedNFTItem.contract_type === 'ERC1155') {
          const contractInstance = getOmnixBridge1155Instance(chainId, signer)
          const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChain, null)
          const erc1155Instance = getERC1155Instance(selectedNFTItem.token_address, 0, signer)
          const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(selectedNFTItem.token_address)
          const blockNumber = await targetProvider.getBlockNumber()

          let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
          if (dstAddress !== ethers.constants.AddressZero) {
            adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
          }
          const operator = await erc1155Instance.isApprovedForAll(_signerAddress, contractInstance.address)
          if (!operator) {
            setTransferStatus(ConfirmTransferStatus.APPROVING)
            const tx = await erc1155Instance.setApprovalForAll(contractInstance.address, true)
            setApproveTxHash(tx.hash)
            await tx.wait()
          }
          // Estimate fee from layerzero endpoint
          const _tokenURI = await erc1155Instance.uri(selectedNFTItem.token_id)
          const _payload = ethers.utils.defaultAbiCoder.encode(
            ['address', 'address', 'string', 'uint256', 'uint256'],
            [selectedNFTItem.token_address, _signerAddress, _tokenURI, selectedNFTItem.token_id, selectedNFTItem.amount]
          )
          const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)

          setTransferStatus(ConfirmTransferStatus.TRANSFERRING)
          const tx = await contractInstance.wrap(lzTargetChainId, selectedNFTItem.token_address, BigNumber.from(selectedNFTItem.token_id), BigNumber.from(selectedNFTItem.amount), adapterParams, {
            value: estimatedFee.nativeFee
          })
          onLeave()
          const pendingTx: PendingTxType = {
            txHash: tx.hash,
            type: 'bridge',
            senderChainId: chainId,
            targetChainId: targetChain,
            targetAddress: '',
            isONFTCore: false,
            contractType: 'ERC1155',
            nftItem: selectedNFTItem,
            targetBlockNumber: blockNumber,
            itemName: selectedNFTItem.name
          }
          const historyIndex = addTxToHistories(pendingTx)
          await listenONFTEvents(pendingTx, historyIndex)
          await tx.wait()
          setTransferStatus(ConfirmTransferStatus.DONE)
          setSelectedNFTItem(undefined)
        }
      }
    } catch (err) {
      console.error(err)
      setTransferStatus(undefined)
    }
  }

  const handleUnwrap = useCallback(async () => {
    if (chainId && unwrapInfo) {
      try {
        if (unwrapInfo.type === 'ERC721') {
          const contractInstance = getOmnixBridgeInstance(unwrapInfo.chainId, signer)
          const erc721Instance = getERC721Instance(unwrapInfo.persistentAddress, unwrapInfo.chainId, signer)
          const operator = await erc721Instance.getApproved(BigNumber.from(unwrapInfo.tokenId))
          if (operator !== contractInstance.address) {
            await (await erc721Instance.approve(contractInstance.address, BigNumber.from(unwrapInfo.tokenId))).wait()
          }
          const tx = await contractInstance.withdraw(unwrapInfo.persistentAddress, unwrapInfo.tokenId)
          await tx.wait()
        } else if (unwrapInfo.type === 'ERC1155') {
          const bridgeInstance = getOmnixBridge1155Instance(unwrapInfo.chainId, signer)
          const erc1155Instance = getERC1155Instance(unwrapInfo.persistentAddress, unwrapInfo.chainId, signer)

          const operator = await erc1155Instance.isApprovedForAll(address, bridgeInstance.address)
          if (!operator) {
            await (await erc1155Instance.setApprovalForAll(bridgeInstance.address, true)).wait()
          }

          const tx = await bridgeInstance.withdraw(unwrapInfo.persistentAddress, unwrapInfo.tokenId, unwrapInfo.amount)
          await tx.wait()
        }

        setTimeout(() => {
          refreshUserNfts()
        }, 30000)
      } catch (e: any) {
        console.log(e)
      } finally {
        setUnwrap(false)
      }
    }
  }, [chainId, unwrapInfo, signer, address, dispatch])

  const onUnwrap = async () => {
    if (chainId && selectedUnwrapInfo) {
      try {
        if (selectedUnwrapInfo.type === 'ERC721') {
          const contractInstance = getOmnixBridgeInstance(selectedUnwrapInfo.chainId, signer)
          const erc721Instance = getERC721Instance(selectedUnwrapInfo.persistentAddress, selectedUnwrapInfo.chainId, signer)
          const operator = await erc721Instance.getApproved(BigNumber.from(selectedUnwrapInfo.tokenId))
          if (operator !== contractInstance.address) {
            await (await erc721Instance.approve(contractInstance.address, BigNumber.from(selectedUnwrapInfo.tokenId))).wait()
          }
          const tx = await contractInstance.withdraw(selectedUnwrapInfo.persistentAddress, selectedUnwrapInfo.tokenId)
          await tx.wait()
        } else if (selectedUnwrapInfo.type === 'ERC1155') {
          const bridgeInstance = getOmnixBridge1155Instance(selectedUnwrapInfo.chainId, signer)
          const erc1155Instance = getERC1155Instance(selectedUnwrapInfo.persistentAddress, selectedUnwrapInfo.chainId, signer)

          const operator = await erc1155Instance.isApprovedForAll(address, bridgeInstance.address)
          if (!operator) {
            await (await erc1155Instance.setApprovalForAll(bridgeInstance.address, true)).wait()
          }

          const tx = await bridgeInstance.withdraw(selectedUnwrapInfo.persistentAddress, selectedUnwrapInfo.tokenId, selectedUnwrapInfo.amount)
          await tx.wait()
        }
        setTimeout(() => {
          refreshUserNfts()
        }, 30000)
      } catch (e: any) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (unwrapInfo) {
        setUnwrap(true)
        await handleUnwrap()
      }
    })()
  }, [handleUnwrap, unwrapInfo])

  const updateModal = (status: boolean) => {
    setConfirmTransfer(status)
  }

  const setLogout = () => {
    disconnect()
  }

  const avatarImage = useMemo(() => {
    if (!avatarError && profile && profile.avatar) {
      return process.env.API_URL + profile.avatar
    }
    return '/images/default_avatar.png'
  }, [profile])

  return (
    <>
      {/* {!onMenu &&
        <div
          className='right-0 w-[70px] py-6 bg-[#F6F8FC] fixed h-full z-[98]'
          onMouseEnter={() => setShowSidebar(true)}
          onMouseLeave={() => hideSidebar()}
        >
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full 0">
              <div className="sidebar-icon">
                <div className="m-auto">
                  <Image
                    src={avatarImage}
                    alt="avatar"
                    onError={() => { profile && profile.avatar && setAvatarError(true) }}
                    width={45}
                    height={45}
                  />
                </div>
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                {
                  SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                    return chainId === networkId && <img key={index} alt={'networkIcon'} src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="m-auto h-[45px]" />
                  })
                }
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/wallets.svg" className="m-auto" />
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/bridge.svg" className="m-auto" />
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/watchlist.svg" className="m-auto" />
              </div>
            </div>
          </div>
        </div>
      } */}
      {/* <div
        ref={ref}
        className={`right-0 w-[450px] bg-w-600/[.8] backdrop-blur-sm pl-5 pr-2 py-6 fixed h-full z-[97] opacity-0.95 ease-in-out duration-300 ${showSidebar || onMenu ? 'translate-x-0' : 'translate-x-full'}`}
        onMouseEnter={() => setOnMenu(true)}
        onMouseLeave={() => onLeaveMenu()}
      >
        <ul className='flex flex-col space-y-8 mr-[70px]'>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu == 1 ? 'active' : ''}`}
              onClick={() => toggleMenu(1)}
            >
              My Profile
              <span className="pull-right">
                <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            {expandedMenu == 1 &&
              <ul className='flex  flex-col w-full   pt-4 pb-0 text-g-600' ref={menu_profile}>
                <li className="w-full">
                  <button className="w-full flex justify-start py-[13px] pl-[100px] hover:bg-l-50" onClick={() => setOpenModal(true)}>Account Settings</button>
                </li>
                <li className="w-full">
                  <button className="w-full flex justify-start py-[13px] pl-[100px] hover:bg-l-50" onClick={() => setLogout()}>Logout</button>
                </li>
              </ul>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu == 2 ? 'active' : ''}`}
              onClick={() => toggleMenu(2)}
            >
              Network
              <span className="pull-right">
                <i className={`${expandedMenu == 2 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            {expandedMenu == 2 &&
              <ul className='flex flex-col w-full   pt-4 pb-0 text-g-600' ref={menu_ethereum}>
                {
                  SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                    return (
                      <li key={index} className="w-full">
                        <button
                          className="w-full hover:bg-l-50 pl-[70px] py-[7px]"
                          disabled={chainInfos[networkId].comingSoon || networkId === chain?.id}
                          onClick={() => switchNetwork?.(networkId)}
                        >
                          <div className="flex flex-row w-[130px]">
                            <div className="flex items-center w-[36px] h-[36px]">
                              <img alt={'networkIcon'} src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo} width={24} height={28} />
                            </div>
                            <span className="flex items-center ml-4">{chainInfos[networkId].officialName || chainInfos[ChainIds.ETHEREUM].officialName}</span>
                          </div>
                        </button>
                      </li>
                    )
                  })
                }
              </ul>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg  text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu == 3 ? 'active' : ''}`}
              onClick={() => toggleMenu(3)}
            >
              Wallet
              <span className="pull-right">
                <i className={`${expandedMenu == 3 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            {expandedMenu == 3 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_wallets}>
                <span className="font-semibold w-auto text-[16px]">OMNI balance: {numberLocalize(balances.omni)}</span>
                <span className="font-semibold w-auto text-[16px]">USDC balance: {numberLocalize(balances.usdc)}</span>
                <span className="font-semibold w-auto text-[16px]">USDT balance: {numberLocalize(balances.usdt)}</span>
                <span className="font-semibold w-auto text-[16px]">
                  {getChainInfo(chainId)?.nativeCurrency.symbol} balance: {numberLocalize(parseFloat(nativeBalance?.formatted || '0'))}
                </span>
                <span className="w-auto text-[16px]">Staking: coming soon</span>
              </div>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full p-6  pr-[70px]  py-[12px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu == 5 ? 'active' : ''}`}
              onClick={() => fixMenu(5)}
            >
              Send/Bridge
              <span className="pull-right">
                <i className={`${expandedMenu == 5 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            {expandedMenu == 5 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_bridge}>
                <div ref={setNodeRef} className="px-[113px] py-[43px] flex flex-col items-center border border-dashed border-g-300 bg-g-200" style={dragOver ? { opacity: 0.4 } : { opacity: 1 }}>
                  {
                    dragOver
                      ?
                      <div className="">Drop</div>
                      :
                      (
                        !dragEnd &&
                        <img alt={'networkIcon'} src="/sidebar/attach.png" />
                      )
                  }
                  {
                    selectedNFTItem &&
                    <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
                      <img src={imageError ? '/images/omnix_logo_black_1.png' : image} alt="nft-image" onError={() => { setImageError(true) }} data-src={image} />
                    </LazyLoad>
                  }
                </div>
                <span className="font-g-300">Select destination chain:</span>
                <div className="flex flex-row w-full space-x-[5px]">
                  {
                    SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                      return (
                        <button key={index} disabled={!!chainInfos[networkId].comingSoon} onClick={() => handleTargetChainChange(networkId)} className={`${targetChain === networkId ? 'border border-[#B444F9] bg-[#F3F5F7]' : ''} flex items-center justify-center w-[40px] h-[40px]`}>
                          <img alt={'networkIcon'} src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo} width={24} height={28} />
                        </button>
                      )
                    })
                  }
                </div>
                {
                  isONFT
                    ?
                    <button className="bg-g-400 text-white w-[172px] py-[10px] rounded-full m-auto" onClick={onUnwrap}>
                      Unwrap
                    </button>
                    :
                    <button className="bg-[#B444F9] text-white w-[172px] py-[10px] rounded-full m-auto" onClick={handleTransfer}>
                      Transfer
                    </button>
                }
              </div>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px]  py-[12px] pr-[70px] text-xg  text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu == 4 ? 'active' : ''}`}
              onClick={() => toggleMenu(4)}
            >
              Watchlist
              <span className="pull-right">
                <i className={`${expandedMenu == 4 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            {expandedMenu == 4 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_watchlist}>
                <div className="p-[51px] flex flex-col items-center border border-dashed border-g-300">
                  <span className="text-[14px] text-g-300">coming soon</span>
                </div>
              </div>
            }
          </li>
        </ul>

        <div className='top-0 right-0 w-[70px] py-6 bg-white fixed h-full z-[99]'>
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full 0">
              <div className="sidebar-icon">
                <div className="m-auto">
                  <Image
                    src={avatarImage}
                    alt="avatar"
                    onError={() => { profile && profile.avatar && setAvatarError(true) }}
                    width={45}
                    height={45}
                  />
                </div>
              </div>
              {expandedMenu == 1 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{ height: offsetMenu + 'px' }}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                {
                  SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                    return chainId === networkId && <img key={index} alt={'networkIcon'} src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="m-auto h-[45px]" />
                  })
                }
              </div>
              {expandedMenu == 2 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{ height: offsetMenu + 'px' }}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/wallets.svg" className="m-auto" />
              </div>
              {expandedMenu == 3 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{ height: offsetMenu + 'px' }}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/bridge.svg" className="m-auto" />
              </div>
              {expandedMenu == 5 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{ height: offsetMenu + 'px' }}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img alt={'networkIcon'} src="/sidebar/watchlist.svg" className="m-auto" />
              </div>
              {expandedMenu == 4 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{ height: offsetMenu + 'px' }}>
                </ul>
              }
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full md:w-auto">
        <Dialog open={confirmTransfer} onClose={() => setConfirmTransfer(false)}>
          <ConfirmTransfer
            updateModal={updateModal}
            onTransfer={onTransfer}
            status={transferStatus}
            approveTxHash={approveTxHash}
            selectedNFTItem={selectedNFTItem}
            estimatedFee={estimatedFee}
            senderChain={chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI]}
            targetChain={targetChain}
            image={image}
          />
        </Dialog>
      </div>
      <div className="w-full md:w-auto">
        <Dialog open={unwrap} onClose={() => setUnwrap(false)}>
          <ConfirmUnwrap
            updateModal={() => setUnwrap(false)}
            onUnwrap={onUnwrap}
          />
        </Dialog>
      </div>
      <Dialog open={bOpenModal} onClose={() => setOpenModal(false)} aria-labelledby='simple-dialog-title' maxWidth={'xl'} classes={{ paper: classes.paper }}>
        <UserEdit updateModal={() => setOpenModal(false)} />
      </Dialog>
    </>
  )
}

export default SideBar
