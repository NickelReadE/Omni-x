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
}

export type LaunchPadTypeFunc = {
    collectionsForLive: LaunchPadType[],
    collectionsForComing: LaunchPadType[],
    sampleCollection: LaunchPadType | undefined
}

const getLaunchpadInfo = async (): Promise<LaunchPadTypeFunc> => {
  const {data: collections} = await collectionsService.getCollections()
  const collectionsForLive = collections.filter((collection: LaunchPadType) => collection.mint_status === 'Live')
  const collectionsForComing = collections.filter((collection: LaunchPadType) => collection.mint_status === 'Upcoming')
    
  const filteredSamples = collectionsForLive.filter((collection: LaunchPadType) => collection.col_url === 'kanpai_pandas')
  return {
    collectionsForLive,
    collectionsForComing,
    sampleCollection: filteredSamples.length > 0 ? filteredSamples[0]: undefined
  }
}

const useLaunchPad = (): LaunchPadTypeFunc => {
  const [launchpadInfo, setLaunchpadInfo] = useState<LaunchPadTypeFunc>({
    collectionsForLive: [],
    collectionsForComing: [],
    sampleCollection: undefined
  })

  useEffect(() => {
    (async () => {
      setLaunchpadInfo(await getLaunchpadInfo())
    })()
  }, [])

  return launchpadInfo
}

export default useLaunchPad
