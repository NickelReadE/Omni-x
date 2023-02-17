/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import {useDispatch} from 'react-redux'
import useWallet from '../../../hooks/useWallet'
import {
  getBlockExplorer,
  getChainLogoById,
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
import ShareIcon from '../../../public/images/icons/share.svg'
import BridgeIcon from '../../../public/images/icons/bluegreen_linear.svg'
import Accordion from '../../../components/collections/Accordion'
import {PrimaryButton} from '../../../components/common/buttons/PrimaryButton'
import {GreyButton} from '../../../components/common/buttons/GreyButton'
import {getImageProperLink} from '../../../utils/helpers'
import Link from 'next/link'

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
    order,
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
    return getChainLogoById(currentNFT && currentNFT.chain_id ? currentNFT.chain_id.toString() : '5')
  }, [currentNFT])

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)
    dispatch(openSnackBar({ message: 'copied link to clipboard', status: 'info' }))
  }

  const nftImage = useMemo(() => {
    if (currentNFT && currentNFT.image) {
      return getImageProperLink(currentNFT.image)
    }
    return '/images/omni-logo-mint-cropped.jpg'
  }, [currentNFT])

  return (
    <>
      {currentNFT && collection &&
        <div className="w-full py-8">
          <div className="w-full 2xl:px-[10%] xl:px-[5%] lg:px-[2%] md:px-[2%] ">
            <div className="grid grid-cols-2 2xl:gap-16 md:gap-12">
              <div className="col-span-1 h-full">
                <LazyLoad placeholder={<img src={'/images/omni-logo-mint-cropped.jpg'} alt="nft-image"/>}>
                  <img
                    className='rounded-lg'
                    src={imageError ? '/images/omni-logo-mint-cropped.jpg' : nftImage}
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
                              <Link href={`/user/${item.signer}`}>
                                <div className='col-span-1 break-all mt-3 text-lg font-bold text-secondary hover:text-blue-400 cursor-pointer'>{truncateAddress(item.signer)}</div>
                              </Link>
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
                                  <PrimaryButton
                                    text={'accept'}
                                    className={'h-[22px] text-md font-bold'}
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
                                <p className='ml-3 text-primary-light'>${item.price}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
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
                <div className={'flex flex-row mt-4'}>
                  <span className={'text-secondary text-lg'}>collection</span>
                  <Link href={`/collections/${collection.name.toLowerCase()}`}>
                    <span className={'text-primary-light text-lg ml-5 hover:underline cursor-pointer'}>{collection.name}</span>
                  </Link>
                </div>

                {/*creator*/}
                <div className={'flex flex-row mt-4'}>
                  <span className={'text-secondary text-lg'}>creator</span>
                  <Link href={`/user/${collection.creator_address}`}>
                    <span className={'text-primary-light text-lg ml-5 hover:underline cursor-pointer'}>@{collection.creator_name}</span>
                  </Link>
                </div>

                {/*collector*/}
                <div className={'flex flex-row mt-4'}>
                  <span className={'text-secondary text-lg'}>collector</span>
                  <Link href={`/user/${currentNFT.owner}`}>
                    <span className={'text-primary-light text-lg ml-5 hover:underline cursor-pointer'}>{truncateAddress(currentNFT.owner)}</span>
                  </Link>
                </div>

                {/*current price*/}
                <div className={'flex flex-col mt-4 border-[1px] rounded-lg w-full border-[#383838] pt-3 pb-6 px-6'}>
                  <div className={'flex items-center justify-between'}>
                    <div className={'text-secondary text-xl'}>current price</div>
                    <div className={'flex items-center'}>
                      <div className={'text-primary-blue text-xxxl'}>{currentNFT.price > 0 ? currentNFT.price : '--'}</div>
                      <img alt='chainIcon' src={chainIcon} className="ml-2 w-[32px] h-[32px]" />
                    </div>
                  </div>
                  <div className={'flex items-center justify-around mt-5'}>
                    <GreyButton text={'place bid'} className={'h-[32px]'} onClick={() => {
                      openModal(ModalIDs.MODAL_BID, {
                        nftImage: currentNFT.image,
                        nftTitle: currentNFT.name,
                        nftTokenId: currentNFT.token_id,
                        tradingInput,
                        handleBidDlgClose: closeModal
                      })
                    }}/>
                    <PrimaryButton text={'buy now'} className={'h-[30px]'} disabled={!currentNFT.price} onClick={() => {
                      openModal(ModalIDs.MODAL_BUY, {
                        nftImage: currentNFT.image,
                        nftTitle: currentNFT.name,
                        nftTokenId: currentNFT.token_id,
                        order,
                        tradingInput,
                        handleBuyDlgClose: closeModal
                      })
                    }}/>
                  </div>
                </div>

                {/*last sale*/}
                {
                  Number(lastSale) > 0 &&
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
                        if (!attrs) return null

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
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Item
