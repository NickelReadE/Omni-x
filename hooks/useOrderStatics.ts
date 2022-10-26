import {useMemo} from 'react'
import {IOrder} from '../interface/interface'
import {getCurrencyIconByAddress} from '../utils/constants'

export type OrderStatics = {
  order: IOrder,
  isListed: boolean,
  sortedBids: IOrder[],
  highestBid?: number,
  highestBidCoin?:  string,
  lastSale?: number,
  lastSaleCoin?:  string,
}

const useOrderStatics = ({
  nft
}: any): OrderStatics => {
  const combinedBids = useMemo(() => {
    if (nft && nft.bidDatas && nft.bidOrderData) {
      return nft.bidDatas.map((data: any, index: number) => ({
        ...data,
        order_data: nft.bidOrderData[index]
      }))
    }
    return []
  }, [nft])

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

  const isListed = !!nft?.order_id
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
