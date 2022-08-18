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
import { IBidData, IGetOrderRequest, IListingData, IOrder } from '../../../interface/interface'
import { ContractName, CREATOR_FEE, CURRENCIES_LIST, getAddressByName, getChainInfo, getChainNameById, getCurrencyIconByAddress, getLayerzeroChainId, PROTOCAL_FEE } from '../../../utils/constants'
import { getCurrencyInstance, getERC721Instance, getTransferSelectorNftInstance, getOmniInstance, getOmnixExchangeInstance } from '../../../utils/contracts'

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
        // startTime: Math.floor(Date.now() / 1000).toString(),
        // endTime: Math.floor(Date.now() / 1000).toString(),
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
      setOrder(orders[0])
    } else {
      setOrder(undefined)
    }
  }, [orders])

  useEffect(() => {
    if (bidOrders.length > 0  && bid_flag) {
      const temp_bidOrders: any = []
      let bid_balance = 0
      for(let i=0; i<bidOrders.length;i++){
        temp_bidOrders.push(bidOrders[i])
        if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
          bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
          for(let j=0;j<CURRENCIES_LIST.length;j++){
            // if(CURRENCIES_LIST[j].address==bidOrders[i].currencyAddress){
            setHighestBidCoin(`/images/${CURRENCIES_LIST[j].icon}`)
            // }
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
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)
    const chainId = provider?.network.chainId || 4
    const lzChainId = getLayerzeroChainId(chainId)
    const startTime = Date.now()
    
    await postMakerOrder(
      provider as any,
      !listingData.isAuction,
      nftInfo.collection.address,
      getAddressByName('Strategy', chainId),
      amount,
      price,
      protocalFees,
      creatorFees,
      getAddressByName(listingData.currencyName as ContractName, chainId),
      {
        tokenId: token_id,
        startTime,
        endTime: addDays(startTime, listingData.period).getTime(),
        params: {
          values: [lzChainId],
          types: ['uint16'],
        },
      },
      nftInfo.collection.chain,
      true
    )

    if (!listingData.isAuction) {
      const transferSelector = getTransferSelectorNftInstance(chainId, signer)
      const transferManagerAddr = await transferSelector.checkTransferManagerForToken(nftInfo.collection.address)
      const nftContract = getERC721Instance(nftInfo.collection.address, chainId, signer)
      await nftContract.approve(transferManagerAddr, token_id)
    }

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

    const omni = getCurrencyInstance(order.currencyAddress, chainId, signer)
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
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], order?.params),
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

    console.log('---lzFee---', lzFee)

    await omni.approve(omnixExchange.address, takerBid.price)
    await omni.approve(getAddressByName('FundManager', chainId), takerBid.price)
    await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })
  }

  const onBid = async (bidData: IBidData) => {
    if (!order) {
      dispatch(openSnackBar({ message: '  Please list first to place a bid', status: 'warning' }))
      return
    }

    const chainId = provider?.network.chainId as number
    const lzChainId = getLayerzeroChainId(chainId)

    const currency = getAddressByName(bidData.currencyName as ContractName, chainId)
    const price = ethers.utils.parseEther(bidData.price.toString())
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)

    try {
      await postMakerOrder(
        provider as any,
        false,
        nftInfo.collection.address,
        order?.strategy,
        order?.amount,
        price,
        protocalFees,
        creatorFees,
        currency,
        {
          tokenId: token_id,
          startTime: order.startTime,
          endTime: order.endTime,
          params: {
            values: [lzChainId],
            types: ['uint16'],
          },
        },
        getChainNameById(chainId),
        true
      )

      const omni = getCurrencyInstance(currency, chainId, signer)
      await omni.approve(getAddressByName('OmnixExchange', chainId), price)
      await omni.approve(getAddressByName('FundManager', chainId), price)

      setOpenBidDlg(false)
      dispatch(openSnackBar({ message: 'Place a bid Success', status: 'success' }))
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
    
    const omnixExchange = getOmnixExchangeInstance(chainId, signer)
    const makerBid : MakerOrderWithSignature = {
      isOrderAsk: false,
      signer: bidOrder.signer,
      collection: bidOrder.collectionAddress,
      price: bidOrder.price,
      tokenId: bidOrder.tokenId,
      amount: bidOrder.amount,
      strategy: bidOrder.strategy,
      currency: bidOrder.currencyAddress,
      nonce: bidOrder.nonce,
      startTime: bidOrder.startTime,
      endTime: bidOrder.endTime,
      minPercentageToAsk: bidOrder.minPercentageToAsk,
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], bidOrder.params),
      signature: bidOrder.signature
    }
    const takerAsk : TakerOrderWithEncodedParams = {
      isOrderAsk: true,
      taker: address || '0x',
      price: bidOrder.price || '0',
      tokenId: bidOrder.tokenId || '0',
      minPercentageToAsk: bidOrder.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [lzChainId])
    }

    console.log('--accept a bid----', makerBid, takerAsk)

    const transferSelector = getTransferSelectorNftInstance(chainId, signer)
    const transferManagerAddr = await transferSelector.checkTransferManagerForToken(nftInfo.collection.address)
    const nftContract = getERC721Instance(nftInfo.collection.address, chainId, signer)
    await nftContract.approve(transferManagerAddr, token_id)

    const lzFee = 0 // await omnixExchange.connect(signer as any).getLzFeesForBidWithTakerAsk(takerAsk, makerBid)
    
    await omnixExchange.connect(signer as any).matchBidWithTakerAsk(takerAsk, makerBid, { value: lzFee })
  }

  const truncate = (str: string) => {
    return str.length > 12 ? str.substring(0, 9) + '...' : str
  }

  const currencyIcon = getCurrencyIconByAddress(order?.currencyAddress)

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
                      <div className="mr-5">
                        {currencyIcon && 
                          <img
                            src={`/images/${currencyIcon}`}
                            className='mr-[8px] w-[21px]'
                            alt="icon"
                          />
                        }
                      </div>
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
                                chainList.map((chain, index) => {
                                  if (chain.chain == item?.chain){
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
                              <div className="mr-5">
                                {currencyIcon &&
                                  <img
                                    src={`/images/${currencyIcon}`}
                                    className='mr-[8px] w-[21px]'
                                    alt="icon"
                                  />
                                }
                              </div>
                              <p className='ml-3'>${item && item.price && ethers.utils.formatEther(item.price)}</p>
                            </div>
                            <div className='text-right mt-3'>
                              {address && owner && owner.toLowerCase() == address.toLowerCase() &&
                                <button className='bg-[#ADB5BD] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5' onClick={() => onAccept(item)}>
                                  accept
                                </button>
                              }
                            </div>
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
          <ConfirmBid onSubmit={onBid} handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
        </div>
      }
    </>
  )
}

export default Item