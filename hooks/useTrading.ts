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
  onAcceptConfirm: (bid_order: IOrder, tokenId: string) => Promise<any>,
  onAcceptComplete: (bid_order: IOrder) => Promise<void>,
  onAcceptDone: () => void
}

export const useTrading = (data?: TradingInput): TradingFunction => {
  const { addTxToHistories } = useProgress()
  const { listenONFTEvents } = useContract()
  const { switchNetworkAsync } = useSwitchedNetwork()
  const { provider, signer, address, chainId } = useWallet()
  const dispatch = useDispatch()

  if (!data) {
    return {
      onListingApprove: async() => {},
      onListingConfirm: async() => {},
      onListingDone: () => {},
      onBuyApprove: async() => {},
      onBuyConfirm: async() => {},
      onBuyComplete: async() => {},
      onBuyDone: () => {},
      onBidApprove: async() => {},
      onBidConfirm: async() => {},
      onBidDone: () => {},
      onAcceptApprove: async() => {},
      onAcceptConfirm: async() => {},
      onAcceptComplete: async() => {},
      onAcceptDone: () => {}
    }
  }

  const collection_address = useMemo(() => {
    if (data.collectionAddressMap && chainId) return data.collectionAddressMap[chainId]
    return undefined
  }, [data.collectionAddressMap, chainId])

  const getCommonData = () => ({
    provider,
    signer,
    address,
    chainId,
    tokenId: data.tokenId,
    collectionUrl: data.collectionUrl,
    collectionAddress: collection_address,
    selectedNFTItem: data.selectedNFTItem,
    onRefresh: data.onRefresh
  })
  const getSpecialData = () => ({
    dispatch,
    switchNetworkAsync,
    addTxToHistories,
    listenONFTEvents
  })

  // listing
  const onListingApprove = (check_network: boolean) => {
    return doListingApprove(check_network, getCommonData(), getSpecialData())
  }
  const onListingConfirm = (listing_data: IListingData) => {
    return doListingConfirm(listing_data, getCommonData())
  }
  const onListingDone = () => {
    return doListingDone(getCommonData())
  }
  // buy
  const onBuyApprove = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyApprove(order, getCommonData(), getSpecialData())
  }
  const onBuyConfirm = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyConfirm(order, getCommonData(), getSpecialData())
  }
  const onBuyComplete = (order?: IOrder) => {
    if (!order) throw new Error('Not listed')
    return doBuyComplete(order, getCommonData())
  }
  const onBuyDone = () => {
    return doBuyDone(getCommonData())
  }
  // bid
  const onBidApprove = (bid_data: IBidData) => {
    return doBidApprove(bid_data, getCommonData(), getSpecialData())
  }
  const onBidConfirm = (bid_data: IBidData) => {
    return doBidConfirm(bid_data, getCommonData())
  }
  const onBidDone = () => {
    return doBidDone(getCommonData())
  }
  // accept
  const onAcceptApprove = (check_network: boolean) => {
    return doAcceptApprove(check_network, getCommonData(), getSpecialData())
  }
  const onAcceptConfirm = (bid_order: IOrder) => {
    return doAcceptConfirm(bid_order, getCommonData(), getSpecialData())
  }
  const onAcceptComplete = (bid_order: IOrder) => {
    return doAcceptComplete(bid_order, getCommonData())
  }
  const onAcceptDone = () => {
    return doAcceptDone(getCommonData())
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