import { useEffect, useState } from 'react'
import { collectionsService } from '../services/collections'
import {FullCollectionType} from '../types/collections'

export type CollectionsTypeFunc = {
    loading: boolean,
    collections: FullCollectionType[],
    refreshCollections: () => void
}

const getAllCollections = async () => {
  const { data: collections } = await collectionsService.getCollections()
  return collections
}

const useCollections = (): CollectionsTypeFunc => {
  const [collections, setCollections] = useState<FullCollectionType[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const refreshCollections = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true)
        const _collections = await getAllCollections()
        setCollections(_collections)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [refresh])

  return {
    loading: isLoading,
    collections,
    refreshCollections
  }
}

export default useCollections
