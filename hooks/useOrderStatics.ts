import {useMemo} from 'react'
import {IOrder, NFTItem} from '../interface/interface'
import {getCurrencyIconByAddress} from '../utils/constants'
import { CollectionType } from './useCollection'

export type OrderStatics = {
  order: IOrder,
  isListed: boolean,
  sortedBids: IOrder[],
  highestBid?: number,
  highestBidCoin?:  string,
  lastSale?: number,
  lastSaleCoin?:  string,
}

export type OrderStaticsInput = {
  nft?: NFTItem,
  collection?: CollectionType
}
const useOrderStatics = ({
  nft,
  collection
}: OrderStaticsInput): OrderStatics => {
  const combinedBids = useMemo(() => {
    const bidDatas = []
    const bidOrderDatas: any[] = []

    if (nft && nft.bidDatas && nft.bidOrderData) {
      bidDatas.push(...nft.bidDatas)
      bidOrderDatas.push(...nft.bidOrderData)
    }

    if (collection && collection.bid_datas && collection.bid_orders) {
      bidDatas.push(...collection.bid_datas)
      bidOrderDatas.push(...collection.bid_orders)
    }

    return bidDatas.map((data: any, index: number) => ({
      ...data,
      order_data: bidOrderDatas[index]
    })).filter(data => data.signer?.toLowerCase() != nft?.owner?.toLowerCase() && data.status != 'VALID' && !data.signature)
  }, [nft, collection])

  const sortedBids = useMemo(() => {
    if (combinedBids) {
      return combinedBids.sort((a: any, b: any) => {
        if (a.price && b.price) {
          if (a.price === b.price) return 0
          return a.price > b.price ? -1 : 1
        }
        return 0
      })
    }
    return []
  }, [combinedBids])
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
    if (nft && nft.last_sale_currency) {
      return getCurrencyIconByAddress(nft.last_sale_currency)
    }
  }, [nft])

  const isListed = (!!nft?.price && nft.price > 0)
  return {
    order: nft?.order_data,
    isListed,
    sortedBids,
    highestBid,
    highestBidCoin,
    lastSale: nft?.last_sale,
    lastSaleCoin
  }
}

export default useOrderStatics
