import { useEffect, useState } from 'react'
import { collectionsService } from '../services/collections'
import { CollectionType } from './useCollection'

export type CollectionsTypeFunc = {
    collections: CollectionType[],
    refreshCollections: () => void
}

const getAllCollections = async () => {
  const { data: collections } = await collectionsService.getCollections()
  return collections
}

const useCollections = (): CollectionsTypeFunc => {
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)

  const refreshCollections = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      setCollections(await getAllCollections())
    })()
  }, [refresh])

  return {
    collections,
    refreshCollections
  }
}

export default useCollections
