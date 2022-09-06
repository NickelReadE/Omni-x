import React, {useRef, useLayoutEffect, useState, useEffect, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {BigNumber, ethers} from 'ethers'
import Image from 'next/image'
import {useDndMonitor, useDroppable} from '@dnd-kit/core'
import LazyLoad from 'react-lazyload'
import {Dialog} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useWallet from '../hooks/useWallet'
import {getUserNFTs, selectUser, selectUserNFTs} from '../redux/reducers/userReducer'
import {NFTItem} from '../interface/interface'
import {
  getLayerZeroEndpointInstance,
  getERC721Instance,
  getERC1155Instance,
  getOmnixBridge1155Instance,
  getOmnixBridgeInstance, getONFTCore721Instance, getONFTCore1155Instance,
} from '../utils/contracts'
import {getChainIdFromName, getLayerzeroChainId} from '../utils/constants'
import ConfirmTransfer from './bridge/ConfirmTransfer'
import ConfirmUnwrap from './bridge/ConfirmUnwrap'
import UserEdit from './user/UserEdit'
import useBridge from '../hooks/useBridge'
import useProgress from '../hooks/useProgress'
import usd from '../constants/abis/USD.json'
import omni from '../constants/abis/omni.json'
import usdc from '../constants/USDC.json'
import usdt from '../constants/USDT.json'
import omniAddress from '../constants/OMNI.json'

interface RefObject {
  offsetHeight: number
}

const env = process.env.NEXT_PUBLICE_ENVIRONMENT || 'testnet'
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
    disconnect,
    connect: connectWallet,
    
    switchNetwork
  } = useWallet()  
  const classes = useStyles()
  const { estimateGasFee, estimateGasFeeONFTCore, unwrapInfo, selectedUnwrapInfo, validateOwNFT, validateONFT } = useBridge()
  const { setPendingTxInfo } = useProgress()

  const dispatch = useDispatch()
  const ref = useRef(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [onMenu, setOnMenu] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [fixed, setFixed] = useState(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)
  const [chainId, setChainID] = useState(4)
  const [isFirstDrag, setIsFirstDrag] = useState(true)
  const DEFAULT_AVATAR = 'uploads\\default_avatar.png'

  const menu_profile = useRef<HTMLUListElement>(null)
  const menu_ethereum = useRef<HTMLUListElement>(null)
  const menu_wallets = useRef<HTMLDivElement>(null)
  const menu_watchlist = useRef<HTMLDivElement>(null)
  const menu_bridge = useRef<HTMLDivElement>(null)
  const menu_cart = useRef<HTMLDivElement>(null)
  const [offsetMenu, setOffsetMenu] = useState(0)
  const [avatarError, setAvatarError] = useState(false)

  const [omniBalance, setOmniBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)


  const nfts = useSelector(selectUserNFTs)
  const user = useSelector(selectUser)

  const [selectedNFTItem, setSelectedNFTItem] = useState<NFTItem>()
  const [isONFTCore, setIsONFTCore] = useState(false)
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [imageError, setImageError] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [dragEnd, setDragEnd] = useState(false)
  const [targetChain, setTargetChain] = useState(97)
  const [estimatedFee, setEstimatedFee] = useState<BigNumber>(BigNumber.from('0'))
  const [isONFT, setIsONFT] = useState(false)
  const [unwrap, setUnwrap] = useState(false)
  const [bOpenModal, setOpenModal] = React.useState(false)

  const {setNodeRef} = useDroppable({
    id: 'droppable',
    data: {
      accepts: ['NFT'],
    }
  })

  // Drag and drop event monitor
  useDndMonitor({
    
    onDragStart(event) {
      setDragOver(true)
      setDragEnd(false)
      setShowSidebar(true)
      setOnMenu(true)
      setFixed(true)
      setExpandedMenu(5)
    },
    onDragOver(event) {
      setDragEnd(false)
    },
    onDragEnd(event) {
      const { active: { id } } = event
      if (id.toString().length > 0 && (event.over !== null || isFirstDrag)) {
        const index = id.toString().split('-')[1]
        setSelectedNFTItem(nfts[index])
        validateOwNFT(nfts[index]).then((res) => {
          setIsONFT(res)
        })
        const metadata = nfts[index].metadata
        setImageError(false)
        // setChain(chain_list[nfts[index].chain])
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
      setDragEnd(true)
      setDragOver(false)
    },
    onDragCancel(event) {
      setDragEnd(false)
      setDragOver(false)
    },
  })

  useLayoutEffect(() => {
    if ( menu_profile.current && expandedMenu == 1 ) {
      const current: RefObject = menu_profile.current
      setOffsetMenu(current.offsetHeight)
    }
    if ( menu_ethereum.current && expandedMenu == 2 ) {
      const current: RefObject = menu_ethereum.current
      setOffsetMenu(current.offsetHeight)
    }
    if ( menu_wallets.current && expandedMenu == 3 ) {
      const current: RefObject = menu_wallets.current
      setOffsetMenu(current.offsetHeight)
    }
    if ( menu_watchlist.current && expandedMenu == 4 ) {
      const current: RefObject = menu_watchlist.current
      setOffsetMenu(current.offsetHeight)
    }
    if ( menu_bridge.current && expandedMenu == 5 ) {
      const current: RefObject = menu_bridge.current
      setOffsetMenu(current.offsetHeight)
    }
    if ( menu_cart.current && expandedMenu == 6 ) {
      const current: RefObject = menu_cart.current
      setOffsetMenu(current.offsetHeight)
    }
  }, [expandedMenu])

  const hideSidebar = () => {
    if ( !onMenu ) {
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

  const onClickNetwork = async (chainId: number) => {
    await connectWallet()
    try{
      await switchNetwork(chainId)
      window.location.reload()
    }catch(error){
      console.log('error:', error)
    }
  }

  const handleTargetChainChange = (networkIndex: number) => {
    setTargetChain(networkIndex)
  }

  const handleTransfer = async () => {
    if (!selectedNFTItem) return
    if (!targetChain) return
    if (!user) return
    if (!signer) return
    if (!chainId) return    
    const senderChainId = getChainIdFromName(selectedNFTItem.chain)
    if (chainId !== senderChainId) {
      return await switchNetwork(senderChainId)
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
      setEstimatedFee(gasFee)
      setConfirmTransfer(true)
    } catch (e) {
      console.error(e)
    }
  }

  const onTransfer = async () => {
    if (!selectedNFTItem) return
    if (!signer) return
    if (!provider?._network?.chainId) return
    if (provider?._network?.chainId === targetChain) return
    if (!address) return

    const lzEndpointInstance = getLayerZeroEndpointInstance(provider?._network?.chainId, provider)
    const lzTargetChainId = getLayerzeroChainId(targetChain)
    const _signerAddress = address

    if (isONFTCore) {
      if (selectedNFTItem.contract_type === 'ERC721') {
        const onftCoreInstance = getONFTCore721Instance(selectedNFTItem.token_address, provider?._network?.chainId, signer)
        const targetONFTCoreAddress = await onftCoreInstance.trustedRemoteLookup(lzTargetChainId)
        const targetCoreInstance = getONFTCore721Instance(targetONFTCoreAddress, targetChain, null)
        const tx = await onftCoreInstance.sendFrom(
          _signerAddress,
          lzTargetChainId,
          _signerAddress,
          selectedNFTItem.token_id,
          _signerAddress,
          ethers.constants.AddressZero,
          '0x',
          { value: estimatedFee }
        )
        targetCoreInstance.on('ReceiveFromChain', (/*srcChainId, srcAddress, toAddress, tokenId, nonce*/) => {
          setTimeout(() => {
            dispatch(getUserNFTs(address) as any)
          }, 30000)
        })
        onLeave()
        await setPendingTxInfo({
          txHash: tx.hash,
          type: 'bridge',
          senderChainId: provider?._network?.chainId,
          targetChainId: targetChain,
          itemName: selectedNFTItem.name
        })
        await tx.wait()
        await setPendingTxInfo(null)
      } else if (selectedNFTItem.contract_type === 'ERC1155') {
        const onft1155CoreInstance = getONFTCore1155Instance(selectedNFTItem.token_address, provider?._network?.chainId, signer)
        const targetONFT1155CoreAddress = await onft1155CoreInstance.trustedRemoteLookup(lzTargetChainId)
        const targetCoreInstance = getONFTCore1155Instance(targetONFT1155CoreAddress, targetChain, null)
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
        await setPendingTxInfo({
          txHash: tx.hash,
          type: 'bridge',
          senderChainId: provider?._network?.chainId,
          targetChainId: targetChain,
          itemName: selectedNFTItem.name
        })
        targetCoreInstance.on('ReceiveFromChain', (/*srcChainId, srcAddress, toAddress, tokenId, nonce*/) => {
          setTimeout(() => {
            dispatch(getUserNFTs(address) as any)
          }, 30000)
        })
        await tx.wait()
        await setPendingTxInfo(null)
      }
    } else {
      if (selectedNFTItem.contract_type === 'ERC721') {
        const contractInstance = getOmnixBridgeInstance(provider?._network?.chainId, signer)
        const erc721Instance = getERC721Instance(selectedNFTItem.token_address, 0, signer)
        const noSignerOmniXInstance = getOmnixBridgeInstance(targetChain, null)
        const dstAddress = await noSignerOmniXInstance.persistentAddresses(selectedNFTItem.token_address)

        noSignerOmniXInstance.on('LzReceive', async () => {
          // After 30 seconds from receiving the token on Target Chain, refresh user NFT items
          setTimeout(() => {
            dispatch(getUserNFTs(address) as any)
          }, 30000)
          // await switchNetwork(targetChain)
        })

        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        const operator = await erc721Instance.getApproved(BigNumber.from(selectedNFTItem.token_id))
        if (operator !== contractInstance.address) {
          await (await erc721Instance.approve(contractInstance.address, BigNumber.from(selectedNFTItem.token_id))).wait()
        }

        const tx = await contractInstance.wrap(lzTargetChainId, selectedNFTItem.token_address, BigNumber.from(selectedNFTItem.token_id), adapterParams, {
          value: estimatedFee
        })
        onLeave()
        await setPendingTxInfo({
          txHash: tx.hash,
          type: 'bridge',
          senderChainId: provider?._network?.chainId,
          targetChainId: targetChain,
          itemName: selectedNFTItem.name
        })
        await tx.wait()
        await setPendingTxInfo(null)
        setSelectedNFTItem(undefined)
      } else if (selectedNFTItem.contract_type === 'ERC1155') {
        const contractInstance = getOmnixBridge1155Instance(provider?._network?.chainId, signer)
        const noSignerOmniX1155Instance = getOmnixBridge1155Instance(targetChain, null)
        const erc1155Instance = getERC1155Instance(selectedNFTItem.token_address, 0, signer)
        const dstAddress = await noSignerOmniX1155Instance.persistentAddresses(selectedNFTItem.token_address)

        noSignerOmniX1155Instance.on('LzReceive', async () => {
          // After 30 seconds from receiving the token on Target Chain, refresh user NFT items
          setTimeout(() => {
            dispatch(getUserNFTs(address) as any)
          }, 30000)
          // await switchNetwork(targetChain)
        })

        let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 3500000])
        if (dstAddress !== ethers.constants.AddressZero) {
          adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 2000000])
        }
        const operator = await erc1155Instance.isApprovedForAll(_signerAddress, contractInstance.address)
        if (!operator) {
          await (await erc1155Instance.setApprovalForAll(contractInstance.address, true)).wait()
        }
        // Estimate fee from layerzero endpoint
        const _tokenURI = await erc1155Instance.uri(selectedNFTItem.token_id)
        const _payload = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'string', 'uint256', 'uint256'],
          [selectedNFTItem.token_address, _signerAddress, _tokenURI, selectedNFTItem.token_id, selectedNFTItem.amount]
        )
        const estimatedFee = await lzEndpointInstance.estimateFees(lzTargetChainId, contractInstance.address, _payload, false, adapterParams)

        const tx = await contractInstance.wrap(lzTargetChainId, selectedNFTItem.token_address, BigNumber.from(selectedNFTItem.token_id), BigNumber.from(selectedNFTItem.amount), adapterParams, {
          value: estimatedFee.nativeFee
        })
        onLeave()
        await setPendingTxInfo({
          txHash: tx.hash,
          type: 'bridge',
          senderChainId: provider?._network?.chainId,
          targetChainId: targetChain,
          itemName: selectedNFTItem.name
        })
        await tx.wait()
        await setPendingTxInfo(null)
        setSelectedNFTItem(undefined)
      }
    }

    setConfirmTransfer(false)
  }

  const handleUnwrap = useCallback(async () => {
    if (provider?._network?.chainId && unwrapInfo) {
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
          if (address) {
            dispatch(getUserNFTs(address) as any)
          }
        }, 30000)
      } catch (e: any) {
        console.log(e)
      } finally {
        setUnwrap(false)
      }
    }
  }, [provider?._network?.chainId, unwrapInfo, signer, address, dispatch])

  const onUnwrap = async () => {
    if (provider?._network?.chainId && selectedUnwrapInfo) {
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
          if (address) {
            dispatch(getUserNFTs(address) as any)
          }
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
 
  useEffect(()=>{
    if(window.ethereum){
      setChainID(parseInt(window.ethereum.networkVersion))
    }
  })
  if(window.ethereum){
    window.ethereum.on('chainChanged', function (networkId:string) {      
      setChainID(parseInt(networkId))
      //window.location.reload()

    }) 
  }

  const updateModal = (status: boolean) => {
    setConfirmTransfer(status)
  }

  useEffect(()=>{
    const getBalance = async() => {
      try {
        if(chainId===4){
          //OMNI
          const contractOmniAddress = omniAddress['rinkeby']
          const omniContract =  new ethers.Contract(contractOmniAddress, omni, signer)
          const omni_balance = await omniContract.balanceOf(address)
          setOmniBalance(Number(ethers.utils.formatEther(omni_balance)))
          //usdc
          const contractAddress = usdc['rinkeby']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const usdc_balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(usdc_balance)))
        } else if(chainId===43113) {
          //OMNI
          const contractOmniAddress = omniAddress['fuji']
          const omniContract =  new ethers.Contract(contractOmniAddress, omni, signer)
          const omni_balance = await omniContract.balanceOf(address)
          setOmniBalance(Number(ethers.utils.formatEther(omni_balance)))
          //usdc
          const contractAddress = usdc['fuji']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(balance)))
        } else if(chainId===80001) {
          const contractAddress = usdc['mumbai']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(balance)))
        } else if(chainId===421611) {
          const contractAddress = usdc['arbitrum-rinkeby']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(balance)))
        } else if(chainId===69) {
          const contractAddress = usdc['optimism-kovan']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(balance)))
        } else if(chainId===4002) {
          const contractAddress = usdc['fantom-testnet']
          const usdContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdContract.balanceOf(address)
          setUsdcBalance(Number(ethers.utils.formatEther(balance)))
        }
        if(chainId===97){
          //OMNI
          const contractOmniAddress = omniAddress['bsc-testnet']
          const omniContract =  new ethers.Contract(contractOmniAddress, omni, signer)
          const omni_balance = await omniContract.balanceOf(address)
          setOmniBalance(Number(ethers.utils.formatEther(omni_balance)))
          //usdt
          const contractAddress = usdt['bsc-testnet']
          const usdTContract =  new ethers.Contract(contractAddress, usd, signer)
          const balance = await usdTContract.balanceOf(address)
          setUsdtBalance(Number(ethers.utils.formatEther(balance)))
        }
      } catch (error) {
        console.log(error)
      }
    }
    if(signer!=undefined && address!=undefined){
      getBalance()
    }
  },[signer,address])
  const setLogout = async() => {
    console.log('clicked disconnect')
    await disconnect()
    window.location.reload()
  }
  
  return (
    <>
      { !onMenu &&
        <div
          className='right-0 right-0 w-[70px] py-6 bg-[#F6F8FC] fixed h-full z-[98]'
          onMouseEnter={() => setShowSidebar(true)}
          onMouseLeave={() => hideSidebar()}
        >
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full 0">
              <div className="sidebar-icon">
                <div className="m-auto">
                  <Image
                    src={avatarError || user.avatar === undefined || user.avatar === DEFAULT_AVATAR?'/images/default_avatar.png':(process.env.API_URL + user.avatar)}
                    alt="avatar"
                    onError={(e)=>{user.avatar&&setAvatarError(true)}}
                    width={45}
                    height={45}
                  />
                </div>
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                {
                  chainId === (env === 'testnet' ? 4 : 1) && <img src="/sidebar/ethereum.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 421611 : 1) && <img src="/sidebar/arbitrum.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 43113 : 1) && <img src="/sidebar/avax.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 97 : 1) && <img src="/sidebar/binance.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 4002 : 1) && <img src="/sidebar/fantom.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 69 : 1) && <img src="/sidebar/optimism.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === 80001 && <img src="/sidebar/polygon.png" className="m-auto h-[45px]" />
                }

              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/wallets.svg" className="m-auto" />
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/watchlist.svg" className="m-auto" />
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/bridge.svg" className="m-auto" />
              </div>
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/cart.svg" className="m-auto" />
              </div>
            </div>
          </div>
          
        </div>
      }
      <div
        ref={ref}
        className={`right-0 right-0 w-[450px] bg-w-600/[.8] backdrop-blur-sm pl-5 pr-2 py-6 fixed h-full z-[97] opacity-0.95 ease-in-out duration-300 ${
          showSidebar || onMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
        onMouseEnter={() => setOnMenu(true)}
        onMouseLeave={() => onLeaveMenu()}
      >
        <ul className='flex flex-col space-y-8 mr-[70px]'>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==1?'active':''}`}
              onClick={() => toggleMenu(1)}
            >
              My Profile
              <span className="pull-right">
                <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 1 &&
              <ul className='flex  flex-col w-full   pt-4 pb-0 text-g-600' ref={menu_profile}>
                <li className="w-full">
                  <button className="w-full flex justify-start py-[13px] pl-[100px] hover:bg-l-50">My Dashboard</button>
                </li>
                <li className="w-full">
                  <button className="w-full flex justify-start py-[13px] pl-[100px] hover:bg-l-50" onClick={()=>setOpenModal(true)}>Account Settings</button>
                </li>
                <li className="w-full">
                  <button className="w-full flex justify-start py-[13px] pl-[100px] hover:bg-l-50" onClick={()=>setLogout()}>Logout</button>
                </li>
              </ul>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==2?'active':''}`}
              onClick={() => toggleMenu(2)}
            >
              Network
              <span className="pull-right">
                <i className={`${expandedMenu == 2 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 2 &&
              <ul className='flex flex-col w-full   pt-4 pb-0 text-g-600' ref={menu_ethereum}>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px] " onClick={() => onClickNetwork(env === 'testnet' ? 4 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px]">
                        <img src="/svgs/ethereum.svg" width={24} height={28} />
                      </div>
                      <span className="flex items-center ml-4 " >Ethereum</span>
                    </div>                   
                  </button>
                </li>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 421611 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px] ">
                        <img src="/svgs/arbitrum.svg" width={24} height={28} />
                      </div>
                      <span className=" flex items-center ml-4 ">Arbitrum</span>
                    </div>  
                  </button>
                  
                </li>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 43113 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px] m-auto">
                        <img src="/svgs/avax.svg" width={24} height={28} />
                      </div>
                      <span className="flex items-center ml-4 w-[80px]">Avalanche</span>
                    </div>
                  </button>
                </li>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 97 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px] m-auto">
                        <img src="/svgs/binance.svg" width={24} height={28} />
                      </div>
                      <span className="flex items-center ml-4 w-[80px]">BNB Chain</span>
                    </div>
                  </button>
                </li>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 4002 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px] m-auto">
                        <img src="/svgs/fantom.svg" width={24} height={28} />
                      </div>
                      <span className="flex items-center ml-4 w-[80px]">Fantom</span>
                    </div>
                  </button>
                </li>
                <li className="w-full">
                  <button className="w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 69 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className=" flex items-center w-[36px] h-[36px] m-auto">
                        <img src="/svgs/optimism.svg" width={24} height={28} />
                      </div>
                      <span className="flex items-center ml-4 w-[80px]">Optimism</span>
                    </div>
                  </button>
                </li>
                <li className="w-full">
                  <button className="flex items-center w-full hover:bg-l-50 pl-[70px] py-[7px]" onClick={() => onClickNetwork(env === 'testnet' ? 80001 : 1)}>
                    <div className="flex flex-row w-[130px]">
                      <div className="flex items-center w-[36px] h-[36px] m-auto">
                        <img src="/svgs/polygon.svg" width={24} height={28} />
                      </div>
                      <span className="ml-4 w-[80px] flex items-center">Polygon</span>
                    </div>
                  </button>
                </li>
              </ul>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg  text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==3?'active':''}`}
              onClick={() => toggleMenu(3)}
            >
              Wallet
              <span className="pull-right">
                <i className={`${expandedMenu == 3 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 3 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_wallets}>
                <span className="font-semibold w-auto text-[16px]">OMNI balance: {omniBalance}</span>
                <span className="font-semibold w-auto text-[16px]">USDC balance: {usdcBalance}</span>
                <span className="font-semibold w-auto text-[16px]">USDT balance: {usdtBalance}</span>
                <span className="w-auto text-[16px]">Staking: coming soon</span>
                {/* <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="bg-g-200 w-[88px] px-[11px] py-[9px]">
                    APR
                    <span className="pull-right">50%</span>
                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    4652
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    $OMNI staked
                  </div>
                </div>
                <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="bg-g-200 w-[88px] px-[11px] py-[9px]">
                    Rewards
                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    52.42
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    $OMNI
                  </div>
                </div>
                <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="w-[88px] px-[11px] py-[9px]">

                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    43.17
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    $USDC
                  </div>
                </div>
                <span className="font-semibold w-auto text-[16px]">OMNI-USDC LP:</span>
                <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="bg-g-200 w-[88px] px-[11px] py-[9px]">
                    APR
                    <span className="pull-right">75%</span>
                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    17.652
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    LP staked
                  </div>
                </div>
                <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="bg-g-200 w-[88px] px-[11px] py-[9px]">
                    Rewards
                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    52.42
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    $OMNI
                  </div>
                </div>
                <div className="w-full flex flex-row font-semibold text-[14px]">
                  <div className="w-[88px] px-[11px] py-[9px]">

                  </div>
                  <div className="w-[60px] px-[11px] py-[9px]">
                    43.17
                  </div>
                  <div className="px-[11px] py-[9px] text-g-600">
                    $USDC
                  </div>
                </div>
                <div className="flex flex-row">
                  <span className="text-[14px]">*add/remove positions on profile dashboard</span>
                  <button className="w-[30px] h-[30px] bg-wallet-output"></button>
                </div> */}
              </div>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px]  py-[12px] pr-[70px] text-xg  text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==4?'active':''}`}
              onClick={() => toggleMenu(4)}
            >
              Watchlist
              <span className="pull-right">
                <i className={`${expandedMenu == 4 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 4 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_watchlist}>
                <div className="p-[51px] flex flex-col items-center border border-dashed border-g-300">
                  {/* <span className="text-[14px] text-g-300">Drag & Drop</span>
                  <span className="text-[14px] text-g-300">an NFT or NFT Collection</span>
                  <span className="text-[14px] text-g-300">to add your watch list</span> */}
                  <span className="text-[14px] text-g-300">coming soon</span>
                </div>
              </div>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full p-6  pr-[70px]  py-[12px] text-xg text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==5?'active':''}`}
              onClick={() => fixMenu(5)}
            >
              Send/Bridge
              <span className="pull-right">
                <i className={`${expandedMenu == 5 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 5 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_bridge}>
                <div ref={setNodeRef} className="px-[113px] py-[43px] flex flex-col items-center border border-dashed border-g-300 bg-g-200" style={dragOver ? {opacity: 0.4} : {opacity: 1}}>
                  {
                    dragOver
                      ?
                      <div className="">Drop</div>
                      :
                      (
                        !dragEnd &&
                        <img src="/sidebar/attach.png" />
                      )
                  }
                  {
                    selectedNFTItem &&
                      <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
                        <img src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} />
                      </LazyLoad>
                  }
                </div>
                <span className="font-g-300">Select destination chain:</span>
                <div className="flex flex-row w-full space-x-[15px]">
                  <button onClick={() => handleTargetChainChange(4)} className={targetChain === 4 ? 'border border-g-300' : ''}>
                    <img src="/svgs/ethereum.svg" width={24} height={28} />
                  </button>
                  <button onClick={() => handleTargetChainChange(97)} className={targetChain === 97 ? 'border border-g-300' : ''}>
                    <img src="/svgs/binance.svg" width={29} height={30} />
                  </button>
                  <button onClick={() => handleTargetChainChange(43113)} className={targetChain === 43113 ? 'border border-g-300' : ''}>
                    <img src="/svgs/avax.svg" width={23} height={35} />
                  </button>
                  <button onClick={() => handleTargetChainChange(80001)} className={targetChain === 80001 ? 'border border-g-300' : ''}>
                    <img src="/svgs/polygon.svg" width={34} height={30} />
                  </button>
                  <button onClick={() => handleTargetChainChange(421611)} className={targetChain === 421611 ? 'border border-g-300' : ''}>
                    <img src="/svgs/arbitrum.svg" width={35} height={30} />
                  </button>
                  <button onClick={() => handleTargetChainChange(69)} className={targetChain === 69 ? 'border border-g-300' : ''}>
                    <img src="/svgs/optimism.svg" width={25} height={25} />
                  </button>
                  <button onClick={() => handleTargetChainChange(4002)} className={targetChain === 4002 ? 'border border-g-300' : ''}>
                    <img src="/svgs/fantom.svg" width={25} height={25} />
                  </button>
                </div>
                {
                  isONFT
                    ?
                    <button className="bg-g-400 text-white w-[172px] py-[10px] rounded-full m-auto" onClick={onUnwrap}>
                      Unwrap
                    </button>
                    :
                    <button className="bg-g-400 text-white w-[172px] py-[10px] rounded-full m-auto" onClick={handleTransfer}>
                      Transfer
                    </button>
                }
              </div>
            }
          </li>
          <li className="w-full">
            <button
              className={`w-full text-left rounded-full px-[24px] py-[12px] pr-[70px] text-xg  text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-ml sidebar ${expandedMenu==6?'active':''}`}
              onClick={() => toggleMenu(6)}
            >
              Cart
              <span className="pull-right">
                <i className={`${expandedMenu == 6 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
              </span>
            </button>
            { expandedMenu == 6 &&
              <div className='flex flex-col w-full space-y-4 p-6 pt-8 pb-0' ref={menu_cart}>
                <div className="px-[113px] py-[43px] flex flex-col items-center border border-dashed border-g-300 bg-g-200">
                  <img src="/sidebar/attach.png" />
                </div>
                <button className="bg-gr-100 text-white w-[172px] py-[10px] rounded-full m-auto">
                  Buy
                </button>
              </div>
            }
          </li>
        </ul>
        
        <div
          className='top-0 right-0 w-[70px] py-6 bg-white fixed h-full z-[99]'
        >
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full 0">
              <div className="sidebar-icon">
                <div className="m-auto">
                  <Image
                    src={avatarError || user.avatar === undefined || user.avatar === DEFAULT_AVATAR?'/images/default_avatar.png':(process.env.API_URL + user.avatar)}
                    alt="avatar"
                    onError={(e)=>{user.avatar&&setAvatarError(true)}}
                    width={45}
                    height={45}
                  />
                </div>
              </div>
              { expandedMenu == 1 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                {
                  chainId === (env === 'testnet' ? 4 : 1) && <img src="/sidebar/ethereum.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 421611 : 1) && <img src="/sidebar/arbitrum.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 43113 : 1) && <img src="/sidebar/avax.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 97 : 1) && <img src="/sidebar/binance.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 4002 : 1) && <img src="/sidebar/fantom.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 69 : 1) && <img src="/sidebar/optimism.png" className="m-auto h-[45px]" />
                }
                {
                  chainId === (env === 'testnet' ? 80001 : 1) && <img src="/sidebar/polygon.png" className="m-auto h-[45px]" />
                }
              </div>
              { expandedMenu == 2 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/wallets.svg" className="m-auto" />
              </div>
              { expandedMenu == 3 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/watchlist.svg" className="m-auto" />
              </div>
              { expandedMenu == 4 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/bridge.svg" className="m-auto" />
              </div>
              { expandedMenu == 5 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
            <div className="w-full 0">
              <div className="sidebar-icon">
                <img src="/sidebar/cart.svg" className="m-auto" />
              </div>
              { expandedMenu == 6 &&
                <ul className='flex flex-col w-full space-y-4 p-6 pt-8' style={{height: offsetMenu + 'px'}}>
                </ul>
              }
            </div>
          </div>
          
        </div>
   
      </div>
        
      
      <div className="w-full md:w-auto">
        <Dialog open={confirmTransfer} onClose={() => setConfirmTransfer(false)}>
          <ConfirmTransfer
            updateModal={updateModal}
            onTransfer={onTransfer}
            selectedNFTItem={selectedNFTItem}
            estimatedFee={estimatedFee}
            senderChain={chainId || 4}
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
        <UserEdit updateModal={()=>setOpenModal(false)} />
      </Dialog>
    </>
  )
}

export default SideBar
