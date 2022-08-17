import React, { useState, useEffect } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { addDays } from 'date-fns'

import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'

import { openSnackBar } from '../../../redux/reducers/snackBarReducer'
import { getNFTInfo, selectNFTInfo } from '../../../redux/reducers/collectionsReducer'
import { getOrders, selectOrders, selectBidOrders } from '../../../redux/reducers/ordersReducer'
import { userService } from '../../../services/users'
import { collectionsService } from '../../../services/collections'

import useWallet from '../../../hooks/useWallet'
import { postMakerOrder } from '../../../utils/makeOrder'
import { MakerOrderWithSignature, TakerOrderWithEncodedParams } from '../../../types'
import { IGetOrderRequest, IListingData, IOrder } from '../../../interface/interface'
import { getAddressByName, getLayerzeroChainId } from '../../../utils/constants'
import { getERC721Instance, getOmniInstance, getOmnixExchangeInstance } from '../../../utils/contracts'

import PngCheck from '../../../public/images/check.png' 
import PngSub from '../../../public/images/subButton.png'
import PngEther from '../../../public/images/collections/ethereum.png'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')
  const [owner, setOwner] = useState('')
  const [ownerType, setOwnerType] = useState('')

  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)

  const [order, setOrder] = useState<IOrder>()
  const [bidOrder, setBidOrder] = useState<IOrder[]>()
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  const [openBidDlg, setOpenBidDlg] = React.useState(false)
  const [profileLink, setProfileLink] = React.useState('')

  const [highestBid, setHighestBid] = React.useState(0)
  const [lastSale, setLastSale] = React.useState(0)
  const [highestBidCoin, setHighestBidCoin] = React.useState('')
  const [lastSaleCoin, setLastSaleCoin] = React.useState('')

  const [order_flag, setOrderFlag] = React.useState(false)
  const [bid_flag, setBidFlag] = React.useState(false)

  const {
    provider,
    signer,
    address
  } = useWallet()

  const currencies_list = [
    { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x49fB1b5550AFFdFF32CffF03c1A8168f992296eF' },
    { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
    { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
  ]

  const chainList = [
    { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs', disabled: false},
    { chain: 'rinkeby', img_url: '/svgs/ethereum.svg', title: 'Ethereum', disabled: false},
    { chain: 'arbitrum-rinkeby', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum', disabled: true},
    { chain: 'avalanche testnet', img_url: '/svgs/avax.svg', title: 'Avalanche', disabled: false},
    { chain: 'bnbt', img_url: '/svgs/binance.svg', title: 'BNB Chain', disabled: false},
    { chain: 'fantom', img_url: '/svgs/fantom.svg', title: 'Fantom', disabled: true},
    { chain: 'optimism-kovan', img_url: '/svgs/optimism.svg', title: 'Optimism', disabled: true},
    { chain: 'maticmum', img_url: '/svgs/polygon.svg', title: 'Polygon', disabled: false},
  ]

  const router = useRouter()
  const dispatch = useDispatch()

  const col_url = router.query.collection as string
  const token_id = router.query.item as string

  // console.log(col_url)
  // console.log(token_id)

  const nftInfo = useSelector(selectNFTInfo)
  const isAuction = false

  useEffect(() => {
    const getNFTOwnership = async(col_url: string, token_id: string) => {
      const tokenIdOwner = await collectionsService.getNFTOwner(col_url, token_id)

      if ( tokenIdOwner.length > 0 ) {
        const user_info = await userService.getUserByAddress(tokenIdOwner)
        if(user_info.username == ''){
          setOwner(tokenIdOwner)
          setOwnerType('address')
        } else {
          setOwner(user_info.username)
          setOwnerType('username')
        }
      }
    }
    if ( col_url && token_id ) {
      dispatch(getNFTInfo(col_url, token_id) as any)
      getNFTOwnership(col_url, token_id)
    }
  }, [col_url, token_id])

  useEffect(() => {
    if ( nftInfo && nftInfo.collection && owner && ownerType ) {
      if(nftInfo.collection.chain=='rinkeby' ) {
        if(ownerType=='address') {
          const profile_link = 'https://rinkeby.etherscan.io/address/' + owner
          setProfileLink(profile_link)
        } else if (ownerType=='username') {
          setProfileLink('')
        }
      }

      const request: IGetOrderRequest = {
        isOrderAsk: true,
        chain: nftInfo.collection.chain,
        collection: nftInfo.collection.address,
        tokenId: nftInfo.nft.token_id,
        signer: owner,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'NEWEST'
      }
      dispatch(getOrders(request) as any)

      const bidRequest: IGetOrderRequest = {
        isOrderAsk: false,
        collection: nftInfo.collection.address,
        tokenId: nftInfo.nft.token_id,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'PRICE_ASC'
      }
      setOrderFlag(true)
      setBidFlag(true)

      dispatch(getOrders(bidRequest) as any)
    }
  }, [nftInfo, owner, ownerType])

  useEffect(() => {
    if (orders.length > 0 && order_flag ) {
      setOrderFlag(false)
      setOrder(orders[orders.length - 1])
    } else {
      setOrder(undefined)
    }
  }, [orders])

  useEffect(() => {
    if ( bidOrders.length > 0  && bid_flag) {
      const temp_bidOrders: any = []
      let bid_balance = 0
      for(let i=0; i<bidOrders.length;i++){
        temp_bidOrders.push(bidOrders[i])
        if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
          bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
          for(let j=0;j<currencies_list.length;j++){
            if(currencies_list[j].address==bidOrders[i].currencyAddress){
              setHighestBidCoin(`/images/${currencies_list[j].icon}`)
            }
          }
        }
      }
      setBidOrder(temp_bidOrders)
      setHighestBid(bid_balance)
      setBidFlag(false)
    } else {
      setBidOrder(undefined)
      setHighestBid(0)
      setHighestBidCoin('')
    }
  }, [bidOrders])

  const onListing = async (listingData: IListingData) => {
    const price = ethers.utils.parseEther(listingData.price.toString())
    const amount = ethers.utils.parseUnits('1', 0)
    const protocalFees = ethers.utils.parseUnits('2', 2)
    const creatorFees = ethers.utils.parseUnits('2', 2)
    const chainId = provider?.network.chainId || 4
    const lzChainId = getLayerzeroChainId(chainId)
    const startTime = Date.now()
    
    await postMakerOrder(
      provider as any,
      true,
      nftInfo.collection.address,
      getAddressByName('Strategy', chainId),
      amount,
      price,
      protocalFees,
      creatorFees,
      getAddressByName('OFT', chainId),
      {
        tokenId: token_id,
        startTime,
        endTime: addDays(startTime, listingData.period).getTime(),
        params: {
          values: [lzChainId],
          types: ['uint16'],
        },
      },
      nftInfo.collection.chain
    )

    const nftContract = getERC721Instance(nftInfo.collection.address, chainId, signer)
    await nftContract.approve(getAddressByName('TransferManagerERC721', chainId), token_id)

    dispatch(openSnackBar({ message: '  Success', status: 'success' }))
    setOpenSellDlg(false)
  }

  const onBuy = async () => {
    console.log('-buy--', order, provider)

    if (!order) {
      dispatch(openSnackBar({ message: 'Not listed', status: 'warning' }))
      return
    }

    const chainId = provider?.network.chainId || 4
    const lzChainId = getLayerzeroChainId(chainId)

    const omni = getOmniInstance(chainId, signer)
    const omnixExchange = getOmnixExchangeInstance(chainId, signer)
    const makerAsk : MakerOrderWithSignature = {
      isOrderAsk: order.isOrderAsk,
      signer: order?.signer,
      collection: order?.collectionAddress,
      price: order?.price,
      tokenId: order?.tokenId,
      amount: order?.amount,
      strategy: order?.strategy,
      currency: order?.currencyAddress,
      nonce: order?.nonce,
      startTime: order?.startTime,
      endTime: order?.endTime,
      minPercentageToAsk: order?.minPercentageToAsk,
      params: order?.params?.[0] as any,
      signature: order?.signature
    }
    const takerBid : TakerOrderWithEncodedParams = {
      isOrderAsk: false,
      taker: address || '0x',
      price: order?.price || '0',
      tokenId: order?.tokenId || '0',
      minPercentageToAsk: order?.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [lzChainId])
    }

    console.log('--buy----', makerAsk, takerBid)

    const lzFee = await omnixExchange.connect(signer as any).getLzFeesForAskWithTakerBid(takerBid, makerAsk)

    await omni.approve(omnixExchange.address, takerBid.price)
    await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })
  }

  const onBid = async (bidOrder: IOrder) => {
    const currency = bidOrder.currencyAddress
    const price = bidOrder.price
    const period = bidOrder.endTime - bidOrder.startTime
    const chainId = provider?.network.chainId as number
    const startTime = Date.now()

    try {
      await postMakerOrder(
        provider as any,
        false,
        nftInfo.collection.address,
        getAddressByName('Strategy', chainId),
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: token_id,
          startTime,
          endTime: addDays(startTime, period).getTime(),
          params: {
            values: [10001],
            types: ['uint256'],
          },
        },
        nftInfo.collection.chain
      )
      setOpenBidDlg(false)
      dispatch(openSnackBar({ message: 'Make Offer Success', status: 'success' }))
    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }

  const onAccept = async (bidOrder: IOrder) => {
    console.log('-buy--', order, provider)

    if (!order) {
      dispatch(openSnackBar({ message: 'Not listed', status: 'warning' }))
      return
    }

    const chainId = provider?.network.chainId || 4
    const lzChainId = getLayerzeroChainId(chainId)

    const omni = getOmniInstance(chainId, signer)
    const omnixExchange = getOmnixExchangeInstance(chainId, signer)
    const makerAsk : MakerOrderWithSignature = {
      isOrderAsk: order.isOrderAsk,
      signer: order?.signer,
      collection: order?.collectionAddress,
      price: order?.price,
      tokenId: order?.tokenId,
      amount: order?.amount,
      strategy: order?.strategy,
      currency: order?.currencyAddress,
      nonce: order?.nonce,
      startTime: order?.startTime,
      endTime: order?.endTime,
      minPercentageToAsk: order?.minPercentageToAsk,
      params: order?.params?.[0] as any,
      signature: order?.signature
    }
    const takerBid : TakerOrderWithEncodedParams = {
      isOrderAsk: false,
      taker: address || '0x',
      price: order?.price || '0',
      tokenId: order?.tokenId || '0',
      minPercentageToAsk: order?.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [lzChainId])
    }

    console.log('--buy----', makerAsk, takerBid)

    const lzFee = await omnixExchange.connect(signer as any).getLzFeesForAskWithTakerBid(takerBid, makerAsk)

    await omni.approve(omnixExchange.address, takerBid.price)
    await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })
  }

  const truncate = (str: string) => {
    return str.length > 12 ? str.substring(0, 9) + '...' : str
  }


  return (
    <>
      {nftInfo && nftInfo.nft && 
        <div className="w-full mt-40 pr-[70px] pb-[120px]">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-3 2xl:gap-12 lg:gap-1 xl:gap-4">
              <div className="col-span-1">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
                  <img className='rounded-[8px]' src={imageError?'/images/omnix_logo_black_1.png':nftInfo.nft.image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nftInfo.nft.image} />
                </LazyLoad>
              </div>
              <div className="col-span-2">
                <div className="px-6 py-3 bg-[#F8F9FA]">
                  <div className='flex items-center'>
                    <h1 className="text-[#1E1C21] text-[32px] font-bold mr-8">{nftInfo.collection.name}</h1>
                    <div className='h-[22px]'><Image src={PngCheck} alt="checkpng"/></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <h1 className="text-[#1E1C21] text-[23px] font-normal underline">{nftInfo.nft.name}</h1>
                    <Image src={PngSub} alt=""/>
                  </div>
                </div>

                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 py-3 mt-6">
                  <div className="">
                    <div className="flex justify-start items-center">
                      <h1 className="text-[#1E1C21] text-[20px] font-bold">owner:</h1>
                      {
                        owner && ownerType=='address' && <h1 className="text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={profileLink}><a target='_blank'>{truncate(owner)}</a></Link></h1>
                      }
                      
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <h1 className="text-[#1E1C21] text-[60px] font-normal">{order && order.price && ethers.utils.formatEther(order.price)}</h1>
                      {
                        currencies_list.map((currency,index) => {
                          if(currency.address==order?.currencyAddress){
                            return(
                              <div className="mr-5">
                                <img
                                  src={`/images/${currency.icon}`}
                                  className='mr-[8px] w-[21px]'
                                  alt="icon"
                                />
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                    <div className="mb-3">
                      <h1>{order && order.price && '$'}{order && order.price && ethers.utils.formatEther(order.price)}</h1>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-semibold">Highest Bid: <span className="font-normal">${highestBid}</span></h1>{highestBidCoin!=''&&<Image src={highestBidCoin} width={15} height={16} alt="chain  logo" />}</div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-semibold">Last Sale: <span className="font-normal">${lastSale}</span></h1>{lastSaleCoin!=''&&<Image src={PngEther} width={15} height={16} alt="chain logo" />}</div>
                      <div className="flex justify-end items-center">
                        { order && owner && address && owner.toLowerCase() != address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]" onClick={onBuy}>buy</button>
                        }
                        { owner && address && owner.toLowerCase() != address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]" onClick={() => {setOpenBidDlg(true)}}>bid</button>
                        }
                        { address && owner && owner.toLowerCase() == address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]" onClick={() => {setOpenSellDlg(true)}}>sell</button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] max-h-[285px]">
                      <div className="font-bold text-[18px]">account</div>
                      <div className="font-bold text-[18px]">chain</div>
                      <div className="font-bold text-[18px]">bid</div>
                      <div></div>
                      {
                        bidOrder && bidOrder.map((item) => {
                          return <>
                            <div className='break-all mt-3'>{truncate(item.signer)}</div>
                            <div className="text-center mt-3">
                              {
                                chainList.map((chain,index) => {
                                  if(chain.chain==item?.chain){
                                    return(
                                      <img
                                        src={chain.img_url}
                                        className='mr-[8px] w-[21px]'
                                        alt="icon"
                                      />
                                    )
                                  }
                                })
                              }
                            </div>
                            <div className='flex justify-start items-center mt-3'>
                              {currencies_list.map((currency,index) => {
                                if(currency.address==item?.currencyAddress){
                                  return(
                                    <div className="mr-5">
                                      <img
                                        src={`/images/${currency.icon}`}
                                        className='mr-[8px] w-[21px]'
                                        alt="icon"
                                      />
                                    </div>
                                  )
                                }
                              })}
                              <p className='ml-3'>${item && item.price && ethers.utils.formatEther(item.price)}</p>
                            </div>
                            <div className='text-right mt-3'><button className='bg-[#ADB5BD] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5' onClick={() => onAccept(item)}>accept</button></div>
                          </>
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="ml-10">
                <ul className="flex flex-wrap relative justify-item-stretch text-sm font-medium text-center text-gray-500">
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='items'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} onClick={()=>setCurrentTab('items')}>properties</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='activity'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} >activity</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='info'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} >info</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='stats'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} >stats</li>
                </ul>
              </div>
              <div className="border-2 border-[#E9ECEF] bg-[#F8F9FA] px-10 py-8">
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
          <ConfirmBid handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
        </div>
      }
    </>
  )
}

export default Item