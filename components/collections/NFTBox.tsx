import React, {useState, useMemo, Fragment} from 'react'
import LazyLoad from 'react-lazyload'
import {useDispatch} from 'react-redux'
import {Transition} from '@headlessui/react'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useDraggable } from '@dnd-kit/core'
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
import {GreenButton} from "../common/buttons/GreenButton";

const NFTBox = ({nft, col_url, onRefresh}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [boxHovered, setBoxHovered] = useState(false)
  const [dotHover, setDotHover] = useState(false)
  const [isFullscreenView, setIsFullscreenView] = useState(false)
  const [confirmTransfer, setConfirmTransfer] = useState(false)

  const { address } = useWallet()
  const router = useRouter()
  const dispatch = useDispatch()
  const { collections } = useData()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${nft.token_id}-${nft.collection_address}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined

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

  const isUserPage = useMemo(() => {
    return router.pathname === '/user/[address]'
  }, [router.pathname])

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
    if (isCollectionPage && nft && nft.name) {
      return nft.name
    }
    return JSON.parse(nft.metadata || '{}')?.name
  }, [nft, isCollectionPage])

  const image = useMemo(() => {
    if (isHomePage || isUserPage) {
      const metadata = nft?.metadata
      if (metadata) {
        try {
          // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
          const image_uri = JSON.parse(metadata).image
          if (image_uri)
            return image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
        } catch (err) {
          console.log('While fetching NFTBOX image:', err)
        }
      }
      return '/images/omnix_logo_black_1.png'
    }
    if (nft && nft.image) {
      return nft.image
    }
    return '/images/omnix_logo_black_1.png'
  }, [isHomePage, isUserPage, nft])

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
    setConfirmTransfer(true)
  }

  const updateModal = (status: boolean) => {
    setConfirmTransfer(status)
  }

  const renderImageContainer = () => {
    return (
      <>
        <div
          className="nft-image-container group relative flex justify-center text-center overflow-hidden rounded-tr-[8px] rounded-tl-[8px]"
          ref={isHomePage ? setNodeRef : null}
          style={isHomePage ? style : {}}
          {...(isHomePage ? listeners : {})}
          {...(isHomePage ? attributes : {})}
        >
          <Link href={`/collections/${col_url}/${nft.token_id}`}>
            <div className="w-full h-full">
              <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
                <img
                  className='rounded-tr-[8px] rounded-tl-[8px] object-contain object-center  hover:backdrop-blur-[2px] hover:rounded-tr-[8px] hover:rounded-tl-[8px] duration-300 absolute top-0 bottom-0 left-0 right-0'
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
            <div>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5023 2.75601L11.5024 2.75588C11.9009 2.35715 12.3741 2.04085 12.895 1.82505C13.4158 1.60924 13.974 1.49817 14.5378 1.49817C15.1015 1.49817 15.6598 1.60924 16.1806 1.82505C16.7014 2.04085 17.1746 2.35715 17.5732 2.75588L17.5734 2.75613C17.9721 3.15467 18.2884 3.62787 18.5042 4.14869C18.72 4.66951 18.8311 5.22775 18.8311 5.79151C18.8311 6.35527 18.72 6.9135 18.5042 7.43432C18.2884 7.95514 17.9721 8.42834 17.5734 8.82689L17.5733 8.82701L16.6016 9.79868L10.0003 16.4L3.39893 9.79868L2.42727 8.82701C1.6222 8.02195 1.16992 6.93004 1.16992 5.79151C1.16992 4.65297 1.6222 3.56107 2.42727 2.75601C3.23233 1.95094 4.32424 1.49866 5.46277 1.49866C6.60131 1.49866 7.69321 1.95094 8.49828 2.75601L9.46994 3.72767C9.76283 4.02057 10.2377 4.02057 10.5306 3.72767L11.5023 2.75601Z" stroke="#FF166A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className='text-md text-[#FF166A]'>
              24
            </span>
          </div>
        </div>
        <div className={'flex flex-col justify-between min-h-[100px] p-3'}>
          <div className="flex flex-col-1 flex-row justify-between items-center">
            <div className="text-md text-secondary font-bold">
              {nft.token_id}
            </div>
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
                {!isOwner && isCollectionPage && (
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
                {
                  isOwner &&
                    <PrimaryButton text={'send'} className={'px-[23px]'} onClick={onTransfer} />
                }
                {/*{!isOwner && !isListed && isCollectionPage && (
          <div
            className="font-bold w-full h-full flex items-center justify-center"
            onClick={() => {
              openModal(ModalIDs.MODAL_BID, {
                nftImage: image,
                nftTitle: nftName,
                nftTokenId: nft.token_id,
                collectionName: nft_collection?.name,
                tradingInput,
                handleBidDlgClose: closeModal
              })
            }}>
            {'bid'}
          </div>
        )}*/}
                <div className={'w-8 flex items-center justify-center cursor-pointer'}
                  onClick={() => setDotHover(!dotHover)}>
                  <img src={`/images/icons/${dotHover ? 'vertical' : 'horizontal'}-dots.png`} alt={'dots'}/>
                </div>
              </div>
              :
              <>
                <div className="flex flex-col-1 flex-row justify-between items-center">
                  <div className="flex items-center">
                    {isListed && <>
                      <img src={currencyIcon || '/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon'/>
                      <span className="text-primary-light text-md font-extrabold ml-2">
                        {numberLocalize(Number(nft?.price || 0))}
                      </span>
                    </>}
                  </div>
                </div>
                <div className="flex flex-col-1 items-center justify-between w-full">
                  <div>
                    {(!!lastSale && lastSale > 0) && <div className={'flex items-center'}>
                      <span className="text-secondary text-sm font-bold">last sale: &nbsp;</span>
                      <img alt={'saleIcon'} src={lastSaleCoin} className="w-[18px] h-[18px]"/>&nbsp;
                      <span
                        className="text-secondary text-sm font-bold">{numberLocalize(Number(lastSale))}</span>
                    </div>}
                    {(!lastSale && !!highestBid && highestBid > 0) && <div className={'flex items-center'}>
                      <span className="text-[#6C757D] text-md font-bold">highest offer: &nbsp;</span>
                      <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
                      <span
                        className="text-secondary text-sm font-bold">{numberLocalize(Number(highestBid))}</span>
                    </div>}
                  </div>
                </div>
              </>
          }
        </div>
      </>
    )
  }

  return (
    <div className={'flex justify-center max-w-[300px]'}>
      <div
        className='relative rounded-lg bg-[#202020] hover:shadow-[0_0_20px_rgba(245,245,245,0.22)] w-full'
        onMouseEnter={() => setBoxHovered(true)}
        onMouseLeave={() => {
          setBoxHovered(false)
          setDotHover(false)
        }}
      >
        <div className="w-full">
          {renderImageContainer()}
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
                    <div className={'mr-2'}>
                      <img src={'/images/icons/nftbox/creator_follow.svg'} alt={'star'} width={32} height={32}/>
                    </div>
                    <span className={'text-primary-light text-md'}>follow creator</span>
                  </div>
                  <div className={'flex items-center px-2 cursor-pointer'} onClick={onCopyToClipboard}>
                    <div className={'p-1 mr-2'}>
                      <img src={'/images/icons/nftbox/link.svg'} alt={'star'} width={24} height={24}/>
                    </div>
                    <span className={'text-primary-light text-md'}>copy link</span>
                  </div>
                  <div className={`flex items-center px-2 ${!isOwner && !isListed ? 'cursor-pointer' : 'cursor-none'}`}
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
                  </div>
                </>
            }
          </div>
        </Transition>

        {/*{
        boxHovered &&
        <div className={'absolute top-2 w-full flex items-center justify-between px-2'}>
          <div className={'w-10 h-10'}>
            {
              isOwner && isWhitelisted &&
                <img src={'/images/icons/bridge-active.png'} alt={'bridge icon'} />
            }
          </div>
          <div className={'flex items-center space-x-2'}>
            <img src={'/images/icons/fullscreen-active.png'} alt={'fullscreen icon'} />
            <img src={'/images/icons/yellow-star-active.png'} alt={'yellow-star icon'} />
          </div>
        </div>
      }*/}
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
