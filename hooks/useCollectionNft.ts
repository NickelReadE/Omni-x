import { useEffect, useState } from 'react'
import { NFTItem } from '../interface/interface'
import { collectionsService } from '../services/collections'

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
  const [collection, setCollection] = useState<any>()
  const [refresh, setRefresh] = useState<boolean>(false)

  const refreshNft = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      const { info, collection } = await getNftInfo(col_url, token_id)
      setNft(info)
      setCollection(collection)
    })()
  }, [col_url, token_id, refresh])

  return {
    nft,
    collection,
    refreshNft
  }
}

export default useCollectionNft
