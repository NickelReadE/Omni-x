/* eslint-disable react-hooks/exhaustive-deps */
import { useState, Fragment, useMemo } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import ConfirmSell from '../../../components/collections/ConfirmSell'
import ConfirmBid from '../../../components/collections/ConfirmBid'
import useWallet from '../../../hooks/useWallet'
import useTrading from '../../../hooks/useTrading'
import { getChainIconById, getChainNameFromId, getCurrencyIconByAddress, numberLocalize } from '../../../utils/constants'
import PngCheck from '../../../public/images/check.png'
import PngSub from '../../../public/images/subButton.png'
import useOrderStatics from '../../../hooks/useOrderStatics'
import useOwnership from '../../../hooks/useOwnership'
import ConfirmBuy from '../../../components/collections/ConfirmBuy'
import ConfirmAccept from '../../../components/collections/ConfirmAccept'
import useCollectionNft from '../../../hooks/useCollectionNft'
import {truncateAddress} from '../../../utils/utils'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [currentTab, setCurrentTab] = useState<string>('items')

  const {
    provider,
    address,
    signer
  } = useWallet()
  const router = useRouter()
  const col_url = router.query.collection as string
  const token_id = router.query.item as string
  const { nft, collection, refreshNft } = useCollectionNft(col_url, token_id)

  const collection_address_map = useMemo(() => {
    if (collection) {
      return collection.address
    }
  }, [collection])
  const currentNFT = useMemo(() => {
    if (nft) {
      return nft
    }
  }, [nft])
  const collection_address = useMemo(() => {
    if (currentNFT && currentNFT.collection_address) {
      return currentNFT.collection_address
    }
  }, [currentNFT])
  const chain_id = useMemo(() => {
    if (currentNFT && currentNFT.chain_id) {
      return currentNFT.chain_id
    }
  }, [currentNFT])
  const sortedBids = useMemo(() => {
    if (currentNFT && currentNFT.bidDatas) {
      const bids = JSON.parse(JSON.stringify(currentNFT.bidDatas))
      return bids.sort((a: any, b: any) => {
        if (a.price && b.price) {
          if (a.price === b.price) return 0
          return a.price > b.price ? -1 : 1
        }
        return 0
      })
    }
    return []
  }, [currentNFT])
  const highestBid = useMemo(() => {
    if (sortedBids.length > 0) {
      return sortedBids[0].price
    }
    return 0
  }, [sortedBids])
  const highestBidCoin = useMemo(() => {
    if (sortedBids.length > 0 && sortedBids[0].currency) {
      return getCurrencyIconByAddress(sortedBids[0].currency)
    }
  }, [sortedBids])
  const lastSaleCoin = useMemo(() => {
    if (currentNFT && currentNFT.last_sale_currency) {
      return getCurrencyIconByAddress(currentNFT.last_sale_currency)
    }
    return null
  }, [currentNFT])

  // ownership hook
  const {
    owner,
    // profileLink,
  } = useOwnership({
    owner_address: currentNFT?.owner
  })

  // statistics hook
  const {
    order,
    orderChainId,
    isListed,
    isAuction,
  } = useOrderStatics({
    collection_address_map,
    isDetailPage: true
  })

  const order_collection_address = order?.collectionAddress
  const order_collection_chain = orderChainId && getChainNameFromId(orderChainId)

  // trading hook
  const {
    openBidDlg,
    openSellDlg,
    openBuyDlg,
    selectedBid,
    openAcceptDlg,
    setOpenBidDlg,
    setOpenSellDlg,
    setOpenBuyDlg,
    setOpenAcceptDlg,
    setSelectedBid,
    onListingApprove,
    onListingConfirm,
    onListingDone,
    onBuyApprove,
    onBuyConfirm,
    onBuyComplete,
    onBuyDone,
    onBidApprove,
    onBidConfirm,
    onBidDone,
    onAcceptApprove,
    onAcceptConfirm,
    onAcceptComplete,
    onAcceptDone,
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: col_url,
    collection_address,
    order_collection_address,
    order_collection_chain,
    owner: currentNFT?.owner,
    owner_collection_address: collection_address,
    owner_collection_chain: chain_id && getChainNameFromId(chain_id),
    owner_collection_chain_id: chain_id,
    token_id,
    selectedNFTItem: currentNFT
  })

  // profile link
  const currencyIcon = getCurrencyIconByAddress(currentNFT?.currency)
  const formattedPrice = currentNFT?.price
  const lastSale = currentNFT?.last_sale

  const onBidDoneAndRefresh = () => {
    onBidDone()
    refreshNft()
  }

  return (
    <>
      {currentNFT && collection &&
        <div className="w-full mt-40 pr-[70px] pb-[120px] font-[Retni_Sans]">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-3 2xl:gap-12 lg:gap-1 xl:gap-4">
              <div className="col-span-1 h-full">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>}>
                  <img
                    className='rounded-[8px]'
                    src={imageError ? '/images/omnix_logo_black_1.png' : currentNFT.image}
                    alt="nft-image"
                    onError={() => { setImageError(true) }}
                    data-src={currentNFT.image}
                  />
                </LazyLoad>
              </div>
              <div className="col-span-2">
                <div className="px-6 py-3 bg-[#F6F8FC]">
                  <div className='flex items-center'>
                    <h1 className="text-[#1E1C21] text-[32px] font-extrabold mr-8">{collection.name}</h1>
                    <div className='h-[22px]'><Image src={PngCheck} alt="checkpng"/></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <h1 className="text-[#1E1C21] text-[24px] font-medium">{currentNFT.token_id}</h1>
                    <Image src={PngSub} alt=""/>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pt-3 mt-6 bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="flex justify-start items-center">
                      <h1 className="text-[#1E1C21] text-[18px] font-bold">owner:</h1>
                      {currentNFT && currentNFT.owner && (
                        <h1 className="flex justify-start items-center text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={`/user/${currentNFT.owner}`}>
                            {truncateAddress(currentNFT.owner)}
                          </Link>
                        </h1>
                      )}
                      {/* {currentNFT?.owner && (
                        <h1 className="text-[#B444F9] text-[20px] font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={profileLink || '#'}>
                            <a target='_blank'>{truncateAddress(currentNFT?.owner)}</a>
                          </Link>
                        </h1>
                      )} */}

                    </div>
                    <div className="flex justify-between items-center mt-6">
                      {currentNFT && currentNFT.price > 0 && (
                        <>
                          <h1 className="text-[#1E1C21] text-[60px] font-normal">{numberLocalize(Number(formattedPrice))}</h1>
                          <div className="mr-5">
                            {currencyIcon &&
                              <img
                                src={`${currencyIcon}`}
                                className='mr-[8px] w-[21px]'
                                alt="icon"
                              />
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className='font-normal font-[16px]'>
                        {formattedPrice && formattedPrice > 0 ? '$' : ''}{numberLocalize(Number(formattedPrice))}
                      </span>
                      <div className="flex justify-start items-center mt-5">
                        <h1 className="mr-3 font-bold">
                          Highest Bid: <span className="font-bold">{numberLocalize(Number(highestBid))}</span>
                        </h1>
                        {highestBidCoin && <Image src={highestBidCoin} width={15} height={16} alt="chain  logo" />}
                      </div>
                      <div className="flex justify-start items-center">
                        <h1 className="mr-3 font-bold">
                          Last Sale: <span className="font-bold">{lastSale != 0 && numberLocalize(Number(lastSale))}</span>
                        </h1>
                        {lastSaleCoin && <Image src={lastSaleCoin} width={15} height={16} alt="chain logo" />}
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%] min-h-[210px] max-h-[210px]">
                      <div className="font-bold text-[18px] text-[#000000]">account</div>
                      <div className="font-bold text-[18px] text-[#000000]">chain</div>
                      <div className="font-bold text-[18px] text-[#000000]">bid</div>
                      <div></div>
                      {
                        sortedBids.map((item: any, index: number) => {
                          return (
                            <Fragment key={index}>
                              <div className='flex justify-start items-center break-all mt-3 text-[16px] font-bold'>{truncateAddress(item.signer)}</div>
                              <div className="flex justify-start items-center text-center mt-3">
                                <img
                                  src={getChainIconById(item.chain_id.toString())}
                                  className='mr-[8px] w-[21px]'
                                  alt="icon"
                                />
                              </div>
                              <div className='flex justify-start items-center mt-3'>
                                <img
                                  src={getCurrencyIconByAddress(item.currency)}
                                  width={21}
                                  height={21}
                                  alt="icon"
                                  className="mr-5"
                                />
                                <p className='ml-3'>${item && item.price}</p>
                              </div>
                              <div className='text-right mt-3'>
                                {owner?.toLowerCase() == address?.toLowerCase() &&
                                  <button className='bg-[#ADB5BD] hover:bg-[#38B000] rounded-[4px] text-[14px] text-[#fff] py-px px-2.5'
                                    onClick={() => {
                                      setSelectedBid(item)
                                      setOpenAcceptDlg(true)
                                    }}>
                                    accept
                                  </button>
                                }
                              </div>
                            </Fragment>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pb-3  bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="mb-3">
                      <div className="">
                        {
                          isListed && !isAuction && owner?.toLowerCase() != address?.toLowerCase() &&
                            <button
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                              onClick={() => {setOpenBuyDlg(true)}}
                            >
                              buy
                            </button>
                        }
                        {
                          owner?.toLowerCase() == address?.toLowerCase() &&
                            <button
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]"
                              onClick={() => {setOpenSellDlg(true)}}
                            >
                              sell
                            </button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    {
                      owner && address && owner.toLowerCase() != address.toLowerCase() &&
                        <button
                          className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                          onClick={() => { setOpenBidDlg(true) }}
                        >
                          bid
                        </button>
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
                      currentNFT && currentNFT.attributes && Object.entries(currentNFT.attributes).map((item: any, idx: number) => {
                        const attrs = collection.attrs
                        const attr = attrs[item[0]].values
                        const trait = attr[(item[1] as string)]
                        return <div className="px-5 py-2 bg-[#b444f926] border-2 border-[#B444F9] rounded-[8px]" key={idx}>
                          <p className="text-[#B444F9] text-[12px] font-bold">{item[0]}</p>
                          <div className="flex justify-start items-center mt-2">
                            <p className="text-[#1E1C21] text-[18px] font-bold">{item[1]}<span className="ml-3 font-normal">[{trait ? trait[1] : 0}%]</span></p>
                            <p className="ml-5 mr-3 text-[#1E1C21] text-[18px] ml-auto">{order && order.price && ethers.utils.formatEther(order.price)}</p>
                            {/*<Image src={PngEther} alt="" />*/}
                          </div>
                        </div>
                      })
                    }
                  </div>
                }
              </div>
            </div>
          </div>
          <ConfirmSell
            onListingApprove={onListingApprove}
            onListingConfirm={onListingConfirm}
            onListingDone={onListingDone}
            handleSellDlgClose={() => {setOpenSellDlg(false)}}
            openSellDlg={openSellDlg}
            nftImage={currentNFT.image}
            nftTitle={currentNFT.name}
          />
          <ConfirmBuy
            handleBuyDlgClose={() => {
              setOpenBuyDlg(false)
            }}
            openBuyDlg={openBuyDlg}
            nftImage={currentNFT.image}
            nftTitle={currentNFT.name}
            onBuyApprove={onBuyApprove}
            onBuyConfirm={onBuyConfirm}
            onBuyComplete={onBuyComplete}
            onBuyDone={onBuyDone}
            order={order}
          />
          <ConfirmBid
            onBidApprove={onBidApprove}
            onBidConfirm={onBidConfirm}
            onBidDone={onBidDoneAndRefresh}
            handleBidDlgClose={() => {setOpenBidDlg(false)}}
            openBidDlg={openBidDlg}
            nftImage={currentNFT.image}
            nftTitle={currentNFT.name}
          />
          <ConfirmAccept
            onAcceptApprove={onAcceptApprove}
            onAcceptConfirm={onAcceptConfirm}
            onAcceptComplete={onAcceptComplete}
            onAcceptDone={onAcceptDone}
            handleAcceptDlgClose={() => {setOpenAcceptDlg(false)}}
            openAcceptDlg={openAcceptDlg}
            nftImage={currentNFT.image}
            nftTitle={currentNFT.name}
            bidOrder={selectedBid}
          />
        </div>
      }
    </>
  )
}

export default Item
