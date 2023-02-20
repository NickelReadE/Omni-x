import { useEffect, useState } from "react";
import { collectionsService } from "../services/collections";
import { FullCollectionType } from "../types/collections";

export type CollectionTypeFunc = {
  collectionInfo: FullCollectionType | undefined;
  refreshCollection: () => void;
};

const getCollectionInfo = async (col_url: string) => {
  const { data: collection_info } = await collectionsService.getCollectionInfo(col_url);
  return collection_info as FullCollectionType;
};

const useCollection = (col_url: string): CollectionTypeFunc => {
  const [collectionInfo, setCollectionInfo] = useState<FullCollectionType | undefined>();

  const refreshCollection = () => {
    getCollectionInfo(col_url).then((data) => {
      setCollectionInfo(data);
    });
  };

  useEffect(() => {
    getCollectionInfo(col_url).then((data) => {
      setCollectionInfo(data);
    });
  }, [col_url]);

  return {
    collectionInfo,
    refreshCollection
  };
};

export default useCollection;
