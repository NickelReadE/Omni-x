import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { doAcceptApprove, doAcceptComplete, doAcceptConfirm, doAcceptDone, doBidApprove, doBidConfirm, doBidDone, doBuyApprove, doBuyComplete, doBuyConfirm, doBuyDone, doListingApprove, doListingConfirm, doListingDone, TradingCommonData, TradingSpecialData } from '../components/providers/TradingProvider'
import { IBidData, IListingData, IOrder, NFTItem } from '../interface/interface'
import useContract from './useContract'
import useProgress from './useProgress'
import { useSwitchedNetwork } from './useSwitchedNetwork'
import useWallet from './useWallet'

export type TradingInput = {
  collectionUrl?: string,  // col_url
  collectionAddressMap?: {[chainId: number]: string},
  tokenId?: string,
  selectedNFTItem?: NFTItem,
  onRefresh: () => void
}

type TradingFunction = {
  onListingApprove: (check_network: boolean) => Promise<any>,
  onListingConfirm: (listing_data: IListingData) => Promise<any>,
  onListingDone: () => void,
  onBuyApprove: (order?: IOrder) => Promise<any>,
  onBuyConfirm: (order?: IOrder) => Promise<any>,
  onBuyComplete: (order?: IOrder) => Promise<void>,
  onBuyDone: () => void,
  onBidApprove: (bid_data: IBidData) => Promise<any>,
  onBidConfirm: (bid_data: IBidData) => Promise<void>,
  onBidDone: () => void,
  onAcceptApprove: (check_network: boolean) => Promise<any>,
  onAcceptConfirm: (bid_order: IOrder) => Promise<any>,
  onAcceptComplete: (bid_order: IOrder) => Promise<void>,
  onAcceptDone: () => void
}

export const useTrading = (data: TradingInput): TradingFunction => {
  const { addTxToHistories } = useProgress()
  const { listenONFTEvents } = useContract()
  const { switchNetworkAsync } = useSwitchedNetwork()
  const { provider, signer, address, chainId } = useWallet()
  const dispatch = useDispatch()

  const collection_address = useMemo(() => {
    if (data.collectionAddressMap && chainId) return data.collectionAddressMap[chainId]
    return undefined
  }, [data.collectionAddressMap, chainId])

  const common_data: TradingCommonData = {
    provider,
    signer,
    address,
    chainId,
    tokenId: data.tokenId,
    collectionUrl: data.collectionUrl,
    collectionAddress: collection_address,
    selectedNFTItem: data.selectedNFTItem,
    onRefresh: data.onRefresh
  }
  const special_data: TradingSpecialData = {
    dispatch,
    switchNetworkAsync,
    addTxToHistories,
    listenONFTEvents
  }

  // listing
  const onListingApprove = (check_network: boolean) => {
    return doListingApprove(check_network, common_data, special_data)
  }
  const onListingConfirm = (listing_data: IListingData) => {
    return doListingConfirm(listing_data, common_data)
  }
  const onListingDone = () => {
    return doListingDone(common_data)
  }
  // buy
  const onBuyApprove = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyApprove(order, common_data, special_data)
  }
  const onBuyConfirm = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyConfirm(order, common_data, special_data)
  }
  const onBuyComplete = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyComplete(order, common_data)
  }
  const onBuyDone = () => {
    return doBuyDone(common_data)
  }
  // bid
  const onBidApprove = (bid_data: IBidData) => {
    return doBidApprove(bid_data, common_data, special_data)
  }
  const onBidConfirm = (bid_data: IBidData) => {
    return doBidConfirm(bid_data, common_data)
  }
  const onBidDone = () => {
    return doBidDone(common_data)
  }
  // accept
  const onAcceptApprove = (check_network: boolean) => {
    return doAcceptApprove(check_network, common_data, special_data)
  }
  const onAcceptConfirm = (bid_order: IOrder) => {
    return doAcceptConfirm(bid_order, common_data, special_data)
  }
  const onAcceptComplete = (bid_order: IOrder) => {
    return doAcceptComplete(bid_order, common_data)
  }
  const onAcceptDone = () => {
    return doAcceptDone(common_data)
  }

  return {
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
    onAcceptDone
  }
}

export default useTrading