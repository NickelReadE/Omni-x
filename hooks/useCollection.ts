import { useEffect, useState } from 'react'
import { IOrder } from '../interface/interface'
import { collectionsService } from '../services/collections'

export type CollectionType = {
    address: any,
    itemsCnt: number,
    ownerCnt: number,
    orderCnt: number,
    totalVolume: number,
    count: number,
    banner_image: string,
    profile_image: string,
    name: string,
    discord: string,
    twitter: string,
    telegram: string,
    website: string,
    symbol: string,
    col_url: string,
    description: string,
    floorPrice: {
        eth: number,
        usd: number,
        omni: number
    },
    floor_price: number,
    ceil_price: number,
    attrs: any,
    bid_datas: any[],
    bid_orders: IOrder[],
    whitelist_infos: any[],
    floorNft: {
      eth?: any,
      usd?: any,
      omni?: any
    },
    mint_start_timestamp: number,
    mint_end_timestamp: number,
    start_ids: any,
    price: number,
    is_gasless: boolean,
    contract_type: string
    volume7d: string,
    volume24h: string,
    volume48h: string,
    volume14d: string,
    total_volume: string,
}

export type CollectionTypeFunc = {
    collectionInfo: CollectionType | undefined,
    refreshCollection: () => void
}

const getCollectionInfo = async (col_url: string) => {
  const { data: collection_info } = await collectionsService.getCollectionInfo(col_url)
  return collection_info as CollectionType
}

const useCollection = (col_url: string): CollectionTypeFunc => {
  const [collectionInfo, setCollectionInfo] = useState<CollectionType | undefined>()

  const refreshCollection = () => {
    getCollectionInfo(col_url).then(data => {
      setCollectionInfo(data)
    })
  }

  useEffect(() => {
    getCollectionInfo(col_url).then(data => {
      setCollectionInfo(data)
    })
  }, [col_url])

  return {
    collectionInfo,
    refreshCollection
  }
}

export default useCollection
