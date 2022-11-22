import { useEffect, useState } from 'react'
import { NFTItem } from '../interface/interface'
import { collectionsService } from '../services/collections'
import useCollection from './useCollection'

export type CollectionNftTypeFunc = {
    nft: NFTItem | undefined,
    collection: any,
    refreshNft: () => void
}

const getNftInfo = async (col_url: string, token_id: string): Promise<any> => {
  const { data: { nft: info, collection } } = await collectionsService.getNFTInfo(col_url, token_id)
  return {
    info: info as NFTItem,
    collection: collection
  }
}

const useCollectionNft = (col_url: string, token_id: string): CollectionNftTypeFunc => {
  const [nft, setNft] = useState<NFTItem | undefined>()
  const [refresh, setRefresh] = useState<boolean>(false)
  const {collectionInfo, refreshCollection} = useCollection(col_url)

  const refreshNft = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      await refreshCollection()
      const { info } = await getNftInfo(col_url, token_id)
      setNft(info)
    })()
  }, [col_url, token_id, refresh])

  return {
    nft,
    collection: collectionInfo,
    refreshNft
  }
}

export default useCollectionNft
