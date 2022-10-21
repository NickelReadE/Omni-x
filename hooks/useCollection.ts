import { useEffect, useState } from 'react'
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
    website: string,
    floorPrice: {
        eth: number,
        usd: number,
        omni: number
    },
    attrs: any
}

export type CollectionTypeFunc = {
    collectionInfo: CollectionType | undefined,
    refreshCollection: () => void
}

const getCollectionInfo = async (col_url: string) => {
  const { data: collection_info } = await collectionsService.getCollectionInfo(col_url)
  return {
    ...collection_info,
    address: collection_info.address,
    itemsCnt: collection_info.itemsCnt,
    ownerCnt: collection_info.ownerCnt,
    orderCnt: collection_info.orderCnt,
    totalVolume: collection_info.totalVolume,
    count: collection_info.count,
    banner_image: collection_info.banner_image,
    profile_image: collection_info.profile_image,
    name: collection_info.name,
    discord: collection_info.discord,
    twitter: collection_info.twitter,
    website: collection_info.website,
    floorPrice: collection_info.floorPrice,
    attrs: collection_info.attrs,
  }
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
