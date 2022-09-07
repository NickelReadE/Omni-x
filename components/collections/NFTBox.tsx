import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IPropsNFTItem } from '../../interface/interface'
import LazyLoad from 'react-lazyload'
import USD from '../../public/images/USD.png'
import { ethers } from 'ethers'
import { selectOrders, selectBidOrders, selectLastSaleOrders,getOrders } from '../../redux/reducers/ordersReducer'
import { useDispatch, useSelector } from 'react-redux'
import useWallet from '../../hooks/useWallet'
import { isYesterday } from 'date-fns'
import ConfirmBid from './ConfirmBid'

import { IGetOrderRequest } from '../../interface/interface'

import usd from '../../constants/abis/USD.json'
import omni from '../../constants/abis/omni.json'
import currencyManagerABI from '../../constants/abis/CurrencyManager.json'
import usdc from '../../constants/USDC.json'
import usdt from '../../constants/USDT.json'
import omniCoin from '../../constants/OMNI.json'
import currencyManagerContractAddress from '../../constants/CurrencyManager.json'

import { openSnackBar } from '../../redux/reducers/snackBarReducer'

import { postMakerOrder } from '../../utils/makeOrder'
import { addressesByNetwork } from '../../constants'
import { SupportedChainId } from '../../types'

import { addDays } from 'date-fns'

import editStyle from '../../styles/nftbox.module.scss'
import classNames from '../../helpers/classNames'


import { currencies_list } from '../../utils/constants'
import { chainIdInfos } from '../../utils/constants'

