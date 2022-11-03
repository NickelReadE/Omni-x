import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { doAcceptApprove, doAcceptComplete, doAcceptConfirm, doAcceptDone, doBidApprove, doBidConfirm, doBidDone, doBuyApprove, doBuyComplete, doBuyConfirm, doBuyDone, doListingApprove, doListingConfirm, doListingDone, TradingCommonData, TradingSpecialData } from '../components/providers/TradingProvider'
import { IBidData, IListingData, IOrder, NFTItem } from '../interface/interface'
import useContract from './useContract'
import useProgress from './useProgress'
import { useSwitchedNetwork } from './useSwitchedNetwork'
import useWallet from './useWallet'

export type CollectionBidInput = {
  collectionUrl?: string,  // col_url
  collectionAddressMap?: {[chainId: number]: string},
  onRefresh?: () => void
}

type CollectionBidFunction = {
  onCollectionBidApprove: (bid_data: IBidData) => Promise<any>,
  onCollectionBidConfirm: (bid_data: IBidData) => Promise<void>,
  onCollectionBidDone: () => void,
}

export const useCollectionBid = (data: CollectionBidInput): CollectionBidFunction => {
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
    collectionUrl: data.collectionUrl,
    collectionAddress: collection_address,
    onRefresh: data.onRefresh
  }
  const special_data: TradingSpecialData = {
    dispatch
  }

  // bid
  const onCollectionBidApprove = (bid_data: IBidData) => {
    return doBidApprove(bid_data, common_data, special_data)
  }
  const onCollectionBidConfirm = (bid_data: IBidData) => {
    return doBidConfirm(bid_data, common_data)
  }
  const onCollectionBidDone = () => {
    return doBidDone(common_data)
  }

  return {
    onCollectionBidApprove,
    onCollectionBidConfirm,
    onCollectionBidDone,
  }
}
