import { useEffect, useState } from "react";
import { collectionsService } from "../services/collections";
import { OmniCollectionType } from "../types/collections";

export type CollectionsTypeFunc = {
  loading: boolean;
  collections: OmniCollectionType[];
  refreshCollections: () => void;
};

const getOmniCollections = async () => {
  const { data: collections } = await collectionsService.getOmniCollections();
  return collections;
};

const useOmniCollections = (): CollectionsTypeFunc => {
  const [collections, setCollections] = useState<OmniCollectionType[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCollections = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const _collections = await getOmniCollections();
        setCollections(_collections);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refresh]);

  return {
    loading: isLoading,
    collections,
    refreshCollections
  };
};

export default useOmniCollections;
