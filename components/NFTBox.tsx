import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { chain_list } from '../utils/utils'
import { IListingData, IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import {useDraggable} from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'
import { prependOnceListener } from 'process'

import useWallet from '../hooks/useWallet'
import { postMakerOrder } from '../utils/makeOrder'
import { addDays } from 'date-fns'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import { ethers } from 'ethers'
import { getOrders, selectOrders,selectBidOrders, selectLastSaleOrders } from '../redux/reducers/ordersReducer'
import { selectCollections } from '../redux/reducers/collectionsReducer'
import { IGetOrderRequest } from '../interface/interface'
import { useDispatch, useSelector } from 'react-redux'
import { ContractName, CREATOR_FEE, currencies_list, getAddressByName, PROTOCAL_FEE, getChainIdFromName } from '../utils/constants'

import Router from 'next/router'

const NFTBox = ({nft, index}: IPropsNFTItem) => {

  const [chain, setChain] = useState('eth')
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [imageError, setImageError] = useState(false)
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  ///only in the beta version
  const [islisted,setList] = useState(false)
  const [price, setPrice] = useState(0)
  const [img_url, setImageURL] = useState('')
  const [highestBid, setHighestBid] = useState(0)
  const [highestBidCoin, setHighestBidCoin] = useState('')
  const [lastSale,setLastSale] = useState(0)
  const [lastSaleCoin, setLastSaleCoin] = useState('')
  const [isShowBtn, SetIsShowBtn] = useState(false)

  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)
  const lastSaleOrders = useSelector(selectLastSaleOrders)
  const collections = useSelector(selectCollections)

  const {
    provider,
    address
  } = useWallet()

  const dispatch = useDispatch()

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

  useEffect(() => {
    const updateImage = async() => {
      const metadata = nft.metadata
      setChain(chain_list[nft.chain])
      if (metadata) {
        try {
          // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
          const image_uri = JSON.parse(metadata).image
          setImage(image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
        } catch (err) {
          console.log('NFTBox err? ', err)
        }
      }

      
    }
    updateImage()
  }, [])

  useEffect(()=>{
    const collection_address = nft.token_address
    if (collection_address == '0xb7b0d9849579d14845013ef9d8421ae58e9b9369' || collection_address == '0x7470ea065e50e3862cd9b8fb7c77712165da80e5' || collection_address == '0xb74bf94049d2c01f8805b8b15db0909168cabf46' || collection_address == '0x7f04504ae8db0689a0526d99074149fe6ddf838c' || collection_address == '0xa783cc101a0e38765540ea66aeebe38beebf7756'|| collection_address == '0x316dc98ed120130daf1771ca577fad2156c275e5') {
      setList(true)
    }
    
    if(lastSaleOrders.length>0){
      setLastSale(0)
      setLastSaleCoin('')
      for(let i=0;i<lastSaleOrders.length;i++){
        if(lastSaleOrders[i].collectionAddress==collection_address&&lastSaleOrders[i].tokenId==nft.token_id){
          setLastSale(Number(ethers.utils.formatEther(lastSaleOrders[i].price)))
          const chainIdForList = getChainIdFromName(lastSaleOrders[i].chain)
          currencies_list[chainIdForList as number].map((item,index) => {
            if(item.address==lastSaleOrders[i].currencyAddress){
              setLastSaleCoin(`/images/${item.icon}`)
            }
          })
        }
      }
    }
    if(orders.length>0){
      ///only in the beta version
      for(let i=0;i<orders.length;i++){
        if(orders[i].tokenId==nft.token_id && orders[i].collectionAddress==nft.token_address) {
          setPrice(Number(ethers.utils.formatEther(orders[i].price)))
          const chainIdForList = getChainIdFromName(orders[i].chain)
          currencies_list[chainIdForList as number].map((item,index) => {
            if(item.address==orders[i].currencyAddress){
              setImageURL(`/images/${item.icon}`)
            }
          })
        }
      }
    }
    if(bidOrders.length>0) {
      if ( bidOrders.length > 0 ) {
        let bid_balance = 0
        for(let i=0; i<bidOrders.length;i++){
          if(bidOrders[i].tokenId==nft.token_id && bidOrders[i].collectionAddress==nft.token_address){
            if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
              bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
              const chainIdForList = getChainIdFromName(bidOrders[i].chain as string)
              for(let j=0;j<currencies_list[chainIdForList as number].length;j++){
                if(currencies_list[chainIdForList as number][j].address==bidOrders[i].currencyAddress){
                  setHighestBidCoin(`/images/${currencies_list[chainIdForList as number][j].icon}`)
                }
              }
            }
          }
        }
        setHighestBid(bid_balance)
      }
    }
  },[orders,bidOrders,lastSaleOrders])

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


  const onListing = async (listingData: IListingData) => {
    const chainId = provider?.network.chainId as number
    const amount = ethers.utils.parseUnits('1', 0)
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)

    const startTime = Date.now()
    try {
      await postMakerOrder(
        provider as any,
        true,
        nft.token_address,
        getAddressByName('Strategy', chainId),
        amount,
        ethers.utils.parseEther(listingData.price.toString()),
        protocalFees,
        creatorFees,
        getAddressByName(listingData.currencyName as ContractName, chainId),
        {
          tokenId: String(nft.token_id),
          startTime,
          endTime: addDays(startTime, listingData.period).getTime(),
          params: {
            values: [10001],
            types: ['uint256'],
          },
        },
        nft.chain,
        true
      )
      setOpenSellDlg(false)
      dispatch(openSnackBar({ message: 'Listing Success', status: 'success' }))

      const request: IGetOrderRequest = {
        isOrderAsk: true,
        chain: provider?.network.name,
        signer: address,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'OLDEST'
      }
      dispatch(getOrders(request) as any)

    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }
  
  return (
    <div className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'onMouseEnter={() => SetIsShowBtn(true)} onMouseLeave={() => SetIsShowBtn(false)}>
      <div className="nft-image-container group relative flex justify-center text-center overflow-hidden rounded-md" ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {islisted?
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
            {chain === 'eth' &&
              <img src="/svgs/ethereum.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'bsc' &&
              <img src="/svgs/binance.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'matic' &&
              <img src="/svgs/polygon.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'avalanche' &&
              <img src="/svgs/avax.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'fantom' &&
              <img src="/svgs/fantom.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'optimism' &&
              <img src="/svgs/optimism.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'arbitrum' &&
              <img src="/svgs/arbitrum.svg" className="w-[16px] h-[16px]" />
            }
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
        <div className="flex items-center ml-3">
          {islisted && price>0&&<img src={img_url} className="w-[18px] h-[18px]" alt="icon" />}
          {islisted && price>0&&<span className="text-[#000000] text-[18px] font-extrabold ml-2">{price}</span>}
        </div>
      </div>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
        <div className="flex items-center ml-3">
          {lastSale!=0&&<><span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span><img src={lastSaleCoin} className="w-[18px] h-[18px]" />&nbsp;<span className="text-[#6C757D] text-[14px]font-bold">{lastSale}</span></>}
          {lastSale==0&&highestBid!=0&&<><span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span><img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;<span className="text-[#6C757D] text-[14px] font-bold">{highestBid}</span></>}  
        </div>
        <div className="flex items-center ml-3">
          <div>&nbsp;</div>
          {isShowBtn&&islisted&&<div className="ml-2 mr-3 py-[1px] px-5 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-bold cursor-pointer hover:bg-[#B00000]" onClick={() => setOpenSellDlg(true)}>
            {'Sell'}
          </div>}
        </div>
      </div>
      <ConfirmSell handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onListing} />
    </div>
  )
}

export default NFTBox
