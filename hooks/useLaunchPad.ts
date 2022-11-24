import { useEffect, useState } from 'react'
import { collectionsService } from '../services/collections'

export type LaunchPadType = {
    mint_status: string,
    totalCnt: string,
    col_url: string,
    name: string,
    profile_image: string,
    price: string,
    description: string,
    itemsCnt: string,
    mint_start_timestamp: number,
    mint_end_timestamp: number
}

export type LaunchPadTypeFunc = {
    collectionsForPast: LaunchPadType[],
    collectionsForComing: LaunchPadType[],
    collectionsFeatured: LaunchPadType[],
}

const getLaunchpadInfo = async (): Promise<LaunchPadTypeFunc> => {
  const {data: collections} = await collectionsService.getCollections()
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const collectionsForPast = collections.filter((collection: LaunchPadType) => collection.mint_end_timestamp < currentTimestamp)
  const collectionsForComing = collections.filter((collection: LaunchPadType) => collection.mint_start_timestamp > currentTimestamp)
  const collectionsFeatured = collections.filter((collection: LaunchPadType) => collection.mint_start_timestamp < currentTimestamp && collection.mint_end_timestamp > currentTimestamp)
    
  return {
    collectionsForPast,
    collectionsForComing,
    collectionsFeatured,
  }
}

const useLaunchPad = (): LaunchPadTypeFunc => {
  const [launchpadInfo, setLaunchpadInfo] = useState<LaunchPadTypeFunc>({
    collectionsForPast: [],
    collectionsForComing: [],
    collectionsFeatured: [],
  })

  useEffect(() => {
    (async () => {
      setLaunchpadInfo(await getLaunchpadInfo())
    })()
  }, [])

  return launchpadInfo
}

export default useLaunchPad
