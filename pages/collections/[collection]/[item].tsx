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
import { ethers } from 'ethers'
import { postMakerOrder } from '../../../utils/makeOrder'
import { addressesByNetwork } from '../../../constants'
import { SupportedChainId } from '../../../types'
import { getOrders, selectOrders } from '../../../redux/reducers/ordersReducer'
import { IGetOrderRequest, IOrder } from '../../../interface/interface'
import { openSnackBar } from '../../../redux/reducers/snackBarReducer'
import { addDays } from 'date-fns'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')
  const [owner, setOwner] = useState('')
  const [ownerType, setOwnerType] = useState('')
  const orders = useSelector(selectOrders)
  const [order, setOrder] = useState<IOrder>()
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  const [openBidDlg, setOpenBidDlg] = React.useState(false)
  const [profileLink, setProfileLink] = React.useState('')

  const {
    provider,
    address
  } = useWallet()

  // console.log(provider)


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
        sort: 'PRICE_ASC'
      }
      dispatch(getOrders(request) as any)
    }
  }, [nftInfo, owner, ownerType])

  useEffect(() => {
    if ( orders.length > 0 ) {
      setOrder(orders[0])
    }
  }, [orders])

  const onBid = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()

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
        nftInfo.collection.chain
      )
      setOpenBidDlg(false)
      dispatch(openSnackBar({ message: 'Make Offer Success', status: 'success' }))
    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
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
    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
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
                <div className="px-6 py-3 bg-[#F6F8FC]">
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
                      <div className="mr-5"><PngEtherSvg /></div>
                    </div>
                    <div className="mb-3">
                      <h1>$175,743.58</h1>
                      <div className="flex justify-start items-center mt-5"><h1 className="mr-3 font-semibold">Highest Bid: <span className="font-normal">45</span></h1><Image src={PngEther} width={15} height={16} alt="chain  logo" /></div>
                      <div className="flex justify-start items-center"><h1 className="mr-3 font-semibold">Last Sale: <span className="font-normal">42</span></h1><Image src={PngEther} width={15} height={16} alt="chain logo" /></div>
                      <div className="flex justify-end items-center">
                        { order && owner && address && owner.toLowerCase() != address.toLowerCase() && 
                          <button className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD]">buy</button>
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
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='items'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F6F8FC] text-[#6C757D]'}`} onClick={()=>setCurrentTab('items')}>properties</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='activity'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F6F8FC] text-[#6C757D]'}`} onClick={()=>setCurrentTab('activity')}>activity</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='stats'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F6F8FC] text-[#6C757D]'}`} onClick={()=>setCurrentTab('stats')}>info</li>
                  <li className={`select-none inline-block border-x-2 border-t-2 border-zince-800 text-xl px-10 py-2 rounded-t-lg ${currentTab==='stats'?'bg-[#E9ECEF] text-[#1E1C21]':'bg-[#F6F8FC] text-[#6C757D]'}`} onClick={()=>setCurrentTab('stats')}>stats</li>
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