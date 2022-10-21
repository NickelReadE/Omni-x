import { useEffect, useState } from 'react'
import { NFTItem } from '../interface/interface'
import { collectionsService } from '../services/collections'
import { CollectionType } from './useCollection'

export type CollectionTypeFunc = {
  nfts: NFTItem[],
  hasMoreNFTs: boolean,
  refreshNfts: () => Promise<void>,
  fetchMoreData: () => void
}

const getCollectionNfts = async (col_url: string, page: number, display_per_page: number, sort: string, searchObj: unknown) => {
  const {data: nfts} = await collectionsService.getCollectionNFTs(col_url, page, display_per_page, sort, searchObj)
  return nfts as NFTItem[]
}

const useCollectionNfts = (
  col_url: string,
  display_per_page: number,
  sort: string,
  searchObj: unknown,
  collectionInfo: CollectionType | undefined
): CollectionTypeFunc => {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [init, setInit] = useState<boolean>(false)
  const [hasMoreNFTs, setHasMoreNFTs] = useState<boolean>(true)
  const [page, setPage] = useState(0)
  
  useEffect(() => {
    (async () => {
      if (collectionInfo) {
        const responseNfts = await getCollectionNfts(col_url, page, display_per_page, sort, searchObj)
        setNfts(responseNfts)
        // if (page === 0 && hasMoreNFTs === false && init === true) {
        // } else {
        //   setNfts(prevNfts => [...prevNfts, ...responseNfts])
        // }
      }
    })()
  }, [col_url, page, display_per_page, sort, searchObj, collectionInfo])
  
  useEffect(() => {
    if ((collectionInfo && nfts.length >= collectionInfo.itemsCnt)/* || finishedGetting */) {
      setHasMoreNFTs(false)
    }
  }, [nfts, collectionInfo])

  useEffect(() => {
    (async () => {
      if (collectionInfo) {
        setInit(true)
        setHasMoreNFTs(true)
        setPage(0)
      }
    })()
  }, [searchObj, collectionInfo, sort])

  const refreshNfts = async () => {
    // const responseNfts = await getCollectionNfts(col_url, page, display_per_page, sort, searchObj)
    setInit(true)
    setHasMoreNFTs(false)
    setPage(0)
    // setNfts(responseNfts)
  }
  
  const fetchMoreData = () => {
    if (!init)
      return
    if (collectionInfo && nfts.length >= collectionInfo.itemsCnt) {
      setInit(true)
      setHasMoreNFTs(false)
      return
    }
    setTimeout(() => {
      if (col_url) {
        setPage(page + 1)
      }
    }, 500)
  }
  
  return {
    nfts,
    hasMoreNFTs,
    refreshNfts,
    fetchMoreData
  }
}

export default useCollectionNfts
