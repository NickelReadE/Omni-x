import React, { useMemo } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import {useDraggable} from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'

import useWallet from '../hooks/useWallet'
import { selectCollections } from '../redux/reducers/collectionsReducer'
import { useSelector } from 'react-redux'
import { getChainIconById, getChainNameFromId } from '../utils/constants'

import Router from 'next/router'
import useOrderStatics from '../hooks/useOrderStatics'
import useTrading from '../hooks/useTrading'

const NFTBox = ({nft, index}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [isShowBtn, SetIsShowBtn] = useState(false)
  const collections = useSelector(selectCollections)

  const {
    provider,
    address,
    signer
  } = useWallet()

  const chain = provider?.network.chainId
  const chainIcon = getChainIconById(chain?.toString())

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
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
        return image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      } catch (err) {
        console.log('NFTBox err? ', err)
      }
    }
    return '/images/omnix_logo_black_1.png'
  }, [nft])

  const collection_address_map = useMemo(() => {
    if (chain && nft?.token_address) {
      return {
        [chain]: nft.token_address
      }
    }
    return []
  }, [chain, nft])

  const {
    order,
    orderChainId,
    isListed,
    isAuction,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  } = useOrderStatics({ nft, collection_address_map })

  const order_collection_address = order?.collectionAddress
  const order_collection_chain = orderChainId && getChainNameFromId(orderChainId)

  console.log('-nft-', nft)
  const {
    openSellDlg,
    setOpenSellDlg,
    onListing
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: nft.name,
    collection_address: nft.token_address,
    collection_chain: getChainNameFromId(chain ? Number(chain) : 4),
    order_collection_address,
    order_collection_chain,
    owner: address,
    owner_collection_address: nft.token_address,
    owner_collection_chain: nft.chain,
    token_id: nft?.token_id
  })

  const doubleClickToSetDetailLink = () => {
    const collection_address = nft.token_address
    if (collection_address == '0xb7b0d9849579d14845013ef9d8421ae58e9b9369' || collection_address == '0x7470ea065e50e3862cd9b8fb7c77712165da80e5' || collection_address == '0xb74bf94049d2c01f8805b8b15db0909168cabf46' || collection_address == '0x7f04504ae8db0689a0526d99074149fe6ddf838c' || collection_address == '0xa783cc101a0e38765540ea66aeebe38beebf7756'|| collection_address == '0x316dc98ed120130daf1771ca577fad2156c275e5') {
      for(let i = 0;i<collections.length;i++){
        if(collection_address == collections[i].address){
          const {pathname} = Router
          if(pathname == '/' ){
            Router.push(`/collections/${collections[i].col_url}/${nft.token_id}`)
          }
        }
      }
    }
  }
  
  return (
    <div className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'onMouseEnter={() => SetIsShowBtn(true)} onMouseLeave={() => SetIsShowBtn(false)}>
      <div className="nft-image-container group relative flex justify-center text-center overflow-hidden rounded-md" ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {isListed ?
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img className='nft-image rounded-md object-cover ease-in-out duration-500 group-hover:scale-110' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} onDoubleClick={() => doubleClickToSetDetailLink()}/>
          </LazyLoad>
          :
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img className='nft-image rounded-md object-cover ease-in-out duration-500 group-hover:scale-110' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image}/>
          </LazyLoad>
        }
        {/* <div className="absolute top-[8px] right-[9px] p-[12px]" style={{background: 'radial-gradient(50% 50% at 50% 50%, rgba(254, 254, 255, 0.2) 0%, rgba(254, 254, 255, 0) 100%)'}}>
          <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
        </div> */}
      </div>
      <div className="flex flex-row mt-2.5 justify-between align-middle font-['RetniSans']">
        <div className="ml-3 text-[#000000] text-[14px] font-bold">
          {JSON.parse(nft.metadata)?.name}
        </div>
        <div className="mr-3 flex items-center">
          <div className="flex items-center ml-1">
            <img src={chainIcon} className="w-[16px] h-[16px]" />
          </div>
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
          {lastSale && <>
            <span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span>
            <img src={lastSaleCoin} className="w-[18px] h-[18px]" alt="" />&nbsp;
            <span className="text-[#6C757D] text-[14px]font-bold">{lastSale}</span>
          </>}
          {!lastSale && highestBid && <>
            <span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span>
            <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
            <span className="text-[#6C757D] text-[14px] font-bold">{highestBid}</span>
          </>}  
        </div>
        <div className="flex items-center ml-3">
          <div>&nbsp;</div>
          {isShowBtn && !isListed &&
            <div className="ml-2 mr-3 py-[1px] px-5 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-bold cursor-pointer hover:bg-[#B00000]" onClick={() => setOpenSellDlg(true)}>
              {'Sell'}
            </div>}
        </div>
      </div>
      <ConfirmSell handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onListing} />
    </div>
  )
}

export default NFTBox
