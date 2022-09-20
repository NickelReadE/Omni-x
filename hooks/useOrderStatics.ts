import { BigNumber, ethers } from "ethers"
import { useMemo } from "react"
import { useSelector,useDispatch } from "react-redux"
import { IOrder } from "../interface/interface"
import { selectBidOrders, selectLastSaleOrders, selectOrders } from "../redux/reducers/ordersReducer"
import { getCurrencyIconByAddress } from "../utils/constants"
import { useEffect,useState } from 'react'
import { selectNFTInfo } from "../redux/reducers/collectionsReducer"
import useWallet from '../hooks/useWallet'

export type OrderStatics = {
  order: IOrder,
  highestBid?: number,
  highestBidCoin?:  string,
  lastSale?: number,
  lastSaleCoin?:  string,
}

const formatEther = (price?: string) => {
  if (!price) return undefined
  return Number(ethers.utils.formatEther(price))
}

const useOrderStatics = (): OrderStatics => {
  const [collectionAddress, setCollectionAddress] = useState('')
  const {
    provider,
  } = useWallet()
  
  const nftInfo = useSelector(selectNFTInfo)

  useEffect(() => {
    if(nftInfo && nftInfo.collection && nftInfo.collection.address && provider?._network?.chainId) {
      Object.keys(nftInfo.collection.address).map((key, idx)=>{
        if(key==(provider?._network?.chainId).toString()){
          setCollectionAddress(nftInfo.collection.address[key])
        }
      })
    }
  },[nftInfo,provider])

  const orders = useSelector(selectOrders)
  const bidOrders = useSelector(selectBidOrders) as IOrder[]
  const lastSaleOrders = useSelector(selectLastSaleOrders)

  // order
  const order: IOrder = useMemo(() => {
    if (orders?.length > 0  && nftInfo?.collection && nftInfo?.nft) {
      if (collectionAddress === orders[0].collectionAddress
        && Number(nftInfo.nft.token_id) === Number(orders[0].tokenId)) {
        return orders[0]
      }
    }
    return undefined
  }, [orders, nftInfo])

  // highest bid
  const highestBidOrder = useMemo(() => {
    if (bidOrders?.length > 0 && nftInfo?.collection && nftInfo?.nft) {
      const sortedBids = [...bidOrders]
      sortedBids
        .sort((o1, o2) => {
          const p1 = BigNumber.from(o1.price)
          const p2 = BigNumber.from(o2.price)
          if (p1.eq(p2)) return 0
          return p2.sub(p1).isNegative() ? -1 : 1
        })
      return sortedBids[0]
    }
    return undefined
  }, [bidOrders, nftInfo])

  const highestBid = formatEther(highestBidOrder?.price)
  const highestBidCoin = highestBidOrder?.currencyAddress && `/images/${getCurrencyIconByAddress(highestBidOrder?.currencyAddress)}`

  // last sale
  const lastSaleOrder: IOrder = useMemo(() => {
    if (lastSaleOrders?.length > 0  && nftInfo?.collection && nftInfo?.nft) {
      if (collectionAddress === lastSaleOrders[0].collectionAddress
        && Number(nftInfo.nft.token_id) === Number(lastSaleOrders[0].tokenId)) {
        return lastSaleOrders[0]
      }
    }
    return undefined
  }, [orders, nftInfo])
  const lastSale = formatEther(lastSaleOrder?.price)
  const lastSaleCoin = lastSaleOrder?.currencyAddress && `/images/${getCurrencyIconByAddress(lastSaleOrder?.currencyAddress)}`

  return {
    order,
    highestBid,
    highestBidCoin,
    lastSale,
    lastSaleCoin
  }
}

export default useOrderStatics
