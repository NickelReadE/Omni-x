import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { IOrder } from "../interface/interface"
import { selectBidOrders, selectLastSaleOrders, selectOrders } from "../redux/reducers/ordersReducer"
import { SaleType } from "../types/enum"
import { getCurrencyIconByAddress } from "../utils/constants"

export type OrderStatics = {
  order?: IOrder,
  isListed: boolean,
  isAuction: boolean,
  highestBid?: number,
  highestBidCoin?:  string,
  lastSale?: number,
  lastSaleCoin?:  string,
}

const formatEther = (price?: string) => {
  if (!price) return undefined
  return Number(ethers.utils.formatEther(price))
}

const findOrder = (orders: IOrder[], token_id: number, collection_address: string, isDetailPage: boolean) => {
  if (isDetailPage) {
    if (collection_address === orders[0].collectionAddress
      && token_id === Number(orders[0].tokenId)) {
      return orders[0]
    }
  }
  else {
    return [...orders].reverse().find(order => (
      collection_address === order.collectionAddress
      && token_id === Number(order.tokenId)
    ))
  }
  return undefined
}

const useOrderStatics = ({
  nft,
  collection_address,
  isDetailPage
}: any): OrderStatics => {
  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders) as IOrder[]
  const lastSaleOrders = useSelector(selectLastSaleOrders)

  // order
  const order = useMemo(() => {
    if (orders?.length > 0 && nft) {
      return findOrder(orders, Number(nft.token_id), collection_address, isDetailPage)
    }
    return undefined
  }, [orders, nft, collection_address, isDetailPage])

  // highest bid
  const highestBidOrder = useMemo(() => {
    if (bidOrders?.length > 0 && nft) {
      const sortedBids = [...bidOrders]
        .filter(o => (collection_address === o.collectionAddress
          && Number(nft.token_id) === Number(o.tokenId)))
        .sort((o1, o2) => {
          const p1 = BigNumber.from(o1.price)
          const p2 = BigNumber.from(o2.price)
          if (p1.eq(p2)) return 0
          return p2.sub(p1).isNegative() ? -1 : 1
        })
      return sortedBids[0]
    }
    return undefined
  }, [bidOrders, collection_address])
  const highestBid = formatEther(highestBidOrder?.price)
  const highestBidCoin = highestBidOrder?.currencyAddress && getCurrencyIconByAddress(highestBidOrder?.currencyAddress)

  // last sale
  const lastSaleOrder = useMemo(() => {
    if (lastSaleOrders?.length > 0  && nft) {
      return findOrder(lastSaleOrders, Number(nft.token_id), collection_address, isDetailPage)
    }
    return undefined
  }, [lastSaleOrders, nft, collection_address, isDetailPage])
  const lastSale = formatEther(lastSaleOrder?.price)
  const lastSaleCoin = lastSaleOrder?.currencyAddress && getCurrencyIconByAddress(lastSaleOrder?.currencyAddress)

  const isListed = !!order
  const isAuction = order?.params?.[1] == SaleType.AUCTION
  return {
    order,
    isListed,
    isAuction,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  }
}

export default useOrderStatics
