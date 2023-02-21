import { useEffect, useState } from "react";
import { NFTItem } from "../interface/interface";
import { collectionsService } from "../services/collections";
import { FullCollectionType } from "../types/collections";

export type CollectionTypeFunc = {
  nfts: NFTItem[];
  hasMoreNFTs: boolean;
  refreshNfts: () => Promise<void>;
  fetchMoreData: () => void;
};

const getCollectionNfts = async (
  col_url: string,
  page: number,
  display_per_page: number,
  sort: string,
  searchObj: any,
  chainIds: number[]
) => {
  const { data } = await collectionsService.getCollectionNFTs(col_url, page, display_per_page, sort, searchObj, chainIds);
  return {
    nfts: data.nfts as NFTItem[],
    totalCount: data.total_count,
    finished: data.finished
  };
};

const useCollectionNfts = (
  col_url: string,
  display_per_page: number,
  sort: string,
  searchObj: any,
  collectionInfo: FullCollectionType | undefined,
  chainIds: number[]
): CollectionTypeFunc => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [hasMoreNFTs, setHasMoreNFTs] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [totalNftCount, setTotalNftCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (collectionInfo) {
        const responseNfts = await getCollectionNfts(col_url, 0, display_per_page, sort, searchObj, chainIds);
        setNfts(responseNfts.nfts);
        setPage(0);
        setTotalNftCount(responseNfts.totalCount);
      }
    })();
  }, [col_url, display_per_page, sort, searchObj, collectionInfo, chainIds]);

  useEffect(() => {
    if (collectionInfo) {
      setHasMoreNFTs(true);
      setPage(0);
    }
  }, [searchObj, collectionInfo, sort]);

  const refreshNfts = async () => {
    // const responseNfts = await getCollectionNfts(col_url, page, display_per_page, sort, searchObj)
    setHasMoreNFTs(false);
    setPage(0);
    // setNfts(responseNfts)
  };

  const fetchMoreData = async () => {
    if (collectionInfo && nfts.length >= totalNftCount) {
      setHasMoreNFTs(false);
      return;
    }
    setTimeout(async () => {
      if (col_url) {
        setPage(page + 1);
        const responseNfts = await getCollectionNfts(col_url, page + 1, display_per_page, sort, searchObj, chainIds);
        setNfts((prevNfts) => [...prevNfts, ...responseNfts.nfts]);
        setHasMoreNFTs(!responseNfts.finished);
      }
    }, 500);
  };

  return {
    nfts,
    hasMoreNFTs,
    refreshNfts,
    fetchMoreData
  };
};

export default useCollectionNfts;
