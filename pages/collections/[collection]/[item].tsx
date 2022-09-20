import React, { useState, useEffect, Fragment, useMemo } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { BigNumber, ethers } from 'ethers'
import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'

import { getNFTInfo, selectNFTInfo } from '../../../redux/reducers/collectionsReducer'
import { selectOrders, selectBidOrders, selectLastSaleOrders } from '../../../redux/reducers/ordersReducer'

import useWallet from '../../../hooks/useWallet'
import useTrading from '../../../hooks/useTrading'
import { IOrder } from '../../../interface/interface'
import { SaleType } from '../../../types/enum'
import { getChainIconByCurrencyAddress, getCurrencyIconByAddress, getProfileLink } from '../../../utils/constants'

import PngCheck from '../../../public/images/check.png' 
import PngSub from '../../../public/images/subButton.png'
import PngEther from '../../../public/images/collections/ethereum.png'
import useOrderStatics from '../../../hooks/useOrderStatics'

const truncate = (str: string) => {
  return str.length > 12 ? str.substring(0, 9) + '...' : str
}

const chainList = [
  { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs', disabled: false},
  { chain: 'rinkeby', img_url: '/svgs/ethereum.svg', title: 'Ethereum', disabled: false},
  { chain: 'arbitrum-rinkeby', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum', disabled: true},
  { chain: 'avalanche testnet', img_url: '/svgs/avax.svg', title: 'Avalanche', disabled: false},
  { chain: 'bsc testnet', img_url: '/svgs/binance.svg', title: 'BNB Chain', disabled: false},
  { chain: 'fantom-testnet', img_url: '/svgs/fantom.svg', title: 'Fantom', disabled: true},
  { chain: 'optimism-kovan', img_url: '/svgs/optimism.svg', title: 'Optimism', disabled: true},
  { chain: 'mumbai', img_url: '/svgs/polygon.svg', title: 'Polygon', disabled: false},
]

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')

  const bidOrders = useSelector(selectBidOrders) as IOrder[]
  const nftInfo = useSelector(selectNFTInfo)

  const dispatch = useDispatch()
  
  const {
    provider,
    signer,
    address
  } = useWallet()

  const router = useRouter()
  const col_url = router.query.collection as string
  const token_id = router.query.item as string

  // trading hook
  const {
    owner,
    ownerType,
    openBidDlg,
    openSellDlg,
    setOpenBidDlg,
    setOpenSellDlg,
    getNFTOwnership,
    getListOrders,
    getBidOrders,
    getLastSaleOrder,
    onListing,
    onBuy,
    onBid,
    onAccept
  } = useTrading({
    provider,
    signer,
    address,
    col_url,
    token_id
  })

  // statistics hook
  const {
    order,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  } = useOrderStatics({ nftInfo })

  // nft info api call
  useEffect(() => {
    if (col_url && token_id) {
      console.log('-getting nft info-')
      dispatch(getNFTInfo(col_url, token_id) as any)
      getNFTOwnership(col_url, token_id)
    }
  }, [col_url, token_id])
  
  // order api call
  useEffect(() => {
    if (nftInfo && owner) {
      console.log('-getting orders-')
      getListOrders()
      getBidOrders()
      getLastSaleOrder()
    }
  }, [nftInfo, owner])

  // profile link
  const profileLink = getProfileLink(nftInfo?.collection?.chain, ownerType, owner)
  const currencyChainIcon = getChainIconByCurrencyAddress(order?.currencyAddress)
  const formattedPrice = order?.price && ethers.utils.formatEther(order.price)

  // listing or auction
  const isListed = !!order
  const isAuction = order?.params?.[1] == SaleType.AUCTION

  console.log('-isListed, isAuction, owner, address-', isListed, isAuction, owner, address, nftInfo)

  return (
    <>
      {nftInfo?.nft?.token_id === Number(token_id) && nftInfo?.collection?.col_url === col_url &&
        <div className="w-full mt-40 pr-[70px] pb-[120px] font-[Retni_Sans]">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-3 2xl:gap-12 lg:gap-1 xl:gap-4">
              <div className="col-span-1 h-full">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>}>
                  <img className='rounded-[8px]' src={imageError?'/images/omnix_logo_black_1.png':nftInfo.nft.image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nftInfo.nft.image} />
                </LazyLoad>
              </div>
              <div className="col-span-2">
                <div className="px-6 py-3 bg-[#F6F8FC]">
                  <div className='flex items-center'>
                    <h1 className="text-[#1E1C21] text-[32px] font-extrabold mr-8">{nftInfo.collection.name}</h1>
                    <div className='h-[22px]'><Image src={PngCheck} alt="checkpng"/></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <h1 className="text-[#1E1C21] text-[24px] font-medium">{nftInfo.nft.token_id}</h1>
                    <Image src={PngSub} alt=""/>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pt-3 mt-6 bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="flex justify-start items-center">
                      <h1 className="text-[#1E1C21] text-[18px] font-bold">owner:</h1>
                      {
                        owner && ownerType=='address' && <h1 className="text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={profileLink}><a target='_blank'>{truncate(owner)}</a></Link></h1>
                      }
                      
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      {order && (
                        <>
                          <h1 className="text-[#1E1C21] text-[60px] font-normal">{formattedPrice}</h1>
                          <div className="mr-5">
                            {currencyChainIcon && 
                              <img
                                src={`${currencyChainIcon}`}
                                className='mr-[8px] w-[21px]'
                                alt="icon"
                              />
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className='font-normal font-[16px]'>{formattedPrice && '$'}{formattedPrice}</span>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-bold">Highest Bid: <span className="font-bold">{highestBid}</span></h1>{highestBidCoin&&<Image src={highestBidCoin} width={15} height={16} alt="chain  logo" />}</div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-bold">Last Sale: <span className="font-bold">{lastSale != 0 && lastSale}</span></h1>{lastSaleCoin&&<Image src={lastSaleCoin} width={15} height={16} alt="chain logo" />}</div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] min-h-[210px] max-h-[210px]">
                      <div className="font-bold text-[18px] text-[#000000]">account</div>
                      <div className="font-bold text-[18px] text-[#000000]">chain</div>
                      <div className="font-bold text-[18px] text-[#000000]">bid</div>
                      <div></div>
                      {
                        bidOrders?.map((item, index) => {
                          if(Number(item.tokenId)===nftInfo.nft.token_id && item.collectionAddress===nftInfo.collection.address){
                            return <Fragment key={index}>
                              <div className='break-all mt-3 text-[16px] font-bold'>{truncate(item.signer)}</div>
                              <div className="text-center mt-3">
                                {
                                  chainList.map((chain, chainIdx) => {
                                    if (chain.chain == item?.chain){
                                      return(
                                        <img
                                          src={chain.img_url}
                                          className='mr-[8px] w-[21px]'
                                          alt="icon"
                                          key={chainIdx}
                                        />
                                      )
                                    }
                                  })
                                }
                              </div>
                              <div className='flex justify-start mt-3'>
                                <div className="mr-5">
                                  <img
                                    src={`/images/${getCurrencyIconByAddress(item.currencyAddress)}`}
                                    className='mr-[8px] w-[21px]'
                                    alt="icon"
                                  />
                                </div>
                                <p className='ml-3'>${item && item.price && ethers.utils.formatEther(item.price)}</p>
                              </div>
                              <div className='text-right mt-3'>{owner.toLowerCase()==address?.toLowerCase()&&<button className='bg-[#ADB5BD] hover:bg-[#38B000] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5' onClick={() => onAccept(item)}>accept</button>}</div>
                            </Fragment>
                          }
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pb-3  bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="mb-3">
                      <div className="">
                        { isListed && !isAuction && owner?.toLowerCase() != address?.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]" onClick={()=>onBuy(order)}>buy</button>
                        }
                        { owner?.toLowerCase() == address?.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]" onClick={() => {setOpenSellDlg(true)}}>sell</button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    { isListed && isAuction && owner?.toLowerCase() != address?.toLowerCase() && 
                      <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]" onClick={() => {setOpenBidDlg(true)}}>bid</button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div>
                <ul className="flex flex-wrap relative justify-item-stretch text-sm font-medium text-center text-gray-500">
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='items'?' text-[#1E1C21] border-b-2 border-black':' text-[#A0B3CC]'}`} onClick={()=>setCurrentTab('items')}>properties</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='activity'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >activity</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='info'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >info</li>
                  <li className={`select-none inline-block  text-xl px-10 py-2  ${currentTab==='stats'?' text-[#1E1C21]':' text-[#A0B3CC]'}`} >stats</li>
                </ul>
              </div>
              <div className="border-2 border-[#E9ECEF] bg-[#F6F8FC] px-10 py-8">
                {
                  currentTab == 'items' &&
                  <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                    {
                      Object.entries(nftInfo.nft.attributes).map((item, idx) => {
                        const attrs = nftInfo.collection.attrs
                        const attr = attrs[item[0]].values
                        const trait = attr[(item[1] as string).toLowerCase()]
                        return <div className="px-5 py-2 bg-[#b444f926] border-2 border-[#B444F9] rounded-[8px]" key={idx}>
                          <p className="text-[#B444F9] text-[12px] font-bold">{item[0]}</p>
                          <div className="flex justify-start items-center mt-2">
                            <p className="text-[#1E1C21] text-[18px] font-bold">{item[1]}<span className="ml-3 font-normal">[{trait[1]}%]</span></p>
                            <p className="ml-5 mr-3 text-[#1E1C21] text-[18px] ml-auto">{order && order.price && ethers.utils.formatEther(order.price)}</p>
                            <Image src={PngEther} alt="" />
                          </div>
                        </div>
                      })
                    }
                  </div>
                }
              </div>
            </div>
          </div>
          <ConfirmSell onSubmit={onListing} handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
          <ConfirmBid onSubmit={(bidData) => onBid(bidData, order)} handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
        </div>
      }
    </>
  )
}

export default Item