import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'

import { getNFTInfo, selectNFTInfo } from '../../../redux/reducers/collectionsReducer'
import { collectionsService } from '../../../services/collections'
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
import { ethers } from 'ethers'
import { postMakerOrder } from '../../../utils/makeOrder'
import { MakerOrderWithSignature, TakerOrderWithEncodedParams } from '../../../types'
import { getOrders, selectOrders } from '../../../redux/reducers/ordersReducer'
import { IGetOrderRequest, IListingData, IOrder } from '../../../interface/interface'
import { openSnackBar } from '../../../redux/reducers/snackBarReducer'
import { getOmnixExchangeInstance } from '../../../utils/contracts'
import { getAddressByName } from '../../../utils/constants'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')
  const [owner, setOwner] = useState('')
  const orders = useSelector(selectOrders)
  const [order, setOrder] = useState<IOrder>()

  const {
    provider,
    signer,
    address
  } = useWallet()
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  const [openBidDlg, setOpenBidDlg] = React.useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const col_url = router.query.Collection as string
  const token_id = router.query.Item as string

  const nftInfo = useSelector(selectNFTInfo)
  const isAuction = false;

  useEffect(() => {
    const getNFTOwnership = async(col_url: string, token_id: string) => {
      const tokenIdOwner = await collectionsService.getNFTOwner(col_url, token_id)
      if ( tokenIdOwner.length > 0 ) {
        setOwner(tokenIdOwner)
      }
    }
    if ( col_url && token_id ) {
      dispatch(getNFTInfo(col_url, token_id) as any)
      getNFTOwnership(col_url, token_id)
    }
  }, [col_url, token_id])

  useEffect(() => {
    if ( nftInfo && nftInfo.collection && owner ) {
      
      const request: IGetOrderRequest = {
        isOrderAsk: true,
        chain: nftInfo.collection.chain,
        collection: nftInfo.collection.address,
        tokenId: nftInfo.nft.token_id,
        signer: owner,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: "PRICE_ASC"
      }
      dispatch(getOrders(request) as any)
    }
  }, [nftInfo, owner])

  useEffect(() => {
    if ( orders.length > 0 ) {
      setOrder(orders[orders.length - 1])
    }
  }, [orders])

  const onBuy = async () => {
    console.log('-buy--', order, provider);

    if (!order) {
      dispatch(openSnackBar({ message: `Not listed`, status: 'warning' }))
      return
    }

    const omnixExchange = getOmnixExchangeInstance(provider?._network?.chainId || 0, signer)
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
    };
    const takerBid : TakerOrderWithEncodedParams = {
      isOrderAsk: false,
      taker: address || '0x',
      price: order?.price || '0',
      tokenId: order?.tokenId || '0',
      minPercentageToAsk: order?.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [provider?.network.chainId])
    }

    console.log('--buy----', makerAsk, takerBid);

    console.log('--omnixExchange-', await omnixExchange.owner(), await omnixExchange.remoteAddrManager())

    // const lzFee = await omnixExchange.connect(signer as any).getLzFeesForAskWithTakerBid(takerBid, makerAsk)

    // console.log('--lzFee----', lzFee);
    // await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })
  }

  const onBid = async () => {
    const price = ethers.utils.parseEther("1")
    const chainId = provider?.network.chainId || 4
    
    await postMakerOrder(
      provider as any,
      chainId,
      false,
      nftInfo.collection.address,
      getAddressByName('Strategy', chainId),
      ethers.utils.parseUnits("1", 1),
      price,
      ethers.utils.parseUnits("2", 2),
      ethers.utils.parseUnits("2", 2),
      getAddressByName('OFT', chainId),
      {
        tokenId: token_id,
        startTime: Date.now(),
        params: {
          values: [chainId],
          types: ["uint256"],
        },
      },
      nftInfo.collection.chain
    )
    dispatch(openSnackBar({ message: `Make Offer Success`, status: 'success' }))
  }

  const onListing = async (listingData: IListingData) => {
    const price = ethers.utils.parseEther(listingData.price)
    const amount = ethers.utils.parseUnits("1", 0);
    const protocalFees = ethers.utils.parseUnits("2", 2);
    const creatorFees = ethers.utils.parseUnits("2", 2);
    const chainId = provider?.network.chainId || 4
    
    await postMakerOrder(
      provider as any,
      chainId,
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
        startTime: Date.now(),
        params: {
          values: [chainId],
          types: ["uint256"],
        },
      },
      nftInfo.collection.chain
    )

    dispatch(openSnackBar({ message: `  Success`, status: 'success' }))
    setOpenSellDlg(false);
  }
  const truncate = (str: string) => {
    return str.length > 12 ? str.substring(0, 9) + '...' : str
  }

  const bidData = [
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
    {account: '', chain: 'eth', bid: '', bidtype: '', owner: ''},
  ]

  console.log('---owner && address-----', owner, address, orders, order);

  const buttons = <>
    {owner?.toLowerCase() === address?.toLowerCase() && (
      <button
        className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]"
        onClick={() => {setOpenSellDlg(true)}}
      >
        Sell
      </button>
    )}
    {owner !== address && !isAuction && (
      <button
        className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]"
        onClick={onBuy}
      >
        Buy
      </button>
    )}
    {owner !== address && isAuction && (
      <button
        className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]"
        onClick={() => {setOpenBidDlg(true)}}
      >
        Bid
      </button>
    )}
  </>

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
                      <h1 className="text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">BOOBA.ETH</h1>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                      <h1 className="text-[#1E1C21] text-[60px] font-normal leading-[4rem]">69.5</h1>
                      <div className="mr-5"><PngEtherSvg /></div>
                    </div>
                    <div className="mb-3">
                      <h1>{order && order.price && ethers.utils.formatEther(order.price)}</h1>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-semibold">Highest Bid: <span className="font-normal">45</span></h1><Image src={PngEther} width={15} height={16} alt="chain  logo" /></div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-semibold">Last Sale: <span className="font-normal">42</span></h1><Image src={PngEther} width={15} height={16} alt="chain logo" /></div>
                      <div className="flex justify-end items-center">
                        {buttons}
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] max-h-[285px]">
                      <div className="font-bold text-[18px]">account</div>
                      <div className="text-center font-bold text-[18px]">chain</div>
                      <div className="font-bold text-[18px]">bid</div>
                      <div></div>
                      {
                        bidData.map((item, index) => {
                          return <>
                            <div className='break-all mt-3'>{truncate('0x0F20E363294b858507aA7C84EF525E5700d93999')}</div>
                            <div className="text-center mt-3"><Image src={PngEther}  className='mt-[22px]'/></div>
                            <div className='flex justify-start items-center mt-3'>
                              <Image src={PngIcon1}  className='mt-[22px]'/>
                              <p className='ml-3'>45,700.00</p>
                            </div>
                            <div className='text-right mt-3'><button className='bg-[#ADB5BD] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5'>accept</button></div>
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
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='activity'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} onClick={()=>setCurrentTab('activity')}>activity</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='stats'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} onClick={()=>setCurrentTab('stats')}>info</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='stats'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F8F9FA] text-[#6C757D]'}`} onClick={()=>setCurrentTab('stats')}>stats</li>
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
          <ConfirmSell handleListing={onListing} handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
          <ConfirmBid handleBidDlgClose={() => {setOpenBidDlg(false)}} openBidDlg={openBidDlg} nftImage={nftInfo.nft.image} nftTitle={nftInfo.nft.name} />
        </div>
      }
    </>
  )
}

export default Item