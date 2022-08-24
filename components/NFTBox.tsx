import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { chain_list } from '../utils/utils'
import { IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import {useDraggable} from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'
import { cpuUsage, prependOnceListener } from 'process'

import useWallet from '../hooks/useWallet'
import { addressesByNetwork } from '../constants'
import { SupportedChainId } from '../types'
import { postMakerOrder } from '../utils/makeOrder'
import { addDays } from 'date-fns'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import { ethers } from 'ethers'
import { getOrders, selectOrders,selectBidOrders, selectLastSaleOrders } from '../redux/reducers/ordersReducer'
import { selectCollections } from '../redux/reducers/collectionsReducer'
import { IGetOrderRequest } from '../interface/interface'
import { useDispatch, useSelector } from 'react-redux'

import Router from 'next/router'

const NFTBox = ({nft, index}: IPropsNFTItem) => {

  const [chain, setChain] = useState('eth')
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [imageError, setImageError] = useState(false)
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  ///only in the beta version
  const [islisted,setList] = useState(false)
  const [price, setPrice] = useState('')
  const [img_url, setImageURL] = useState('')
  const [highestBid, setHighestBid] = useState(0)
  const [highestBidCoin, setHighestBidCoin] = useState('')
  const [lastSale,setLastSale] = useState(0)
  const [lastSaleCoin, setLastSaleCoin] = useState('')
  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)
  const lastSaleOrders = useSelector(selectLastSaleOrders)
  const collections = useSelector(selectCollections)

  const currencies_list = [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x49fB1b5550AFFdFF32CffF03c1A8168f992296eF' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ]

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
    let flag = false
    const collection_address = nft.token_address
    if (collection_address == '0xb7b0d9849579d14845013ef9d8421ae58e9b9369' || collection_address == '0x7470ea065e50e3862cd9b8fb7c77712165da80e5' || collection_address == '0xb74bf94049d2c01f8805b8b15db0909168cabf46' || collection_address == '0x7f04504ae8db0689a0526d99074149fe6ddf838c' || collection_address == '0xa783cc101a0e38765540ea66aeebe38beebf7756'|| collection_address == '0x316dc98ed120130daf1771ca577fad2156c275e5') {
      setList(true)
    }
    if(lastSaleOrders.length>0){
      setLastSale(0)
      setLastSaleCoin('')
      for(let i=lastSaleOrders.length-1;i>=0;i--){
        if(lastSaleOrders[i].collectionAddress==collection_address&&lastSaleOrders[i].tokenId==nft.token_id){
          setLastSale(Number(ethers.utils.formatEther(lastSaleOrders[i].price)))
          currencies_list.map((item,index) => {
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
        if(orders[i].tokenId==nft.token_id && orders[i].collectionAddress==nft.token_address && orders[i].chain==nft.chain) {
          setPrice(ethers.utils.formatEther(orders[i].price))
          currencies_list.map((item,index) => {
            if(item.address==orders[i].currencyAddress){
              setImageURL(`/images/${item.icon}`)
            }
          })
          flag=true
        }
      }
    }
    if(!flag){
      if(bidOrders.length>0) {
        if ( bidOrders.length > 0 ) {
          let bid_balance = 0
          for(let i=0; i<bidOrders.length;i++){
            if(bidOrders[i].tokenId==nft.token_id && bidOrders[i].collectionAddress==nft.token_address){
              if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
                bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
                for(let j=0;j<currencies_list.length;j++){
                  if(currencies_list[j].address==bidOrders[i].currencyAddress){
                    setHighestBidCoin(`/images/${currencies_list[j].icon}`)
                  }
                }
              }
            }
          }
          setHighestBid(bid_balance)
        }
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


  const onListing = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()
    try {
      await postMakerOrder(
        provider as any,
        chainId,
        true,
        nft.token_address,
        addresses.STRATEGY_STANDARD_SALE,
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: String(nft.token_id),
          startTime: startTime,
          endTime: addDays(startTime, period).getTime(),
          params: {
            values: [10001,1],
            types: ['uint256'],
          },
        },
        nft.chain
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
    <div className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'>
      <div className="nft-image-container" ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {islisted?
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img className='nft-image' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} onDoubleClick={() => doubleClickToSetDetailLink()}/>
          </LazyLoad>
          :
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
            <img className='nft-image' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image}/>
          </LazyLoad>
        }
        {/* <div className="absolute top-[8px] right-[9px] p-[12px]" style={{background: 'radial-gradient(50% 50% at 50% 50%, rgba(254, 254, 255, 0.2) 0%, rgba(254, 254, 255, 0) 100%)'}}>
          <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
        </div> */}
      </div>
      <div className="flex flex-row mt-2.5 justify-between align-middle">
        <div className="ml-3 text-[#6C757D] text-[14px] font-medium font-['Roboto_Mono']">
          {nft.name}
        </div>
        <div className="ml-1 text-[#6C757D] text-[14px] font-medium font-['Roboto_Mono']">
          {`#${nft.token_id}`}
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
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
        <div className="flex items-center ml-3">
          {islisted && price>='' ?  
            <div className='flex'>
              <img src={img_url} className="w-[16px] h-[16px]" alt="icon" />
              <span className="text-[#1E1C21] text-sm ml-2"> {price}</span>
              <div className="ml-3 py-[1px] px-5 bg-[#ADB5BD] rounded-lg text-[14px] text-[#F8F9FA] font-medium cursor-pointer hover:bg-[#B00000]" onClick={() => setOpenSellDlg(true)}>
                {'Sell'}
              </div>
            </div>
            :
            <div className='flex'>
              <div className="ml-3 py-[1px] px-5 bg-[#ADB5BD] rounded-lg text-[14px] text-[#F8F9FA] font-medium cursor-pointer hover:bg-[#B00000]" onClick={() => setOpenSellDlg(true)}>
                {'Sell'}
              </div>
            </div>
          }
        </div>
      </div>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
        <div className="flex items-center ml-3">
          {lastSale!=0&&<><img src={lastSaleCoin} className="w-[18px] h-[18px]" />
            <span className="text-[#1E1C21] text-sm ml-2"><span className="text-[#1E1C21] text-sm ml-2">last sale: &nbsp;</span>{lastSale}</span></>}
          {lastSale==0&&highestBid!=0&&<><span className="text-[#1E1C21] text-sm ml-2">highest offer: &nbsp;</span><img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>
            <span className="text-[#1E1C21] text-sm ml-2">{highestBid}</span></>}
        </div>
      </div>
      <ConfirmSell handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onListing} />
    </div>
  )
}

export default NFTBox