const NFTBox = ({nft, col_url,col_address, chain}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [openSellDlg, setOpenBidDlg] = useState(false)
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [islisted,setList] = useState(false)
  const [price, setPrice] = useState('')
  const [img_url, setImageURL] = useState('')
  const [lastSale, setLastSale] = useState(0)
  const [lastSaleCoin, setLastSaleCoin] = useState('')
  const [highestBid, setHighestBid] = useState(0)
  const [highestBidCoin, setHighestBidCoin] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [isShowBtn, SetIsShowBtn] = useState(false)
  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders)
  const executedOrders = useSelector(selectLastSaleOrders)

  const {
    provider,
    address
  } = useWallet()

  const dispatch = useDispatch()

  useEffect(() => {
    if(nft){
      if (col_address == '0xb7b0d9849579d14845013ef9d8421ae58e9b9369' || col_address == '0x7470ea065e50e3862cd9b8fb7c77712165da80e5' || col_address == '0xb74bf94049d2c01f8805b8b15db0909168cabf46' || col_address == '0x7f04504ae8db0689a0526d99074149fe6ddf838c' || col_address == '0xa783cc101a0e38765540ea66aeebe38beebf7756'|| col_address == '0x316dc98ed120130daf1771ca577fad2156c275e5') {
        setImage(nft.image)
        for(let i=0;i<orders.length;i++){
          if(orders[i].tokenId==nft.token_id && orders[i].collectionAddress==col_address && orders[i].chain==chain) {
            setPrice(ethers.utils.formatEther(orders[i].price))
            setList(true)
            const chainIdForList = chainIdInfos[orders[i].chain as string]
            currencies_list[chainIdForList as number].map((item,index) => {
              if(item.address==orders[i].currencyAddress){
                setImageURL(`/images/${item.icon}`)
              }
            })
            if(orders[i].signer==address){
              setIsOwner(true)
            }
          }
        }
        if(executedOrders.length > 0) {
          let lastprice = 0
          for(let i=0;i<executedOrders.length;i++){
            if(executedOrders[i].tokenId==nft.token_id && executedOrders[i].collectionAddress==col_address){
              lastprice = Number(ethers.utils.formatEther(executedOrders[i].price))
              const chainIdForList = chainIdInfos[executedOrders[i].chain as string]
              for(let j=0;j<currencies_list[chainIdForList as number].length;j++){
                if(currencies_list[chainIdForList as number][j].address==executedOrders[i].currencyAddress){
                  setLastSaleCoin(`/images/${currencies_list[chainIdForList as number][j].icon}`)
                }
              }
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
                const chainIdForList = chainIdInfos[bidOrders[i].chain as string]
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
    }
  },[nft,orders,bidOrders,executedOrders])

  const getBidOrders = () => {
    const bidRequest: IGetOrderRequest = {
      isOrderAsk: false,
      collection: col_address,
      startTime: Math.floor(Date.now() / 1000).toString(),
      endTime: Math.floor(Date.now() / 1000).toString(),
      status: ['VALID'],
      sort: 'PRICE_ASC'
    }
    dispatch(getOrders(bidRequest) as any)
  }


  const onBid = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    let chain = provider?._network.name as string
    if(chain=='unknown'){
      if(chainId==4002){
        chain='fantom'
      } else if(chainId==43113){
        chain='avalanche testnet'
      }
    }
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()

    const Provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = Provider.getSigner()
    let usdContract = null
    let contractAddress =''
    let currencyMangerContract = null
    console.log(chain)
    if(chainId===4){
      currencyMangerContract =  new ethers.Contract(currencyManagerContractAddress['rinkeby'], currencyManagerABI, signer)
    } else if(chainId===97) {
      currencyMangerContract =  new ethers.Contract(currencyManagerContractAddress['bsc-testnet'], currencyManagerABI, signer)
    } else if(chainId===43113) {
      currencyMangerContract =  new ethers.Contract(currencyManagerContractAddress['fuji'], currencyManagerABI, signer)
    } else if(chainId===80001) {
      //
    } else if(chainId===421611) {
      //
    } else if(chainId===69) {
      //
    } else if(chainId===4002) {
      //
    }

    if(currencyMangerContract===null){
      dispatch(openSnackBar({ message: 'This network does not support currencies', status: 'error' }))
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
        if(chainId===4){
          contractAddress = omniCoin['rinkeby']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===97) {
          contractAddress = omniCoin['bsc-testnet']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===43113) {
          contractAddress = omniCoin['fuji']
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
        if(chainId===4){
          contractAddress = usdc['rinkeby']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===43113) {
          contractAddress = usdc['fuji']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===80001) {
          contractAddress = usdc['mumbai']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===421611) {
          contractAddress = usdc['arbitrum-rinkeby']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===69) {
          contractAddress = usdc['optimism-kovan']
          usdContract =  new ethers.Contract(contractAddress, omni, signer)
        } else if(chainId===4002) {
          contractAddress = usdc['fantom-testnet']
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
        if(chainId===97){
          contractAddress = usdt['bsc-testnet']
          usdContract =  new ethers.Contract(contractAddress, usd, signer)
        }
      } else {
        dispatch(openSnackBar({ message: 'USDT currency is not whitelisted in this network', status: 'error' }))
        setOpenBidDlg(false)
        return
      }
    }

    if(usdContract===null){
      dispatch(openSnackBar({ message: "This network doesn't support this coin", status: 'error' }))
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
        col_address as any,
        addresses.STRATEGY_STANDARD_SALE,
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: nft.token_id,
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

  return (
    <div className={classNames('w-full border-[2px] border-[#F6F8FC] rounded-[8px] cursor-pointer hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)} onMouseEnter={() => SetIsShowBtn(true)} onMouseLeave={() => SetIsShowBtn(false)}>
      <Link href={`/collections/${col_url}/${nft.token_id}`}>
        <a>
          <div className="group relative flex justify-center text-center overflow-hidden rounded-md">
            <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
              <img className='collection-nft-image-item rounded-md object-cover ease-in-out duration-500 group-hover:scale-110' src={imageError||nft.image==null?'/images/omnix_logo_black_1.png':nft.image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nft.image} />
            </LazyLoad>
            {/* <div className={classNames('absolute top-[8px] right-[9px] p-[12px]', editStyle.ellipseBtn)}>
              <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
            </div> */}
          </div>
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
            <div className="text-[#000000] text-[14px] font-bold  mt-3 ml-3">
              {nft.name}
            </div>
            <div className="mr-3 flex items-center">
              {/* <div className={classNames("mr-3 flex items-center cursor-pointer bg-[url('/images/round-refresh.png')] hover:bg-[url('/images/round-refresh_hover.png')] bg-cover w-[20px] h-[20px]", editStyle.refreshBtn)}></div> */}
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
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
            <div className="flex items-center ml-3">
              {islisted && img_url==''&&<><img src={'/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt='icon'/><span className="text-[#000000] text-[18px] font-extrabold ml-2">{price}</span></>}
              {islisted && img_url!=''&&<><img src={img_url} className="w-[18px] h-[18px]" alt='icon'/><span className="text-[#000000] text-[18px] font-extrabold ml-2">{price}</span></>}
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle  font-['RetniSans']">
        <Link href={`/collections/${col_url}/${nft.token_id}`}><a><div className="flex items-center ml-3">
          {lastSale!=0&&<><span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span><img src={lastSaleCoin} className="w-[18px] h-[18px]" />&nbsp;<span className="text-[#6C757D] text-[14px]font-bold">{lastSale}</span></>}
          {lastSale==0&&highestBid!=0&&<><span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span><img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;<span className="text-[#6C757D] text-[14px] font-bold">{highestBid}</span></>} 
        </div></a></Link>
        <div className="flex items-center ml-3">
          <div>&nbsp;</div>
          {
            isShowBtn&&isOwner&&<Link href={`/collections/${col_url}/${nft.token_id}`}><a><div className="ml-2 mr-2 py-[1px] px-5 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#B00000]">
              {'Sell'}
            </div></a></Link>
          }
          {
            isShowBtn&&!isOwner&& islisted &&<Link href={`/collections/${col_url}/${nft.token_id}`}><a><div className="ml-2 mr-2 py-[1px] px-5 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#38B000]">
              {'Buy now'} 
            </div></a></Link>
          }
          {
            isShowBtn&&!isOwner&& !islisted &&<div className="ml-2 mr-2 py-[1px] px-5 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#38B000]" onClick={() => setOpenBidDlg(true)}>
              {'Bid'}
            </div>
          }
        </div>
      </div>


      <ConfirmBid handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onBid} />
    </div>
  )
}

export default NFTBox
