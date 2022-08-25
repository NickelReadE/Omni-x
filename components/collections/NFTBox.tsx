import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IPropsNFTItem } from '../../interface/interface'
import LazyLoad from 'react-lazyload'
import { ethers } from 'ethers'
import { selectOrders, selectBidOrders, selectLastSaleOrders } from '../../redux/reducers/ordersReducer'
import { useSelector } from 'react-redux'
import { getCurrencyIconByAddress } from '../../utils/constants'
import editStyle from '../../styles/nftbox.module.scss'
import classNames from '../../helpers/classNames'

const NFTBox = ({nft, col_url,col_address, chain}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [islisted,setList] = useState(false)
  const [price, setPrice] = useState('')
  const [img_url, setImageURL] = useState('')
  const [lastSale, setLastSale] = useState(0)
  const [lastSaleCoin, setLastSaleCoin] = useState('')
  const [highestBid, setHighestBid] = useState(0)
  const [highestBidCoin, setHighestBidCoin] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)
  const executedOrders = useSelector(selectLastSaleOrders)

  useEffect(() => {
    if(nft){
      if (col_address == '0xb7b0d9849579d14845013ef9d8421ae58e9b9369' || col_address == '0x7470ea065e50e3862cd9b8fb7c77712165da80e5' || col_address == '0xb74bf94049d2c01f8805b8b15db0909168cabf46' || col_address == '0x7f04504ae8db0689a0526d99074149fe6ddf838c' || col_address == '0xa783cc101a0e38765540ea66aeebe38beebf7756'|| col_address == '0x316dc98ed120130daf1771ca577fad2156c275e5') {
        for(let i=0;i<orders.length;i++){
          if(orders[i].tokenId==nft.token_id && orders[i].collectionAddress==col_address && orders[i].chain==chain) {
            setPrice(ethers.utils.formatEther(orders[i].price))
            setList(true)
            setImageURL(`/images/${getCurrencyIconByAddress(orders[i].currencyAddress)}`)
            setIsOwner(true)
          }
        }
        if(executedOrders.length > 0) {
          let lastprice = 0
          for(let i=0;i<executedOrders.length;i++){
            if(executedOrders[i].tokenId==nft.token_id && executedOrders[i].collectionAddress==col_address){
              lastprice = Number(ethers.utils.formatEther(executedOrders[i].price))
              setLastSaleCoin(`/images/${getCurrencyIconByAddress(executedOrders[i].currencyAddress)}`)
            }
          }
          setLastSale(lastprice)
        }
        if ( bidOrders.length > 0 ) {
          let bid_balance = 0
          for(let i=0; i<bidOrders.length;i++){
            if(bidOrders[i].tokenId==nft.token_id && bidOrders[i].collectionAddress==col_address){
              if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
                bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
                setHighestBidCoin(`/images/${getCurrencyIconByAddress(bidOrders[i].currencyAddress)}`)
              }
            }
          }
          setHighestBid(bid_balance)
        }
      }
    }
  },[nft])

  return (
    <div className={classNames('w-full border-[2px] border-[#F6F8FC] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <Link href={`/collections/${col_url}/${nft.token_id}`}>
        <a>
          <div className="relative w-full">
            <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
              <img className='collection-nft-image-item' src={imageError||nft.image==null?'/images/omnix_logo_black_1.png':nft.image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nft.image} />
            </LazyLoad>
            <div className={classNames('absolute top-[8px] right-[9px] p-[12px]', editStyle.ellipseBtn)}>
              <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
            </div>
          </div>
          <div className="text-[#6C757D] text-[14px] font-medium  mt-3 ml-3">
            {nft.name}
          </div>
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
            <div className="flex items-center ml-3">
              <img src="/svgs/ethereum.svg" className="w-[18px] h-[18px]" />
              <span className="text-[#1E1C21] text-sm ml-2"> {nft.price && ethers.utils.formatEther(nft.price)}</span>
            </div>
            <div className="mr-3 flex items-center">
              <div className={classNames("mr-3 flex items-center cursor-pointer bg-[url('/images/round-refresh.png')] hover:bg-[url('/images/round-refresh_hover.png')] bg-cover w-[20px] h-[20px]", editStyle.refreshBtn)}></div>
              <div className="flex items-center ml-1">
                {(chain === 'eth' || chain === 'rinkeby') &&
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
              {/* {!islisted &&highestBid==0&&<><img src="/svgs/ethereum.svg" className="w-[18px] h-[18px]" />
                <span className="text-[#1E1C21] text-sm ml-2"> {nft.price && ethers.utils.formatEther(nft.price)}</span></>}
              {!islisted &&highestBid!=0&&<><img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>
                <span className="text-[#1E1C21] text-sm ml-2"> {highestBid}</span></>} */}
              {islisted &&<><img src={img_url} className="w-[18px] h-[18px]" />
                <span className="text-[#1E1C21] text-sm ml-2"> {price}</span></>}
              
            </div>
            {
              isOwner&&<div className="ml-2 mr-2 py-[1px] px-5 bg-[#ADB5BD] rounded-lg text-[14px] text-[#F8F9FA] font-medium cursor-pointer hover:bg-[#B00000]">
                {'Sell'}
              </div>
            }
            {
              !isOwner&&<div className="ml-2 mr-2 py-[1px] px-5 bg-[#ADB5BD] rounded-lg text-[14px] text-[#F8F9FA] font-medium cursor-pointer hover:bg-[#38B000]">
                {'Buy now'}
              </div>
            }
          </div>
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
            <div className="flex items-center ml-3">
              {lastSale!=0&&<><img src={lastSaleCoin} className="w-[18px] h-[18px]" />
                <span className="text-[#1E1C21] text-sm ml-2"><span className="text-[#1E1C21] text-sm ml-2">last sale: &nbsp;</span>{lastSale}</span></>}
              {lastSale==0&&highestBid!=0&&<><span className="text-[#1E1C21] text-sm ml-2">highest offer: &nbsp;</span><img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>
                <span className="text-[#1E1C21] text-sm ml-2">{highestBid}</span></>}
              {lastSale==0&&highestBid==0&&<><span className="text-[#1E1C21] text-sm ml-2">last sale: &nbsp;</span>
                <span className="text-[#1E1C21] text-sm ml-2">${lastSale}</span></>}
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default NFTBox
