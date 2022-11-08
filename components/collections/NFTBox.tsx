import React, {useMemo} from 'react'
import {useState} from 'react'
import Link from 'next/link'
import LazyLoad from 'react-lazyload'
import Router, { useRouter } from 'next/router'
import { useDraggable } from '@dnd-kit/core'
import { IPropsNFTItem } from '../../interface/interface'
import {
  getCurrencyIconByAddress,
  getChainIconById,
  numberLocalize
} from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import useData from '../../hooks/useData'
import useOrderStatics from '../../hooks/useOrderStatics'
import { useModal } from '../../hooks/useModal'
import { ModalIDs } from '../../contexts/modal'

const NFTBox = ({nft, col_url, onRefresh}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [isShowBtn, SetIsShowBtn] = useState(false)
  const { address } = useWallet()
  const router = useRouter()
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
    return getChainIconById(nft && nft.chain_id ? nft.chain_id.toString() : '5')
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
    return router.pathname === '/collections/[collection]'
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

  const doubleClickToSetDetailLink = () => {
    if (isHomePage && nft_collection?.col_url) {
      Router.push(`/collections/${nft_collection?.col_url}/${nft.token_id}`)
    }
  }

  const renderImageContainer = () => {
    return (
      <>
        <div
          className="nft-image-container group relative flex justify-center text-center overflow-hidden rounded-md"
          ref={isHomePage ? setNodeRef : null}
          style={isHomePage ? style : {}}
          {...(isHomePage ? listeners : {})}
          {...(isHomePage ? attributes : {})}
        >
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img
              className='nft-image rounded-md object-cover duration-300'
              src={imageError ? '/images/omnix_logo_black_1.png' : image}
              alt="nft-image"
              onError={() => { setImageError(true) }}
              data-src={image}
              onDoubleClick={doubleClickToSetDetailLink}
            />
          </LazyLoad>
        </div>
        <div className="flex flex-row mt-2.5 justify-between align-middle font-['RetniSans']">
          <div className="ml-3 text-[#000000] text-[14px] font-bold">
            {nftName}
          </div>
          <div className="mr-3 flex items-center">
            <div className="flex items-center ml-1">
              <img alt='chainIcon' src={chainIcon} className="w-[16px] h-[16px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
          <div className="flex items-center ml-3">
            {isListed && <>
              <img src={currencyIcon || '/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon'/>
              <span className="text-[#000000] text-[18px] font-extrabold ml-2">{numberLocalize(Number(nft?.price || 0))}</span>
            </>}
          </div>
        </div>
      </>
    )
  }

  const renderSaleFooter = () => {
    return (
      <div className="flex items-center ml-3">
        {(!!lastSale && lastSale > 0) && <>
          <span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span>
          <img alt={'saleIcon'} src={lastSaleCoin} className="w-[18px] h-[18px]"/>&nbsp;
          <span
            className="text-[#6C757D] text-[14px]font-bold">{numberLocalize(Number(lastSale))}</span>
        </>}
        {(!lastSale && !!highestBid && highestBid > 0) && <>
          <span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span>
          <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
          <span
            className="text-[#6C757D] text-[14px] font-bold">{numberLocalize(Number(highestBid))}</span>
        </>}
      </div>
    )
  }

  return (
    <div
      className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'
      onMouseEnter={() => SetIsShowBtn(true)}
      onMouseLeave={() => SetIsShowBtn(false)}
    >
      {
        (isHomePage || isUserPage) && renderImageContainer()
      }
      {
        isCollectionPage &&
        <Link href={`/collections/${col_url}/${nft.token_id}`}>
          <a>
            {renderImageContainer()}
          </a>
        </Link>
      }
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
        {(isHomePage || isUserPage) && renderSaleFooter()}
        {
          isCollectionPage &&
          <Link href={`/collections/${col_url}/${nft.token_id}`}>
            <a>
              {renderSaleFooter()}
            </a>
          </Link>
        }
        <div className="flex items-center ml-3">
          {isShowBtn && isOwner && isWhitelisted && (
            <div
              className="ml-2 mr-2 py-[1px] px-2 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] cursor-pointer font-blod hover:bg-[#B00000]"
              onClick={() => {
                openModal(ModalIDs.MODAL_LISTING, {
                  nftImage: image,
                  nftTitle: nftName,
                  tradingInput,
                  handleSellDlgClose: closeModal
                })
              }}>
              {'Sell'}
            </div>
          )}
          {isShowBtn && !isOwner && isListed && isWhitelisted && (
            <div
              className="ml-2 mr-2 py-[1px] px-2 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] cursor-pointer font-blod hover:bg-[#38B000]"
              onClick={() => {
                openModal(ModalIDs.MODAL_BUY, {
                  nftImage: image,
                  nftTitle: nftName,
                  order,
                  tradingInput,
                  handleBuyDlgClose: closeModal
                })
              }}>
              {'Buy now'}
            </div>
          )}
          {isShowBtn && !isOwner && !isListed && isWhitelisted && (
            <div
              className="ml-2 mr-2 py-[1px] px-2 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] cursor-pointer font-blod hover:bg-[#38B000]"
              onClick={() => {
                openModal(ModalIDs.MODAL_BID, {
                  nftImage: image,
                  nftTitle: nftName,
                  tradingInput,
                  handleBidDlgClose: closeModal
                })
              }}>
              {'Bid'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTBox
