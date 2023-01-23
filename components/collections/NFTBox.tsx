import React, {useState, useMemo, Fragment} from 'react'
import LazyLoad from 'react-lazyload'
import {useDispatch} from 'react-redux'
import {Transition} from '@headlessui/react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useSwitchNetwork } from 'wagmi'
import { IPropsNFTItem } from '../../interface/interface'
import {
  getCurrencyIconByAddress,
  numberLocalize,
  getDarkChainIconById,
} from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import useData from '../../hooks/useData'
import useOrderStatics from '../../hooks/useOrderStatics'
import { useModal } from '../../hooks/useModal'
import { ModalIDs } from '../../contexts/modal'
import {openSnackBar} from '../../redux/reducers/snackBarReducer'
import {NFTBoxFullscreenDialog} from './FullscreenDialog'
import { collectionsService } from '../../services/collections'
import {userService} from '../../services/users'
import ConfirmTransfer from '../bridge/ConfirmTransfer'
import {DangerButton} from '../common/buttons/DangerButton'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import {GreenButton} from '../common/buttons/GreenButton'
import {TextBodyemphasis, TextH3, TextSubtext} from '../basic'

const NFTBox = ({nft, col_url, onRefresh}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [boxHovered, setBoxHovered] = useState(false)
  const [dotHover, setDotHover] = useState(false)
  const [isFullscreenView, setIsFullscreenView] = useState(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)

  const { address, chainId } = useWallet()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const dispatch = useDispatch()
  const { collections } = useData()

  const nft_collection = useMemo(() => {
    return collections.find((collection) => {
      if (collection.address && collection.address[nft.chain_id] && nft.collection_address) {
        return collection.address[nft.chain_id].toLowerCase() === nft.collection_address.toLowerCase()
      }
    })
  }, [collections, nft])

  const collection_address_map = useMemo(() => {
    if (nft_collection) {
      return nft_collection.address
    }
  }, [nft_collection])

  const order = nft.order_data

  const {
    isListed,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  } = useOrderStatics({
    nft,
    collection: nft_collection
  })

  const { openModal, closeModal } = useModal()
  const tradingInput = {
    collectionUrl: nft_collection?.col_url,
    collectionAddressMap: collection_address_map,
    tokenId: nft?.token_id,
    selectedNFTItem: nft,
    onRefresh
  }

  const chainIcon = useMemo(() => {
    return getDarkChainIconById(nft && nft.chain_id ? nft.chain_id.toString() : '5')
  }, [nft])
  const currencyIcon = getCurrencyIconByAddress(nft.currency)

  const isOwner = nft?.owner?.toLowerCase() === address?.toLowerCase()

  const isHomePage = useMemo(() => {
    return router.pathname === '/'
  }, [router.pathname])

  const isCollectionPage = useMemo(() => {
    return router.pathname === '/collections/[collection]' || router.pathname === '/playground'
  }, [router.pathname])

  const isWhitelisted = useMemo(() => {
    if (isCollectionPage) {
      return true
    }
    return !!nft_collection
  }, [nft_collection, isCollectionPage])

  const nftName = useMemo(() => {
    if (nft && nft.name) {
      return nft.name
    }
    return ''
  }, [nft])

  const image = useMemo(() => {
    if (nft && nft.image) {
      return nft.image
    }
    return '/images/omnix_logo_black_1.png'
  }, [nft])

  const doubleClickToSetDetailLink = async () => {
    if (isHomePage && nft_collection?.col_url) {
      await Router.push(`/collections/${nft_collection?.col_url}/${nft.token_id}`)
    }
  }

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.host + `/collections/${nft_collection?.col_url}/${nft.token_id}`)
    dispatch(openSnackBar({ message: 'copied link to clipboard', status: 'info' }))
  }

  const onRefreshMetadata = async () => {
    if (nft_collection?.col_url) {
      try {
        await collectionsService.refreshMetadata(nft_collection.col_url, nft.token_id)
        dispatch(openSnackBar({ message: 'Metadata will be synced in a few minutes', status: 'info' }))
      } catch (e) {
        console.error(e)
      }
    }
  }

  const setAsPfp = async () => {
    if (address) {
      try {
        await userService.updateProfileImage(address, nft.image)
        dispatch(openSnackBar({ message: 'pfp image is updated', status: 'info' }))
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onTransfer = () => {
    if (chainId !== nft.chain_id) {
      return switchNetwork ? switchNetwork(nft.chain_id) : dispatch(openSnackBar({ message: 'Please switch to correct network', status: 'error' }))
    }
    setConfirmTransfer(true)
  }

  const updateModal = (status: boolean) => {
    setConfirmTransfer(status)
  }

  return (
    <div className={'flex justify-center w-full max-w-[330px]'}>
      <div
        className='relative rounded-lg bg-[#202020] hover:shadow-[0_0_20px_rgba(245,245,245,0.22)] w-full'
        onMouseEnter={() => setBoxHovered(true)}
        onMouseLeave={() => {
          setBoxHovered(false)
          setDotHover(false)
        }}
      >
        <div className="w-full">
          <div className="nft-image-container w-full group relative flex justify-center text-center overflow-hidden rounded-tr-[8px] rounded-tl-[8px]">
            <Link href={`/collections/${col_url}/${nft.token_id}`}>
              <div className="w-full h-full cursor-pointer">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
                  <img
                    className='rounded-tr-[8px] rounded-tl-[8px] object-fill object-center  hover:backdrop-blur-[2px] hover:rounded-tr-[8px] hover:rounded-tl-[8px] duration-300 absolute top-0 bottom-0 left-0 right-0'
                    src={imageError ? '/images/omnix_logo_black_1.png' : image}
                    alt="nft-image"
                    onError={() => { setImageError(true) }}
                    data-src={image}
                    onDoubleClick={doubleClickToSetDetailLink}
                  />
                </LazyLoad>
              </div>
            </Link>
            <div className={`flex absolute top-3 left-3 rounded-[20px] bg-primary opacity-80 items-center px-2 py-1.5 space-x-1 ${boxHovered ? 'block' : 'hidden'}`}>
              <div className={'relative w-5 h-5'}>
                <img src={'/images/icons/nftbox/heart.svg'} alt={'heart'}/>
              </div>
              {/*<span className='text-md text-like'>
                24
              </span>*/}
            </div>
            <div className={`absolute w-8 h-8 top-3 right-3 ${boxHovered ? 'block' : 'hidden'}`}>
              <img src={'/images/icons/nftbox/plus_circle_default.svg'} alt={'circle'} />
            </div>
          </div>
          <div className={'flex flex-col justify-between min-h-[100px] p-3'}>
            <div className="flex flex-col-1 flex-row justify-between items-center">
              <TextBodyemphasis className="text-secondary">
                {nft.token_id}
              </TextBodyemphasis>
              <img src={chainIcon} alt={'chainicon'} width={18} height={18} />
            </div>
            {
              boxHovered
                ?
                <div className={'flex items-center justify-between'}>
                  {isOwner && isWhitelisted && (
                    <DangerButton text={'sell'} className={'px-6'} onClick={() => {
                      openModal(ModalIDs.MODAL_LISTING, {
                        nftImage: image,
                        nftTitle: nftName,
                        nftTokenId: nft.token_id,
                        collectionName: nft_collection?.name,
                        tradingInput,
                        handleSellDlgClose: closeModal
                      })
                    }} />
                  )}
                  {!isOwner && isListed && isCollectionPage && (
                    <GreenButton text={'buy'} className={'w-[120px]'} onClick={() => {
                      openModal(ModalIDs.MODAL_BUY, {
                        nftImage: image,
                        nftTitle: nftName,
                        nftTokenId: nft.token_id,
                        collectionName: nft_collection?.name,
                        order,
                        tradingInput,
                        handleBuyDlgClose: closeModal
                      })
                    }} />
                  )}
                  {!isOwner && !isListed && (
                    <GreenButton text={'bid'} className={'w-[120px]'} onClick={() => {
                      openModal(ModalIDs.MODAL_BID, {
                        nftImage: image,
                        nftTitle: nftName,
                        nftTokenId: nft.token_id,
                        collectionName: nft_collection?.name,
                        tradingInput,
                        handleBidDlgClose: closeModal
                      })
                    }} />
                  )}
                  {
                    isOwner &&
                    <PrimaryButton text={'send'} className={'px-[23px]'} onClick={onTransfer} />
                  }
                  <div className={'w-8 h-8 flex items-center justify-center cursor-pointer'}
                    onClick={() => setDotHover(!dotHover)}>
                    <div className={`${dotHover ? 'rotate-90' : ''} duration-300 flex items-center justify-center`}>
                      <svg width="19" height="3" viewBox="0 0 19 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 1.5C11 0.671573 10.3284 0 9.5 0C8.67157 0 8 0.671573 8 1.5C8 2.32843 8.67157 3 9.5 3C10.3284 3 11 2.32843 11 1.5Z" fill={dotHover ? '#00F0EC' : '#969696'}/>
                        <path d="M4 1.5C4 0.671573 3.32843 0 2.5 0C1.67157 0 1 0.671573 1 1.5C1 2.32843 1.67157 3 2.5 3C3.32843 3 4 2.32843 4 1.5Z" fill={dotHover ? '#00F0EC' : '#969696'}/>
                        <path d="M18 1.5C18 0.671573 17.3284 0 16.5 0C15.6716 0 15 0.671573 15 1.5C15 2.32843 15.6716 3 16.5 3C17.3284 3 18 2.32843 18 1.5Z" fill={dotHover ? '#00F0EC' : '#969696'}/>
                      </svg>
                    </div>
                  </div>
                </div>
                :
                <>
                  <div className="flex flex-col-1 flex-row justify-between items-center">
                    <div className="flex items-center">
                      {isListed && <>
                        <img src={currencyIcon || '/images/currency/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon'/>
                        <TextH3 className="text-primary-light ml-2">
                          {numberLocalize(Number(nft?.price || 0))}
                        </TextH3>
                      </>}
                    </div>
                  </div>
                  <div className="flex flex-col-1 items-center justify-between w-full">
                    <div>
                      {(!!lastSale && lastSale > 0) && <div className={'flex items-center'}>
                        <TextSubtext className="text-secondary">last sale: &nbsp;</TextSubtext>
                        <img alt={'saleIcon'} src={lastSaleCoin} className="w-[18px] h-[18px]"/>&nbsp;
                        <TextSubtext className="text-secondary">{numberLocalize(Number(lastSale))}</TextSubtext>
                      </div>}
                      {(!lastSale && !!highestBid && highestBid > 0) && <div className={'flex items-center'}>
                        <TextSubtext className="text-secondary">highest offer: &nbsp;</TextSubtext>
                        <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
                        <TextSubtext className="text-secondary">{numberLocalize(Number(highestBid))}</TextSubtext>
                      </div>}
                    </div>
                  </div>
                </>
            }
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease duration-150 transform origin-bottom"
          enterFrom="opacity-0 scale-y-0"
          enterTo="opacity-100 scale-y-100"
          leave="transition ease duration-150 transform"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={dotHover}
        >
          <div
            className={'absolute w-full left-0 right-0 top-0 bg-[#202020] rounded-tr rounded-tl grid grid-rows-6 grid-flow-col gap-1'}
            style={{height: 'calc(100% - 60px)'}} onMouseLeave={() => {
              setDotHover(false)
            }}>
            {
              (isOwner && isWhitelisted) &&
              <>
                <div className={'flex items-center px-2 rounded-tr-[8px] rounded-tl-[8px]'}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/star.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>favorite</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={() => setIsFullscreenView(true)}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/fullscreen.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>fullscreen view</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={setAsPfp}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/pfp.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>set as pfp</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={onCopyToClipboard}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/link.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>copy link</span>
                </div>
                <div className={'flex items-center px-2'}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/hide.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>hide</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={onRefreshMetadata}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/refresh.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>refresh metadata</span>
                </div>
              </>
            }
            {
              (!isOwner && isWhitelisted) &&
              <>
                <div className={'flex items-center justify-between px-4 pt-2'}>
                  <div className={'text-md text-secondary font-bold'}>
                    {nft.token_id}
                  </div>
                  <img src={chainIcon} alt={'chainicon'} width={18} height={18} />
                </div>
                <div className={'flex items-center px-2'}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/star.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>favorite</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={() => setIsFullscreenView(true)}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/fullscreen.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>fullscreen view</span>
                </div>
                <a href={`https://chat.blockscan.com/index?a=${nft.owner}`} target="_blank" rel="noreferrer"
                  className={'flex items-center px-2'}>
                  <div className={'flex items-center'}>
                    <div className={'p-1 mr-2'}>
                      <img src={'/images/icons/nftbox/chat.svg'} alt={'star'} width={24} height={24}/>
                    </div>
                    <span className={'text-primary-light text-md'}>message owner</span>
                  </div>
                </a>
                <div className={'flex items-center px-2'}>
                  <div className={'mr-2 p-1'}>
                    <img src={'/images/icons/nftbox/creator_follow.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>follow creator</span>
                </div>
                <div className={'flex items-center px-2 cursor-pointer'} onClick={onCopyToClipboard}>
                  <div className={'p-1 mr-2'}>
                    <img src={'/images/icons/nftbox/link.svg'} alt={'star'} width={24} height={24}/>
                  </div>
                  <span className={'text-primary-light text-md'}>copy link</span>
                </div>
                {/*<div className={`flex items-center px-2 ${!isOwner && !isListed ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (!isOwner && !isListed) {
                        openModal(ModalIDs.MODAL_BID, {
                          nftImage: image,
                          nftTitle: nftName,
                          nftTokenId: nft.token_id,
                          collectionName: nft_collection?.name,
                          tradingInput,
                          handleBidDlgClose: closeModal
                        })
                      }
                    }
                    }>
                    <div className={'p-1 mr-2'}>
                      <img src={'/images/icons/nftbox/place_bid.svg'} alt={'star'} width={24} height={24}/>
                    </div>
                    <span className={'text-primary-light text-md'}>place a bid</span>
                  </div>*/}
              </>
            }
          </div>
        </Transition>
        <NFTBoxFullscreenDialog open={isFullscreenView} nftImage={image}
          closeModal={() => setIsFullscreenView(false)}/>
      </div>

      <ConfirmTransfer
        open={confirmTransfer}
        nft={nft}
        image={image}
        collectionName={nft_collection?.name || ''}
        onClose={() => setConfirmTransfer(false)}
        updateModal={updateModal}
      />
    </div>
  )
}

export default NFTBox
