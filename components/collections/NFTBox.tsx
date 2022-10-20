import React, {useMemo} from 'react'
import {useState} from 'react'
import Link from 'next/link'
import {IListingData, IPropsNFTItem} from '../../interface/interface'
import LazyLoad from 'react-lazyload'
import {
  getCurrencyIconByAddress,
  getChainIconById,
  getChainNameFromId,
  findCollection,
  getCurrencyNameAddress,
  formatCurrency,
  numberLocalize
} from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import ConfirmBid from './ConfirmBid'
import editStyle from '../../styles/nftbox.module.scss'
import classNames from '../../helpers/classNames'
import useTrading from '../../hooks/useTrading'
import useOrderStatics from '../../hooks/useOrderStatics'
import ConfirmSell from './ConfirmSell'
import {selectCollectionInfo} from '../../redux/reducers/collectionsReducer'
import {useSelector} from 'react-redux'
import ConfirmBuy from './ConfirmBuy'

const NFTBox = ({nft, col_url, onRefresh}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  const [isShowBtn, SetIsShowBtn] = useState(false)
  const {
    provider,
    signer,
    address
  } = useWallet()

  const collectionInfo = useSelector(selectCollectionInfo)
  const token_id = nft.token_id
  const collection = useMemo(() => {
    if (token_id && collectionInfo && collectionInfo.address) {
      return findCollection(collectionInfo.address, nft, token_id)
    }
    return undefined
  }, [nft, token_id, collectionInfo])
  const order = nft.order_data
  const col_address = collection?.[0] as string
  const chain = collection?.[1] as string
  //update this logic in the constants
  const collection_address_map = useMemo(() => {
    if (chain && col_address) {
      return {
        [chain]: col_address.toLowerCase()
      }
    }
    return []
  }, [chain, col_address])

  const {
    orderChainId,
    isAuction,
    highestBid,
    highestBidCoin,
  } = useOrderStatics({nft, collection_address_map})

  const order_collection_address = order?.collectionAddress
  const order_collection_chain = orderChainId && getChainNameFromId(orderChainId)

  const {
    openBidDlg,
    openSellDlg,
    openBuyDlg,
    setOpenBidDlg,
    setOpenSellDlg,
    setOpenBuyDlg,
    onListingApprove,
    onListingConfirm,
    onListingDone,
    onBuyApprove,
    onBuyConfirm,
    onBuyComplete,
    onBuyDone,
    onBid
  } = useTrading({
    provider,
    signer,
    address,
    collection_name: col_url,
    collection_address: col_address,
    collection_chain: getChainNameFromId(chain ? Number(chain) : 4),
    order_collection_address,
    order_collection_chain,
    owner: nft?.owner, // owner,
    owner_collection_address: nft.collection_address, // ownedCollectionAddress,
    owner_collection_chain: nft.chain, // ownerChainId && getChainNameFromId(ownerChainId),
    owner_collection_chain_id: nft.chain_id,
    token_id: nft?.token_id,
    selectedNFTItem: nft
  })

  const chainIcon = useMemo(() => {
    return getChainIconById(nft && nft.chain_id ? nft.chain_id.toString() : '5')
  }, [nft])
  const currencyIcon = getCurrencyIconByAddress(nft.currency)

  const isListed = useMemo(() => {
    return nft.price > 0
  }, [nft])

  const isOwner = useMemo(() => {
    if (nft && nft.owner && address) {
      return nft.owner.toLowerCase() === address?.toLowerCase()
    }
    return false
  }, [nft, address]) // owner?.toLowerCase() == address?.toLowerCase()

  const lastSale = useMemo(() => {
    return nft.last_sale
  }, [nft])

  const lastSaleCoinIcon = useMemo(() => {
    if (nft && nft.last_sale_currency) {
      return getCurrencyIconByAddress(nft.last_sale_currency)
    }
  }, [nft])

  const onListingDoneAndRefresh = async () => {
    await onListingDone()
    onRefresh()
  }

  return (
    <div
      className={classNames('w-full border-[2px] border-[#F6F8FC] rounded-[8px] cursor-pointer hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}
      onMouseEnter={() => SetIsShowBtn(true)} onMouseLeave={() => SetIsShowBtn(false)}>
      <Link href={`/collections/${col_url}/${nft.token_id}`}>
        <a>
          <div className="group relative flex justify-center text-center overflow-hidden rounded-md">
            <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image"/>}>
              <img
                className="collection-nft-image-item rounded-md object-cover ease-in-out duration-500 group-hover:scale-110"
                src={imageError || nft.image == null ? '/images/omnix_logo_black_1.png' : nft.image} alt="nft-image"
                onError={() => {
                  setImageError(true)
                }} data-src={nft.image}/>
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
                <img alt={'chainIcon1'} src={chainIcon} className="w-[16px] h-[16px]"/>
              </div>
            </div>
          </div>
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle font-['RetniSans']">
            <div className="flex items-center ml-3">
              {isListed && <>
                <img src={currencyIcon || '/svgs/ethereum.svg'} className="w-[18px] h-[18px]" alt="icon"/>
                <span
                  className="text-[#000000] text-[18px] font-extrabold ml-2">{numberLocalize(Number(nft?.price || 0))}</span>
              </>}
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle  font-['RetniSans']">
        <Link href={`/collections/${col_url}/${nft.token_id}`}>
          <a>
            <div className="flex items-center ml-3">
              {lastSale != 0 && <>
                <span className="text-[#6C757D] text-[14px] font-bold">last sale: &nbsp;</span>
                <img alt={'saleIcon'} src={lastSaleCoinIcon} className="w-[18px] h-[18px]"/>&nbsp;
                <span
                  className="text-[#6C757D] text-[14px]font-bold">{numberLocalize(Number(lastSale))}</span>
              </>}
              {!lastSale && highestBid != 0 && <>
                <span className="text-[#6C757D] text-[14px] font-bold">highest offer: &nbsp;</span>
                <img src={highestBidCoin} className="w-[18px] h-[18px]" alt="logo"/>&nbsp;
                <span
                  className="text-[#6C757D] text-[14px] font-bold">{numberLocalize(Number(highestBid))}</span>
              </>}
            </div>
          </a>
        </Link>
        <div className="flex items-center ml-3">
          <div>&nbsp;</div>
          {isShowBtn && isOwner && (
            <div
              className="ml-2 mr-2 py-[1px] px-4 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#B00000]"
              onClick={() => {
                setOpenSellDlg(true)
              }}>
              {'Sell'}
            </div>
          )}
          {isShowBtn && !isOwner && isListed && !isAuction && (
            <div
              className="ml-2 mr-2 py-[1px] px-4 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#38B000]"
              onClick={() => setOpenBuyDlg(true)}>
              {'Buy now'}
            </div>
          )}
          {isShowBtn && !isOwner && isListed && isAuction && (
            <div
              className="ml-2 mr-2 py-[1px] px-4 bg-[#A0B3CC] rounded-[10px] text-[14px] text-[#F8F9FA] font-blod  hover:bg-[#38B000]"
              onClick={() => setOpenBidDlg(true)}>
              {'Bid'}
            </div>
          )}
        </div>
      </div>

      <ConfirmSell
        handleSellDlgClose={() => {
          setOpenSellDlg(false)
        }}
        openSellDlg={openSellDlg}
        nftImage={nft.image}
        nftTitle={nft.name}
        onListingApprove={onListingApprove}
        onListingConfirm={onListingConfirm}
        onListingDone={onListingDoneAndRefresh}
      />
      <ConfirmBuy
        handleBuyDlgClose={() => {
          setOpenBuyDlg(false)
        }}
        openBuyDlg={openBuyDlg}
        nftImage={nft.image}
        nftTitle={nft.name}
        onBuyApprove={onBuyApprove}
        onBuyConfirm={onBuyConfirm}
        onBuyComplete={onBuyComplete}
        onBuyDone={onBuyDone}
        order={order}
      />
      <ConfirmBid
        onSubmit={(bidData: any) => onBid(bidData, order)}
        handleBidDlgClose={() => {
          setOpenBidDlg(false)
        }}
        openBidDlg={openBidDlg}
        nftImage={nft.image}
        nftTitle={nft.name}
      />
    </div>
  )
}

export default NFTBox
