/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {useDispatch} from 'react-redux'
import useWallet from '../../../hooks/useWallet'
import {
  getBlockExplorer,
  getChainIconById,
  getCurrencyIconByAddress,
  getDarkChainIconById,
  numberLocalize
} from '../../../utils/constants'
import useOrderStatics from '../../../hooks/useOrderStatics'
import useCollectionNft from '../../../hooks/useCollectionNft'
import { useModal } from '../../../hooks/useModal'
import { ModalIDs } from '../../../contexts/modal'
import {truncateAddress} from '../../../utils/utils'
import { openSnackBar } from '../../../redux/reducers/snackBarReducer'
import {GradientButton} from '../../../components/basic'
import ShareIcon from '../../../public/images/icons/share.svg'
import BridgeIcon from '../../../public/images/icons/bluegreen_linear.svg'
import Accordion from '../../../components/collections/Accordion'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [bidHover, setBidHover] = useState<number | undefined>(undefined)

  const { address, chainId, chainName } = useWallet()
  const router = useRouter()
  const dispatch = useDispatch()
  const col_url = router.query.collection as string
  const token_id = router.query.item as string

  const { nft: currentNFT, collection, refreshNft } = useCollectionNft(col_url, token_id)

  const onRefresh = () => {
    refreshNft()
  }

  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
  }

  const collection_address_map = useMemo(() => {
    if (collection) {
      return collection.address
    }
  }, [collection])

  const item_contract_address = useMemo(() => {
    if (chainId && collection && collection.address) {
      return truncateAddress(collection.address[chainId])
    }
  }, [collection, chainId])

  const contract_explore_url = useMemo(() => {
    if (chainId && collection && collection.address) {
      const explorerLink = getBlockExplorer(chainId)
      return explorerLink ? `${explorerLink}/address/${collection.address[chainId]}` : ''
    }
  }, [chainId, collection])

  // statistics hook
  const {
    // order,
    // isListed,
    sortedBids,
    // highestBid,
    // highestBidCoin,
    lastSale,
    lastSaleCoin
  } = useOrderStatics({
    nft: currentNFT,
    collection
  })

  const { openModal, closeModal } = useModal()

  const tradingInput = {
    collectionUrl: col_url,
    collectionAddressMap: collection_address_map,
    tokenId: token_id,
    selectedNFTItem: currentNFT,
    onRefresh
  }

  // const currencyIcon = getCurrencyIconByAddress(currentNFT?.currency)
  // const formattedPrice = currentNFT?.price
  const chainIcon = useMemo(() => {
    return getChainIconById(currentNFT && currentNFT.chain_id ? currentNFT.chain_id.toString() : '5')
  }, [currentNFT])

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
    dispatch(openSnackBar({ message: 'copied link to clipboard', status: 'info' }))
  }

  const nftImage = useMemo(() => {
    if (currentNFT && currentNFT.image) {
      return currentNFT.image
    }
    return '/images/omnix_logo_black_1.png'
  }, [currentNFT])

  return (
    <>
      {currentNFT && collection &&
        <div className="w-full py-8">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-2 2xl:gap-12 lg:gap-1 xl:gap-4">
              <div className="col-span-1 h-full">
                <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>}>
                  <img
                    className='rounded-lg'
                    src={imageError ? '/images/omnix_logo_black_1.png' : nftImage}
                    alt="nft-image"
                    onError={() => { setImageError(true) }}
                    data-src={nftImage}
                  />
                </LazyLoad>

                <div className="mt-10">
                  <div className="text-xl font-medium text-center text-secondary">
                    <ul className="flex flex-wrap -mb-px">
                      <li onClick={() => setSelectedTab(0)}>
                        <div className={`${activeClasses(0)} pb-[2px] cursor-pointer`}>
                          <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                            <span className={`${activeTextClasses(0)}`}>bids</span>
                          </div>
                        </div>
                      </li>
                      <li onClick={() => setSelectedTab(1)}>
                        <div className={`${activeClasses(1)} pb-[2px] cursor-pointer`}>
                          <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                            <span className={`${activeTextClasses(1)}`}>history</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="py-4">
                    {
                      selectedTab === 0 &&
                        <div className={'w-full grid grid-cols-5'}>
                          <div className='col-span-1 text-secondary underline'>
                            account
                          </div>
                          <div className='col-span-1'/>
                          <div className='col-span-1 text-secondary text-center underline'>
                            chain
                          </div>
                          <div className='col-span-1'/>
                          <div className='col-span-1 text-secondary underline'>
                            bid
                          </div>
                        </div>
                    }
                    {
                      selectedTab === 0 &&
                      sortedBids?.map((item: any, index: number) => {
                        return (
                          <div key={index} onMouseEnter={() => setBidHover(index)} onMouseLeave={() => setBidHover(undefined)}>
                            <div className={'w-full grid grid-cols-5'}>
                              <div className='col-span-1 break-all mt-3 text-lg font-bold text-secondary'>{truncateAddress(item.signer)}</div>
                              <div className='col-span-1' />
                              <div className="col-span-1 flex justify-center mt-3">
                                <img
                                  src={getDarkChainIconById(item.chain_id.toString())}
                                  className='w-[21px]'
                                  alt="icon"
                                />
                              </div>
                              <div className='col-span-1 mt-3'>
                                {currentNFT?.owner?.toLowerCase() == address?.toLowerCase() && bidHover === index &&
                                  <div className={'w-[68px]'}>
                                    <GradientButton
                                      title={'accept'}
                                      height={22}
                                      borderRadius={50}
                                      textSize={'text-md font-bold'}
                                      onClick={() => {
                                        openModal(ModalIDs.MODAL_ACCEPT, {
                                          nftImage: currentNFT.image,
                                          nftTitle: currentNFT.name,
                                          nftTokenId: currentNFT?.token_id,
                                          collectionName: collection.name,
                                          bidOrder: item.order_data,
                                          tradingInput,
                                          handleAcceptDlgClose: closeModal
                                        })
                                      }}
                                    />
                                  </div>
                                }
                              </div>
                              <div className='col-span-1 mt-3 flex items-center'>
                                <img
                                  src={getCurrencyIconByAddress(item.currency)}
                                  width={21}
                                  height={21}
                                  alt="icon"
                                  className="mr-5"
                                />
                                <p className='ml-3 text-primary-light'>${item && item.price}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                    {/*<div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                    {
                        currentNFT && currentNFT.attributes && Object.entries(currentNFT.attributes).map((item: any, idx: number) => {
                          const attrs = collection.attrs
                          const attr = attrs[item[0]].values
                          const trait = attr[(item[1] as string)]
                          return <div className="px-5 py-2 bg-[#b444f926] border-2 border-[#B444F9] rounded-lg" key={idx}>
                            <p className="text-[#B444F9] text-sm font-bold">{item[0]}</p>
                            <div className="flex justify-start items-center mt-2">
                              <p className="text-[#1E1C21] text-xg font-bold">{item[1]}<span className="ml-3 font-normal">[{trait ? trait[1] : 0}%]</span></p>
                            </div>
                          </div>
                        })
                    }
                    </div>*/}
                  </div>
                </div>
              </div>
              <div className={'col-span-1'}>
                <div className={'flex justify-between items-center'}>
                  <div className={'text-primary-light text-xxl font-bold'}>{currentNFT.token_id}</div>
                  {/*icon group*/}
                  <div className={'flex items-center space-x-3'}>
                    <div className={'w-6 h-6 cursor-pointer'}>
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24.6874 2.82871L24.6877 2.82905C25.2675 3.40853 25.7274 4.09656 26.0412 4.85384C26.3549 5.61111 26.5164 6.42279 26.5164 7.24249C26.5164 8.06219 26.3549 8.87387 26.0412 9.63114C25.7274 10.3884 25.2675 11.0765 24.6877 11.6559L24.6876 11.6561L23.2922 13.0515L13.7579 22.5858L4.22354 13.0515L2.82818 11.6561C1.65761 10.4855 1 8.89791 1 7.24249C1 5.58707 1.65761 3.99944 2.82818 2.82888C3.99874 1.65832 5.58636 1.0007 7.24179 1.0007C8.89721 1.0007 10.4848 1.65832 11.6554 2.82888L13.0508 4.22424C13.4413 4.61477 14.0744 4.61477 14.465 4.22424L15.8603 2.82888L15.8605 2.82872C16.44 2.24896 17.128 1.78906 17.8853 1.47528C18.6426 1.1615 19.4542 1 20.2739 1C21.0937 1 21.9053 1.1615 22.6626 1.47528C23.4199 1.78906 24.1079 2.24896 24.6874 2.82871Z" stroke="url(#paint0_linear_11_3106)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                          <linearGradient id="paint0_linear_11_3106" x1="5.15933" y1="-9.31788e-07" x2="28.2631" y2="6.39731" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FA16FF"/>
                            <stop offset="1" stopColor="#F00056"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className={'w-6 h-6 cursor-pointer'}>
                      <BridgeIcon />
                    </div>
                    <div className={'w-6 h-6 cursor-pointer'} onClick={onCopyToClipboard}>
                      <ShareIcon />
                    </div>
                  </div>
                </div>

                {/*collection name*/}
                <div className={'flex flex-col mt-4'}>
                  <div className={'text-secondary text-lg'}>collection</div>
                  <div className={'text-primary-light text-lg mt-2'}>{collection.name}</div>
                </div>

                {/*creator*/}
                <div className={'flex flex-col mt-4'}>
                  <div className={'text-secondary text-lg'}>creator</div>
                  <div className={'text-primary-light text-lg mt-2'}>@{collection.name.toLowerCase()}</div>
                </div>

                {/*collector*/}
                <div className={'flex flex-col mt-4'}>
                  <div className={'text-secondary text-lg'}>collector</div>
                  <div className={'text-primary-light text-lg mt-2'}>{truncateAddress(currentNFT.owner)}</div>
                </div>

                {/*current price*/}
                <div className={'flex flex-col mt-4 border-[1px] rounded-lg w-full border-[#383838] pt-3 pb-6 px-6'}>
                  <div className={'flex items-center justify-between'}>
                    <div className={'text-secondary text-xl'}>current price</div>
                    <div className={'flex items-center'}>
                      <div className={'text-primary-blue text-xxxl'}>{currentNFT.price}</div>
                      <img alt='chainIcon' src={chainIcon} className="ml-2 w-[32px] h-[32px]" />
                    </div>
                  </div>
                  <div className={'flex items-center justify-around mt-5'}>
                    <div className={'w-[107px] h-8 flex rounded-full border-[1px] border-secondary items-center justify-center text-secondary text-md'}>
                      place bid
                    </div>
                    <div className={'w-[107px]'}>
                      <GradientButton title={'buy now'} height={32} borderRadius={50} textSize={'tex-md font-bold'} />
                    </div>
                  </div>
                </div>

                {/*last sale*/}
                {
                  lastSale !== 0 &&
                    <div className={'flex flex-col mt-4 border-[1px] rounded-lg w-full border-[#383838] py-3 px-6'}>
                      <div className={'flex items-center justify-between'}>
                        <div className={'text-secondary text-xl'}>last sale</div>
                        <div className={'flex items-center'}>
                          <div className={'text-primary-blue text-xxxl'}>{numberLocalize(Number(lastSale))}</div>
                          <img alt='chainIcon' src={lastSaleCoin} className="ml-2 w-[32px] h-[32px]" />
                        </div>
                      </div>
                    </div>
                }

                {/*details*/}
                <Accordion title={'details'}>
                  <div className={'px-4 flex items-center justify-between'}>
                    <span className={'text-primary-light'}>Contract address</span>
                    <span className={'text-primary-green'}>
                      <a href={contract_explore_url} target="_blank" rel="noreferrer">
                        {item_contract_address}
                      </a>
                    </span>
                  </div>
                  <div className={'px-4 mt-2 flex items-center justify-between'}>
                    <span className={'text-primary-light'}>Token ID</span>
                    <span className={'text-primary-light'}>{token_id}</span>
                  </div>
                  <div className={'px-4 mt-2 flex items-center justify-between'}>
                    <span className={'text-primary-light'}>Token Standard</span>
                    <span className={'text-primary-light'}>ERC721</span>
                  </div>
                  <div className={'px-4 mt-2 flex items-center justify-between'}>
                    <span className={'text-primary-light'}>Chain</span>
                    <span className={'text-primary-light'}>{chainName}</span>
                  </div>
                </Accordion>

                {/*attributes*/}
                <Accordion title={'attributes'}>
                  <div className="w-full">
                    {
                      currentNFT && currentNFT.attributes && Object.entries(currentNFT.attributes).map((item: any, idx: number) => {
                        const attrs = collection.attrs
                        const attr = attrs[item[0]].values
                        const trait = attr[(item[1] as string)]
                        return <div className="px-5 py-2 rounded-lg" key={idx}>
                          <p className="text-primary-green text-sm font-bold">{item[0]}</p>
                          <div className="flex justify-start items-center mt-2">
                            <p className="text-primary-light text-xg font-bold">{item[1]}<span className="ml-3 font-normal">[{trait ? trait[1] : 0}%]</span></p>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </Accordion>
              </div>
              {/*<div className="col-span-1">
                <div className="px-6 py-3 bg-[#F6F8FC]">
                  <div className='flex items-center'>
                    <h1 className="text-[#1E1C21] text-[32px] font-extrabold mr-8">{collection.name}</h1>
                    <div className='h-[22px]'><Image src={PngCheck} alt="checkpng"/></div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <div className="flex items-center">
                      <h1 className="text-[#1E1C21] text-xg1 font-medium">{currentNFT.token_id}</h1>
                      <img alt='chainIcon' src={chainIcon} className="ml-4 w-[32px] h-[32px]" />
                    </div>
                    <button>
                      <Image src={PngSub} alt="shareButton" onClick={onCopyToClipboard} />
                    </button>
                  </div>
                </div>
                <div className="grid 2xl:grid-cols-3 lg:grid-cols-[200px_1fr_1fr] xl:grid-cols-[230px_1fr_1fr] px-6 pt-3 mt-6 bg-[#F6F8FC] rounded-[2px]">
                  <div className="">
                    <div className="flex justify-start items-center">
                      <h1 className="text-[#1E1C21] text-xg font-bold">owner:</h1>
                      {currentNFT && currentNFT.owner && (
                        <h1 className="flex justify-start items-center text-[#B444F9] text-xl font-normal underline ml-4 break-all lg:ml-1">
                          <Link href={`/user/${currentNFT.owner}`}>
                            {truncateAddress(currentNFT.owner)}
                          </Link>
                        </h1>
                      )}
                      <span className="relative group">
                        <span
                          className={[
                            'whitespace-nowrap',
                            'rounded',
                            'bg-black',
                            'px-2',
                            'py-1',
                            'text-white',
                            'absolute',
                            '-top-12',
                            'left-1/2',
                            '-translate-x-1/2',
                            "before:content-['']",
                            'before:absolute',
                            'before:-translate-x-1/2',
                            'before:left-1/2',
                            'before:top-full',
                            'before:border-4',
                            'before:border-transparent',
                            'before:border-t-black',
                            'opacity-0',
                            'group-hover:opacity-100',
                            'transition',
                            'pointer-events-none',
                          ].join(' ')}
                        >
                          Send a direct message to owner via Blockscan Chat
                        </span>
                        <a href={`https://chat.blockscan.com/index?a=${currentNFT.owner}`} target="_blank" rel="noreferrer">
                          <div className='w-[24px] h-[24px] ml-2 cursor-pointer'>
                            <svg viewBox="0 0 32 32" focusable="false" className="chakra-icon css-1sdtgly" aria-hidden="true">
                              <path d="M24 10H8V12H24V10Z" fill="#000"></path>
                              <path d="M18 16H8V18H18V16Z" fill="#000"></path>
                              <path fillRule="evenodd" clipRule="evenodd" d="M17.74 30L21.16 24H26C28.2091 24 30 22.2091 30 20V8C30 5.79086 28.2091 4 26 4H6C3.79086 4 2 5.79086 2 8V20C2 22.2091 3.79086 24 6 24H14V30H17.74ZM16 28V22H6C4.89543 22 4 21.1046 4 20V8C4 6.89543 4.89543 6 6 6H26C27.1046 6 28 6.89543 28 8V20C28 21.1046 27.1046 22 26 22H20L16.5714 28H16Z" fill="#000"></path>
                            </svg>
                          </div>
                        </a>
                      </span>
                    </div>
                    <div className="mt-6">
                      {currentNFT && currentNFT.price > 0 && (
                        <>
                          <div className="relative group flex justify-between items-center max-w-[100%]">
                            <span
                              className={[
                                'whitespace-nowrap',
                                'rounded',
                                'bg-black',
                                'px-2',
                                'py-1',
                                'text-white',
                                'absolute',
                                '-top-12',
                                'left-1/2',
                                '-translate-x-1/2',
                                "before:content-['']",
                                'before:absolute',
                                'before:-translate-x-1/2',
                                'before:left-1/2',
                                'before:top-full',
                                'before:border-4',
                                'before:border-transparent',
                                'before:border-t-black',
                                'opacity-0',
                                'group-hover:opacity-100',
                                'transition',
                                'pointer-events-none',
                              ].join(' ')}
                            >
                              {numberLocalize(Number(formattedPrice))}
                            </span>
                            <h1 className="overflow-hidden text-ellipsis text-[#1E1C21] text-[60px] font-normal">
                              {numberLocalize(Number(formattedPrice))}
                            </h1>
                            <div className="mr-5 w-[30px]">
                              {currencyIcon &&
                                <img
                                  src={`${currencyIcon}`}
                                  className='mr-[8px] w-[21px]'
                                  alt="icon"
                                />
                              }
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className='font-normal font-[16px]'>
                        {formattedPrice && formattedPrice > 0 ? `$${numberLocalize(Number(formattedPrice))}` : ''}
                      </span>
                      <div className="flex justify-start items-center mt-5">
                        <h1 className="mr-3 font-bold">
                          Highest Bid: <span className="font-bold">{highestBid != 0 && numberLocalize(Number(highestBid))}</span>
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
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD] h-[250px] overflow-y-auto'>
                    <div className="overflow-x-hidden overflow-y-auto grid 2xl:grid-cols-[30%_25%_25%_20%] lg:grid-cols-[30%_18%_32%_20%] xl:grid-cols-[30%_18%_32%_20%]">
                      <div className="font-bold text-xg text-[#000000]">account</div>
                      <div className="font-bold text-xg text-[#000000]">chain</div>
                      <div className="font-bold text-xg text-[#000000]">bid</div>
                      <div></div>
                      {
                        sortedBids?.map((item: any, index: number) => {
                          return (
                            <Fragment key={index}>
                              <div className='flex justify-start items-center break-all mt-3 text-lg font-bold'>{truncateAddress(item.signer)}</div>
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
                                {currentNFT?.owner?.toLowerCase() == address?.toLowerCase() &&
                                  <button className='bg-[#ADB5BD] hover:bg-[#38B000] rounded-[4px] text-md text-[#fff] py-px px-2.5'
                                    onClick={() => {
                                      openModal(ModalIDs.MODAL_ACCEPT, {
                                        nftImage: currentNFT.image,
                                        nftTitle: currentNFT.name,
                                        bidOrder: item.order_data,
                                        tradingInput,
                                        handleAcceptDlgClose: closeModal
                                      })
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
                          isListed && currentNFT?.owner?.toLowerCase() != address?.toLowerCase() &&
                            <button
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-xg rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                              onClick={() => {setOpenBuyDlg(true)}}
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                              onClick={() => {
                                openModal(ModalIDs.MODAL_BUY, {
                                  nftImage: currentNFT.image,
                                  nftTitle: currentNFT.name,
                                  order,
                                  tradingInput,
                                  handleBuyDlgClose: closeModal
                                })
                              }}
                            >
                              buy
                            </button>
                        }
                        {
                          currentNFT?.owner?.toLowerCase() == address?.toLowerCase() &&
                            <button
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-xg rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]"
                              onClick={() => {setOpenSellDlg(true)}}
                              className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#B00000] hover:border-[#B00000]"
                              onClick={() => {
                                openModal(ModalIDs.MODAL_LISTING, {
                                  nftImage: currentNFT.image,
                                  nftTitle: currentNFT.name,
                                  tradingInput,
                                  handleSellDlgClose: closeModal
                                })
                              }}
                            >
                              sell
                            </button>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='2xl:pl-[58px] lg:pl-[10px] xl:pl-[30px] col-span-2 border-l-[1px] border-[#ADB5BD]'>
                    {
                      currentNFT?.owner && address && currentNFT?.owner.toLowerCase() != address.toLowerCase() &&
                        <button
                          className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-xg rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                          onClick={() => { setOpenBidDlg(true) }}
                          className="w-[95px] h-[35px] mt-6 mr-5 px-5 bg-[#ADB5BD] text-[#FFFFFF] font-['Circular   Std'] font-semibold text-[18px] rounded-[4px] border-2 border-[#ADB5BD] hover:bg-[#38B000] hover:border-[#38B000]"
                          onClick={() => {
                            openModal(ModalIDs.MODAL_BID, {
                              nftImage: currentNFT.image,
                              nftTitle: currentNFT.name,
                              tradingInput,
                              handleBidDlgClose: closeModal
                            })
                          }}
                        >
                          bid
                        </button>
                    }
                  </div>
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Item
