import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'

import { getNFTInfo, selectNFTInfo } from '../../../redux/reducers/collectionsReducer'
import { collectionsService } from '../../../services/collections'
import { userService } from '../../../services/users'
import LazyLoad from 'react-lazyload'

import PngAlert from '../../../public/images/collections/alert.png'
import PngLike from '../../../public/images/collections/like.png'
import PngLink from '../../../public/images/collections/link.png'
import PngView from '../../../public/images/collections/view.png'

import PngCheck from '../../../public/images/check.png' 
import PngSub from '../../../public/images/subButton.png'

import PngEtherBg from '../../../public/images/collections/ethereum_bg.png'
import PngEther from '../../../public/images/collections/ethereum.png'
import PngEtherSvg from '../../../public/images/collections/ethereum.svg'
import PngIcon1 from '../../../public/images/collections/dbanner1.png'
import PngIcon2 from '../../../public/images/collections/dbanner2.png'
import PngIcon3 from '../../../public/images/collections/dbanner3.png'

import image_25 from '../../../public/images/image 25.png'
import useWallet from '../../../hooks/useWallet'
import { BigNumber, ethers } from 'ethers'
import { postMakerOrder, acceptOrder } from '../../../utils/makeOrder'
import { addressesByNetwork } from '../../../constants'
import { SupportedChainId } from '../../../types'
import { getOrders, getLastSaleOrders, selectOrders, selectBidOrders, selectLastSaleOrders } from '../../../redux/reducers/ordersReducer'
import { IGetOrderRequest, IOrder } from '../../../interface/interface'
import { openSnackBar } from '../../../redux/reducers/snackBarReducer'
import { addDays } from 'date-fns'

import usd from '../../../constants/abis/USD.json'
import omni from '../../../constants/abis/omni.json'
import currencyManagerABI from '../../../constants/abis/CurrencyManager.json'
import usdcAddress  from '../../../constants/USDC.json'
import usdtAddress  from '../../../constants/USDT.json'
import omniAddress from '../../../constants/OMNI.json'
import currencyManagerContractAddress from '../../../constants/CurrencyManager.json'

