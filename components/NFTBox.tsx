import React, { useMemo } from 'react'
import { useState } from 'react'
import { IListingData, IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import { useDraggable } from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'
import useWallet from '../hooks/useWallet'
import { selectCollections } from '../redux/reducers/collectionsReducer'
import { useSelector } from 'react-redux'
import { getChainIconById, getChainIdFromName, getChainNameFromId, numberShortify } from '../utils/constants'
import Router, { useRouter } from 'next/router'
import useOrderStatics from '../hooks/useOrderStatics'
import useTrading from '../hooks/useTrading'
import { getCurrencyIconByAddress } from '../utils/constants'

const NFTBox = ({ nft, index, onRefresh }: IPropsNFTItem) => {
  const {
    provider,
    address,
    signer,
    chainId
  } = useWallet()
  const router = useRouter()

  const [imageError, setImageError] = useState(false)
  const [isShowBtn, SetIsShowBtn] = useState(false)
  const collections = useSelector(selectCollections)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${index}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined

  const image = useMemo(() => {
    const metadata = nft?.metadata
    if (metadata) {
      try {
        // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
        const image_uri = JSON.parse(metadata).image
        if (image_uri)
          return image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      } catch (err) {
        console.log('NFTBox err? ', err)
      }
    }
    return '/images/omnix_logo_black_1.png'
  }, [nft])

  const isUserPage = useMemo(() => {
    return router.pathname !== '/user/[address]'
  }, [router.pathname])

  const collection_address_map = useMemo(() => {
    if (chainId && nft && nft.token_address) {
      return {
        [getChainIdFromName(nft.chain)]: nft.token_address
      }
    }
    return []
  }, [chainId, nft])

  const {
    order,
    orderChainId,
    highestBid,
    highestBidCoin,
  } = useOrderStatics({ nft, collection_address_map })
  const order_collection_address = order?.collectionAddress
  const order_collection_chain = orderChainId && getChainNameFromId(orderChainId)

  const nft_collection = useMemo(() => {
    return collections?.find((c: any) => nft.name == c.name)
  }, [collections, nft])

  const {
    openSellDlg,
    setOpenSellDlg,
    onListing
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: nft_collection?.col_url,
    collection_address: nft.token_address,
    collection_chain: chainId ? getChainNameFromId(chainId) : '',
    order_collection_address,
    order_collection_chain,
    owner: address,
    owner_collection_address: nft.token_address,
    owner_collection_chain: nft.chain,
    owner_collection_chain_id: nft.chain_id,
    token_id: nft?.token_id,
    selectedNFTItem: nft
  })

  const doubleClickToSetDetailLink = () => {
    const { pathname } = Router
    if (pathname == '/') {
      Router.push(`/collections/${nft_collection.col_url}/${nft.token_id}`)
    }
  }

  const isListed = useMemo(() => {
    return nft && nft.price > 0
  }, [nft])

  const nftChainId = useMemo(() => {
    return getChainIdFromName(nft?.chain)
  }, [nft])

  const chainIcon = useMemo(() => {
    if (nftChainId) {
      return getChainIconById(nftChainId.toString())
    }
    return getChainIconById('1')
  }, [nftChainId])

  const lastSale = useMemo(() => {
    return nft.last_sale
  }, [nft])

  const lastSaleCoinIcon = useMemo(() => {
    if (nft && nft.last_sale_currency) {
      return getCurrencyIconByAddress(nft.last_sale_currency)
    }
  }, [nft])

  const currencyIcon = getCurrencyIconByAddress(nft?.currency)
  const formattedPrice = nft?.price || 0
  const isWhitelisted = !!nft_collection
  const isOwner = useMemo(() => {
    if (nft && nft.owner && address) {
      return nft.owner.toLowerCase() == address.toLowerCase()
    }
    return false
  }, [nft, address])

  const onListingAndRefresh = async (listingData: IListingData) => {
    await onListing(listingData)
    onRefresh()
  }

  return (
    <div
      className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'
      onMouseEnter={() => SetIsShowBtn(true)}
      onMouseLeave={() => SetIsShowBtn(false)}
    >
      <div
        className="nft-image-container group relative flex justify-center text-center overflow-hidden rounded-md"
        ref={isUserPage ? setNodeRef : null}
        style={style}
        {...(isUserPage ? listeners : {})}
        {...(isUserPage ? attributes : {})}
      >
        <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
          <img
            className='nft-image rounded-md object-cover ease-in-out duration-500 group-hover:scale-110'
            src={imageError ? '/images/omnix_logo_black_1.png' : image}
            alt="nft-image"
            onError={() => { setImageError(true) }}
            data-src={image}
            onDoubleClick={() => doubleClickToSetDetailLink()}
          />
        </LazyLoad>
        {/* <div className="absolute top-[8px] right-[9px] p-[12px]" style={{background: 'radial-gradient(50% 50% at 50% 50%, rgba(254, 254, 255, 0.2) 0%, rgba(254, 254, 255, 0) 100%)'}}>
          <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
        </div> */}
      </div>
      <div className="flex flex-row mt-2.5 justify-between align-middle font-['RetniSans']">
        <div className="ml-3 text-[#000000] text-[14px] font-bold">
          {JSON.parse(nft.metadata || '{}')?.name}
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
            <img src={currencyIcon || '/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon' />
            <span className="text-[#000000] text-[18px] font-extrabold ml-2">{numberShortify(formattedPrice)}</span>
          </>}
        </div>
      </div>
      {/* <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
        <div className="flex items-center ml-3">
          {islisted && price>0&&<img src={img_url} className="w-[18px] h-[18px]" alt="icon" />}
          {islisted && price>0&&<span className="text-[#000000] text-[18px] font-extrabold ml-2">{price}</span>}
        </div>
      </div> */}
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
        <div className="flex items-center ml-3">
          {lastSale > 0 && <>
            <span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span>
            <img src={lastSaleCoinIcon} className="w-[18px] h-[18px]" alt="" />&nbsp;
            <span className="text-[#6C757D] text-[14px]font-bold">{numberShortify(lastSale)}</span>
          </>}
          {!lastSale && highestBid != 0 && <>
            <span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span>
            <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo" />&nbsp;
            <span className="text-[#6C757D] text-[14px] font-bold">{numberShortify(highestBid)}</span>
          </>}
        </div>
        <div className="flex items-center ml-3">
          <div>&nbsp;</div>
          {isShowBtn && isWhitelisted && isOwner &&
            <div
              className="ml-2 mr-3 py-[1px] px-4 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-bold cursor-pointer hover:bg-[#B00000]"
              onClick={() => setOpenSellDlg(true)}
            >
              {'Sell'}
            </div>}
        </div>
      </div>
      <ConfirmSell handleSellDlgClose={() => { setOpenSellDlg(false) }} openSellDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onListingAndRefresh} />
    </div>
  )
}

export default NFTBox
