/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react'
import LazyLoad from 'react-lazyload'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useWallet from '../../../hooks/useWallet'
import {
  getBlockExplorer,
  getCurrencyIconByAddress,
  getDarkChainIconById,
} from '../../../utils/constants'
import useOrderStatics from '../../../hooks/useOrderStatics'
import useCollectionNft from '../../../hooks/useCollectionNft'
import { useModal } from '../../../hooks/useModal'
import { ModalIDs } from '../../../contexts/modal'
import {truncateAddress} from '../../../utils/utils'
import Accordion from '../../../components/collections/Accordion'
import {PrimaryButton} from '../../../components/common/buttons/PrimaryButton'
import {getImageProperLink} from '../../../utils/helpers'
import Link from 'next/link'
import {formatDollarAmount} from '../../../utils/numbers'
import {SecondaryButton} from '../../../components/common/buttons/SecondaryButton'
import Image from 'next/image'
import {TextBodyemphasis} from '../../../components/common/Basic'

const Item: NextPage = () => {
  const [imageError, setImageError] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [bidHover, setBidHover] = useState<number | undefined>(undefined)

  const { address, chainId, chainName } = useWallet()
  const router = useRouter()
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
    sortedBids,
    // highestBid,
    // highestBidCoin,
    lastSale,
  } = useOrderStatics({
    nft: currentNFT,
    collection
  })

  const order = currentNFT?.order_data
  const { openModal, closeModal } = useModal()

  const tradingInput = {
    collectionUrl: col_url,
    collectionAddressMap: collection_address_map,
    tokenId: token_id,
    selectedNFTItem: currentNFT,
    onRefresh
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
                  <div className={'flex items-center space-x-4'}>
                    <div className={'flex items-center bg-[#202020] rounded-[20px] py-[5px] px-2 space-x-2'}>
                      <Image src={'/images/icons/heart.svg'} width={28} height={28} alt={'heart'} className={'cursor-pointer'} />
                      <TextBodyemphasis className={'text-primary-light'}>
                        {currentNFT.likes}
                      </TextBodyemphasis>
                    </div>
                    <div className={'flex items-center'}>
                      <Image src={'/images/icons/more.svg'} width={38} height={38} alt={'more'} className={'cursor-pointer'} />
                    </div>
                    {/*<div className={'w-6 h-6 cursor-pointer'}>
                      <BridgeIcon />
                    </div>
                    <div className={'w-6 h-6 cursor-pointer'} onClick={onCopyToClipboard}>
                      <ShareIcon />
                    </div>*/}
                  </div>
                </div>

                {/*collection name*/}
                <div className={'flex space-x-3 mt-4'}>
                  <div className={'text-secondary text-lg'}>collection</div>
                  <Link href={`/collections/${collection.col_url}`}>
                    <div className={'text-primary-light text-lg underline hover:text-blue-400 cursor-pointer'}>{collection.name}</div>
                  </Link>
                </div>

                {/*creator*/}
                <div className={'flex space-x-3 mt-4'}>
                  <div className={'text-secondary text-lg'}>creator</div>
                  <Link href={`/user/${collection.creator_address}`}>
                    <div className={'text-primary-light text-lg underline hover:text-blue-400 cursor-pointer'}>@{collection.creator_name}</div>
                  </Link>
                </div>

                {/*collector*/}
                <div className={'flex space-x-3 mt-4'}>
                  <div className={'text-secondary text-lg'}>collector</div>
                  <Link href={`/user/${currentNFT.owner}`}>
                    <div className={'text-primary-light text-lg underline hover:text-blue-400 cursor-pointer'}>{truncateAddress(currentNFT.owner)}</div>
                  </Link>
                </div>

                {/*current price*/}
                <div className={'flex flex-col mt-4 rounded-lg w-full bg-[#202020] p-3'}>
                  <div className={'flex items-center justify-between'}>
                    <div className={'text-secondary text-lg'}>price</div>
                  </div>
                  <div className={'flex items-center justify-between mt-3'}>
                    <div className={'text-primary-blue text-xxxl'}>{currentNFT.price > 0 ? formatDollarAmount(currentNFT.price) : '--'}</div>
                    <div className={'flex items-center space-x-4'}>
                      <SecondaryButton text={'buy'} className={'h-[30px]'} disabled={!currentNFT.price} onClick={() => {
                        openModal(ModalIDs.MODAL_BUY, {
                          nftImage: nftImage,
                          nftTitle: currentNFT.name,
                          nftTokenId: currentNFT.token_id,
                          order,
                          tradingInput,
                          handleBuyDlgClose: closeModal
                        })
                      }}/>
                      <PrimaryButton text={'place bid'} className={'h-[32px]'} onClick={() => {
                        openModal(ModalIDs.MODAL_BID, {
                          nftImage: nftImage,
                          nftTitle: currentNFT.name,
                          nftTokenId: currentNFT.token_id,
                          tradingInput,
                          handleBidDlgClose: closeModal
                        })
                      }}/>
                    </div>
                  </div>
                </div>

                {/*last sale*/}
                {
                  Number(lastSale) > 0 &&
                    <div className={'flex flex-col mt-4 rounded-lg w-full bg-[#202020] p-3'}>
                      <div className={'flex items-center justify-between'}>
                        <div className={'text-secondary text-lg'}>last sale</div>
                        <div className={'flex items-center'}>
                          <div className={'text-primary-light text-lg'}>{formatDollarAmount(Number(lastSale))}</div>
                          {/*<img alt='chainIcon' src={lastSaleCoin} className="ml-2 w-[32px] h-[32px]" />*/}
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
                      currentNFT && currentNFT.attributes && currentNFT.attributes.map((attribute: any, idx: number) => {
                        const attrs = collection.attrs
                        if (!attrs) return null

                        const trait = attrs[attribute.trait_type][attribute.value]
                        return <div className="px-5 py-2 rounded-lg" key={idx}>
                          <p className="text-primary-green text-sm font-bold">{attribute.trait_type}</p>
                          <div className="flex justify-start items-center mt-2">
                            <p className="text-primary-light text-xg font-bold">{attribute.value}<span className="ml-3 font-normal">[{trait ? trait[1] : 0}%]</span></p>
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