import { currencies_list } from '../../../utils/constants'
import { getChainIdFromName,getChainNameFromId } from '../../../utils/constants'
import { exec } from 'child_process'
const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')
  const [owner, setOwner] = useState('')
  const [ownerType, setOwnerType] = useState('address')


  const [order, setOrder] = useState<IOrder>()
  const [bidOrder, setBidOrder] = useState<IOrder[]>()
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  const [openBidDlg, setOpenBidDlg] = React.useState(false)
  const [profileLink, setProfileLink] = React.useState('')

  const [highestBid, setHighestBid] = React.useState(0)
  const [lastSale, setLastSale] = React.useState(0)
  const [highestBidCoin, setHighestBidCoin] = React.useState('')
  const [lastSaleCoin, setLastSaleCoin] = React.useState('')

  const [orderFlag, setOrderFlag] = React.useState(false)

  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)
  const lastSaleOrders = useSelector(selectLastSaleOrders)

  const {
    provider,
    address
  } = useWallet()

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

  const router = useRouter()
  const dispatch = useDispatch()

  const col_url = router.query.collection as string
  const token_id = router.query.item as string


  const nftInfo = useSelector(selectNFTInfo)

  useEffect(() => {
    const getNFTOwner = async(col_url:string, token_id:string) => {
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
      getNFTOwner(col_url, token_id)
    }
  }, [col_url, token_id])

  useEffect(() => {
    if ( nftInfo && nftInfo.collection) {
      if(nftInfo.collection.chain=='rinkeby' ) {
        if(ownerType=='address') {
          const profile_link = 'https://rinkeby.etherscan.io/address/' + owner
          setProfileLink(profile_link)
        } else if (ownerType=='username') {
          setProfileLink('')
        }
      }
      getListOrders()
      getBidOrders()
      getLastSaleOrder()
      setOrderFlag(true)
    }
  }, [nftInfo,owner])

  useEffect(() => {
    //ORDER
    setOrder(undefined)
    if (orders.length > 0  && nftInfo.collection!=undefined && nftInfo.nft!=undefined && orderFlag) {
      if(nftInfo.collection.address===orders[0].collectionAddress&&Number(nftInfo.nft.token_id)===Number(orders[0].tokenId)){
        setOrder(orders[0])
      }
    }
    //BID ORDER
    setHighestBid(0)
    setHighestBidCoin('')
    if(bidOrders.length > 0 && nftInfo.collection!=undefined && nftInfo.nft!=undefined && orderFlag){
      const temp_bidOrders: any = []
      let bid_balance = 0
      for(let i=0; i<bidOrders.length;i++){
        if(nftInfo.collection.address===bidOrders[i].collectionAddress&&Number(nftInfo.nft.token_id)===Number(bidOrders[i].tokenId)){
          temp_bidOrders.push(bidOrders[i])
          if(bid_balance < Number(ethers.utils.formatEther(bidOrders[i].price))){
            bid_balance = Number(ethers.utils.formatEther(bidOrders[i].price))
            const chainIdForList = getChainIdFromName(bidOrders[i].chain)
            for(let j=0;j<currencies_list[chainIdForList as number].length;j++){
              if(currencies_list[chainIdForList as number][j].address==bidOrders[i].currencyAddress){
                setHighestBidCoin(`/images/${currencies_list[chainIdForList as number][j].icon}`)
              }
            }
          }
        }
      }
      setBidOrder(temp_bidOrders)
      setHighestBid(bid_balance)
    }

    //SALE ORDER
    setLastSale(0)
    setLastSaleCoin('')

    if(lastSaleOrders.length > 0 && nftInfo.collection!=undefined && nftInfo.nft!=undefined && orderFlag){
      if(nftInfo.collection.address===lastSaleOrders[0].collectionAddress&&Number(nftInfo.nft.token_id)===Number(lastSaleOrders[0].tokenId)){
        setLastSale(Number(ethers.utils.formatEther(lastSaleOrders[0].price)))
        const chainIdForList = getChainIdFromName(lastSaleOrders[0].chain)
        for(let j=0;j<currencies_list[chainIdForList as number].length;j++){
          if(currencies_list[chainIdForList as number][j].address==lastSaleOrders[0].currencyAddress){
            setLastSaleCoin(`/images/${currencies_list[chainIdForList as number][j].icon}`)
          }
        }
      }
    }
  }, [orders,bidOrders,lastSaleOrders,nftInfo,orderFlag])


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

  const getListOrders = () => {
    const request: IGetOrderRequest = {
      isOrderAsk: true,
      collection: nftInfo.collection.address,
      tokenId: nftInfo.nft.token_id,
      signer: owner,
      startTime: Math.floor(Date.now() / 1000).toString(),
      endTime: Math.floor(Date.now() / 1000).toString(),
      status: ['VALID'],
      sort: 'NEWEST'
    }
    dispatch(getOrders(request) as any)
  }

  const getBidOrders = () => {
    const bidRequest: IGetOrderRequest = {
      isOrderAsk: false,
      collection: nftInfo.collection.address,
      tokenId: nftInfo.nft.token_id,
      startTime: Math.floor(Date.now() / 1000).toString(),
      endTime: Math.floor(Date.now() / 1000).toString(),
      status: ['VALID'],
      sort: 'PRICE_ASC'
    }
    dispatch(getOrders(bidRequest) as any)
  }

  const getLastSaleOrder = () => {
    const excutedRequest: IGetOrderRequest = {
      collection: nftInfo.collection.address,
      tokenId: nftInfo.nft.token_id,
      status: ['EXECUTED'],
      sort: 'UPDATE_NEWEST'
    }
    dispatch(getLastSaleOrders(excutedRequest) as any)
  }

  const onBid = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    const chain = getChainNameFromId(chainId)
    
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()

    const Provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = Provider.getSigner()
    let usdContract = null
    let contractAddress =''
    let currencyMangerContract = null
    const key = chainId.toString() as keyof typeof currencyManagerContractAddress

    if(currencyManagerContractAddress[key]!=''){
      currencyMangerContract =  new ethers.Contract(currencyManagerContractAddress[key], currencyManagerABI, signer)
    }

    if(currencyMangerContract===null){
      dispatch(openSnackBar({ message: "This network doesn't support currencies", status: 'error' }))
      setOpenBidDlg(false)
      return
    }

    if(currency===''){
      dispatch(openSnackBar({ message: 'Current Currency is not supported in this network', status: 'error' }))
      setOpenBidDlg(false)
      return
    }
    
    if(currency===currencies_list[provider?._network.chainId as number][0]['address']){//OMNI
      const isOmniCoin = await currencyMangerContract.isOmniCurrency(currency)
      if(isOmniCoin){
        contractAddress = omniAddress[key]
        if(contractAddress!=''){
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        }
      } else {
        dispatch(openSnackBar({ message: 'omni currency is not whitelisted in this network', status: 'error' }))
        setOpenBidDlg(false)
        return
      }
    } else if (currency===currencies_list[provider?._network.chainId as number][1]['address']){//USDC
      const isUsdcCoin = await currencyMangerContract.isCurrencyWhitelisted(currency)
      if(isUsdcCoin){
        contractAddress = usdcAddress[key]
        if(contractAddress!=''){
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        }
      } else {
        dispatch(openSnackBar({ message: 'USDC currency is not whitelisted in this network', status: 'error' }))
        setOpenBidDlg(false)
        return
      }
    } else if (currency===currencies_list[provider?._network.chainId as number][2]['address']) {//USDT
      const isUsdtCoin = await currencyMangerContract.isCurrencyWhitelisted(currency)
      if(isUsdtCoin){
        contractAddress = usdcAddress[key]
        if(contractAddress!=''){
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        }
      } else {
        dispatch(openSnackBar({ message: 'USDT currency is not whitelisted in this network', status: 'error' }))
        setOpenBidDlg(false)
        return
      }
    }

    if(usdContract===null){
      dispatch(openSnackBar({ message: 'This network does not support this coin', status: 'error' }))
      setOpenBidDlg(false)
      return
    }

    const balance = await usdContract?.balanceOf(address)

    if(Number(price) === 0) {
      dispatch(openSnackBar({ message: 'Please enter a number greater than 0', status: 'error' }))
      setOpenBidDlg(false)
      return
    }

    if(Number(ethers.utils.formatEther(balance)) < Number(price)) {
      dispatch(openSnackBar({ message: 'There is not enough balance', status: 'error' }))
      setOpenBidDlg(false)
      return
    }

    try {
      await postMakerOrder(
        provider as any,
        chainId,
        false,
        nftInfo.collection.address,
        addresses.STRATEGY_STANDARD_SALE,
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: token_id,
          startTime: startTime,
          endTime: addDays(startTime, period).getTime(),
          params: {
            values: [10001],
            types: ['uint256'],
          },
        },
        chain
      )
      setOpenBidDlg(false)
      dispatch(openSnackBar({ message: 'Make Offer Success', status: 'success' }))

      getBidOrders()
    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }

  const onBuy = async() => {
    const hash = orders[0].hash
    
    try {
      await acceptOrder(
        hash,
        'EXECUTED'
      )
      for(let i = 1; i<orders.length;i++){
        await acceptOrder(
          orders[i].hash,
          'EXPIRED'
        )
      }
      dispatch(openSnackBar({ message: 'BUY Success', status: 'success' }))

      getBidOrders()
      getListOrders()
      getLastSaleOrder()
      getNFTOwnership(col_url, token_id)
    } catch(error){
      console.log(error)
    }
  }

  const onAccept = async(index:number) => {
    const hash = bidOrders[index].hash
    
    try {
      await acceptOrder(
        hash,
        'EXECUTED'
      )

      for(let i = 0; i<orders.length;i++){
        await acceptOrder(
          orders[i].hash,
          'EXPIRED'
        )
      }

      dispatch(openSnackBar({ message: 'ACCEPT Success', status: 'success' }))

      getBidOrders()
      getListOrders()
      getLastSaleOrder()
      getNFTOwnership(col_url, token_id)
    } catch(error){
      console.log(error)
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
        nftInfo.collection.address,
        addresses.STRATEGY_STANDARD_SALE,
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: token_id,
          startTime: startTime,
          endTime: addDays(startTime, period).getTime(),
          params: {
            values: [10001],
            types: ['uint256'],
          },
        },
        nftInfo.collection.chain
      )
      setOpenSellDlg(false)
      dispatch(openSnackBar({ message: 'Listing Success', status: 'success' }))
      getListOrders()

    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }

  const truncate = (str: string) => {
    return str.length > 12 ? str.substring(0, 9) + '...' : str
  }


  return (
    <>
      {nftInfo && nftInfo.nft && 
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
                      <h1 className="text-[#1E1C21] text-[60px] font-bold">{order && order.price && ethers.utils.formatEther(order.price)}</h1>
                      {
                        currencies_list[provider?._network.chainId as number].map((currency,index) => {
                          if(currency.address==order?.currencyAddress){
                            return(
                              <div className="mr-5" key={index}>
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
                      <span className='font-normal font-[16px]'>{order && order.price && '$'}{order && order.price && ethers.utils.formatEther(order.price)}</span>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-bold">Highest Bid: <span className="font-bold">{highestBid}</span></h1>{highestBidCoin!=''&&<Image src={highestBidCoin} width={15} height={16} alt="chain  logo" />}</div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-bold">Last Sale: <span className="font-bold">{lastSale!=0&&lastSale}</span></h1>{lastSaleCoin!=''&&<Image src={lastSaleCoin} width={15} height={16} alt="chain logo" />}</div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] min-h-[210px] max-h-[210px]">
                      <div className="font-bold text-[18px] text-[#000000]">account</div>
                      <div className="font-bold text-[18px] text-[#000000]">chain</div>
                      <div className="font-bold text-[18px] text-[#000000]">bid</div>
                      <div></div>
                      {
                        bidOrder && bidOrder.map((item,idx) => {
                          return <>
                            <div className='break-all mt-3 text-[16px] font-bold' key={idx}>{truncate(item.signer)}</div>
                            <div className="text-center mt-3">
                              {
                                chainList.map((chain,index) => {
                                  if(chain.chain==item?.chain){
                                    return(
                                      <img
                                        src={chain.img_url}
                                        className='mr-[8px] w-[21px]'
                                        alt="icon"
                                        key={index}
                                      />
                                    )
                                  }
                                })
                              }
                            </div>
                            <div className='flex justify-start mt-3'>
                              {currencies_list[getChainIdFromName(item.chain)].map((currency,index) => {
                                if(currency.address==item?.currencyAddress){
                                  return(
                                    <div className="mr-5" key={index}>
                                      <img
                                        src={`/images/${currency.icon}`}
                                        className='mr-[8px] w-[21px]'
                                        alt="icon"
                                      />
                                    </div>
                                  )
                                }
                              })}
                              <p className='ml-3 text-[16px] font-bold'>${item && item.price && ethers.utils.formatEther(item.price)}</p>
                            </div>
                            <div className='text-right mt-3'>{owner.toLowerCase()==address?.toLowerCase()&&<button className='bg-[#ADB5BD] hover:bg-[#38B000] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5' onClick={() => onAccept(idx)}>accept</button>}</div>
                          </>
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pb-3  bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="mb-3">
                      <div className="">
                        { order && owner && address && owner.toLowerCase() != address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]" onClick={()=>onBuy()}>buy</button>
                        }
                        { address && owner && owner.toLowerCase() == address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]" onClick={() => {setOpenSellDlg(true)}}>sell</button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    { owner && address && owner.toLowerCase() != address.toLowerCase() && 
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
          <ConfirmSell handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} onSubmit={onListing} />
          <ConfirmBid handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} onSubmit={onBid}/>
        </div>
      }
    </>
  )
}

export default Item