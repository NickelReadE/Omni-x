import React, {useMemo} from 'react'
import {useState} from 'react'
import Link from 'next/link'
import LazyLoad from 'react-lazyload'
import Router, { useRouter } from 'next/router'
import { useDraggable } from '@dnd-kit/core'
import { IPropsNFTItem } from '../../interface/interface'
import {
  getCurrencyIconByAddress,
  numberLocalize, getDarkChainIconById
} from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import ConfirmBid from './ConfirmBid'
import useTrading from '../../hooks/useTrading'
import ConfirmSell from './ConfirmSell'
import ConfirmBuy from './ConfirmBuy'
import useData from '../../hooks/useData'
import useOrderStatics from '../../hooks/useOrderStatics'

const NFTBox = ({nft, col_url, onRefresh}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [boxHovered, setBoxHovered] = useState(false)
  const {
    provider,
    signer,
    address
  } = useWallet()
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
  } = useOrderStatics({nft})

  const {
    openBidDlg,
    openSellDlg,
    openBuyDlg,
    setOpenBidDlg,
    setOpenSellDlg,
    setOpenBuyDlg,
    onListingApprove,
    onListingConfirm,
    onListingDone,
    onBuyApprove,
    onBuyConfirm,
    onBuyComplete,
    onBuyDone,
    onBidApprove,
    onBidConfirm,
    onBidDone
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: nft_collection?.col_url,
    collection_address_map,
    owner_collection_chain_id: nft.chain_id,
    token_id: nft?.token_id,
    selectedNFTItem: nft,
    onRefresh
  })

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

  const doubleClickToSetDetailLink = async () => {
    if (isHomePage && nft_collection?.col_url) {
      await Router.push(`/collections/${nft_collection?.col_url}/${nft.token_id}`)
    }
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
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img
              className='nft-image rounded-tr-[8px] rounded-tl-[8px] object-cover duration-300'
              src={imageError ? '/images/omnix_logo_black_1.png' : image}
              alt="nft-image"
              onError={() => { setImageError(true) }}
              data-src={image}
              onDoubleClick={doubleClickToSetDetailLink}
            />
          </LazyLoad>
        </div>
        <div className={'flex flex-col justify-between min-h-[100px]'}>
          <div className="flex flex-col-1 flex-row py-2 px-3 justify-between items-center">
            <div className="text-md text-secondary font-bold">
              {nft.token_id}
            </div>
            <div className={'flex items-center'}>
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.64864 1.81096L9.64873 1.81087C9.98536 1.47408 10.3851 1.20691 10.825 1.02463C11.2649 0.842355 11.7364 0.748535 12.2126 0.748535C12.6888 0.748535 13.1603 0.842355 13.6002 1.02463C14.0401 1.20691 14.4398 1.47408 14.7765 1.81087L15.1301 1.45744L14.7766 1.81104C15.1134 2.14768 15.3806 2.54737 15.5629 2.98728C15.7451 3.4272 15.839 3.89872 15.839 4.3749C15.839 4.85109 15.7451 5.32261 15.5629 5.76252C15.3806 6.20244 15.1134 6.60213 14.7766 6.93877L14.7765 6.93885L13.9815 7.73385L8.50009 13.2153L3.01864 7.73385L2.22364 6.93885C1.54364 6.25885 1.16162 5.33657 1.16162 4.3749C1.16162 3.41324 1.54364 2.49096 2.22364 1.81096C2.90364 1.13096 3.82592 0.748936 4.78759 0.748936C5.74926 0.748936 6.67153 1.13096 7.35154 1.81096L8.14654 2.60596C8.3418 2.80122 8.65838 2.80122 8.85364 2.60596L9.64864 1.81096Z" stroke="url(#paint0_linear_329_6115)" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear_329_6115" x1="3.60112" y1="0.248535" x2="16.7643" y2="3.89337" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FA16FF"/>
                    <stop offset="1" stopColor="#F00056"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className={'bg-clip-text bg-like-gradient text-transparent text-md opacity-50 ml-2'}>24</span>
            </div>
          </div>
          <div className="flex flex-col-1 flex-row justify-between items-center pt-[2px] pb-[7px]">
            <div className="flex items-center ml-3">
              {isListed && <>
                <img src={currencyIcon || '/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon'/>
                <span className="text-primary-light text-md font-extrabold ml-2">
                  {numberLocalize(Number(nft?.price || 0))}
                </span>
              </>}
            </div>
          </div>
          <div className="flex flex-col-1 items-center justify-between w-full px-3 mt-4">
            {(!!lastSale && lastSale > 0) ? <div className={'flex items-center'}>
              <span className="text-secondary text-sm font-bold">last sale: &nbsp;</span>
              <img alt={'saleIcon'} src={lastSaleCoin} className="w-[18px] h-[18px]"/>&nbsp;
              <span
                className="text-secondary text-sm font-bold">{numberLocalize(Number(lastSale))}</span>
            </div>: <div /> }
            {(!lastSale && !!highestBid && highestBid > 0) && <div className={'flex items-center'}>
              <span className="text-[#6C757D] text-md font-bold">highest offer: &nbsp;</span>
              <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
              <span
                className="text-secondary text-sm font-bold">{numberLocalize(Number(highestBid))}</span>
            </div>}
            <img src={chainIcon} alt={'chainicon'} width={18} height={18} />
          </div>
        </div>
      </>
    )
  }

  return (
    <div
      className='relative rounded-[8px] bg-[#202020] hover:shadow-[0_0_20px_rgba(245,245,245,0.22)] pb-3'
      onMouseEnter={() => setBoxHovered(true)}
      onMouseLeave={() => setBoxHovered(false)}
    >
      <div className="w-full">
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
      </div>
      {
        boxHovered &&
        <div className={`absolute bottom-0 w-full bg-dark-${isOwner && isWhitelisted ? 'red' : 'green'} text-primary-light rounded-br-[8px] rounded-bl-[8px] h-10 flex items-center justify-center text-xg cursor-pointer`}>
          {isOwner && isWhitelisted && (
            <div
              className="font-bold"
              onClick={() => {setOpenSellDlg(true)}}>
              {'sell'}
            </div>
          )}
          {!isOwner && isListed && isWhitelisted && (
            <div
              className="font-bold"
              onClick={() => setOpenBuyDlg(true)}>
              {'buy'}
            </div>
          )}
          {!isOwner && !isListed && isWhitelisted && (
            <div
              className="font-bold"
              onClick={() => setOpenBidDlg(true)}>
              {'bid'}
            </div>
          )}
        </div>
      }

      {
        boxHovered &&
        <div className={'absolute top-2 w-full flex items-center justify-between px-2'}>
          <div className={'w-10 h-10'}>
            {
              isOwner && isWhitelisted &&
                <img src={'/images/icons/weird-active.png'} alt={'weird icon'} />
            }
          </div>
          <div className={'flex items-center space-x-2'}>
            <img src={'/images/icons/fullscreen-active.png'} alt={'fullscreen icon'} />
            <img src={'/images/icons/yellow-star-active.png'} alt={'yellow-star icon'} />
          </div>
        </div>
      }

      <ConfirmSell
        handleSellDlgClose={() => {
          setOpenSellDlg(false)
        }}
        openSellDlg={openSellDlg}
        nftImage={image}
        nftTitle={nftName}
        nftChainId={nft.chain_id}
        onListingApprove={onListingApprove}
        onListingConfirm={onListingConfirm}
        onListingDone={onListingDone}
      />
      <ConfirmBuy
        handleBuyDlgClose={() => {
          setOpenBuyDlg(false)
        }}
        openBuyDlg={openBuyDlg}
        nftImage={image}
        nftTitle={nftName}
        onBuyApprove={onBuyApprove}
        onBuyConfirm={onBuyConfirm}
        onBuyComplete={onBuyComplete}
        onBuyDone={onBuyDone}
        order={order}
      />
      <ConfirmBid
        onBidApprove={onBidApprove}
        onBidConfirm={onBidConfirm}
        onBidDone={onBidDone}
        handleBidDlgClose={() => {
          setOpenBidDlg(false)
        }}
        openBidDlg={openBidDlg}
        nftImage={image}
        nftTitle={nftName}
      />
    </div>
  )
}

export default NFTBox
