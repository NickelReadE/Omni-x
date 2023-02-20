import { useEffect, useState } from "react";
import { userService } from "../services/users";
import { UserCollectionType } from "../types/collections";

type ProfileResult = {
  avatar: string;
  address: string;
  username: string;
};

export type SearchType = {
  collections: UserCollectionType[];
  profiles: ProfileResult[];
};

const getSearchResult = async (keyword: string): Promise<SearchType> => {
  const results = await userService.searchByKeyword(keyword);
  if (results) {
    return {
      collections: results.collections,
      profiles: results.profiles
    } as SearchType;
  }
  return {
    collections: [],
    profiles: []
  } as SearchType;
};

const useSearch = (keyword: string): SearchType => {
  const [result, setResult] = useState<SearchType>({
    collections: [],
    profiles: []
  });

  useEffect(() => {
    (async () => {
      if (keyword) {
        setResult(await getSearchResult(keyword));
      } else {
        setResult({
          collections: [],
          profiles: []
        });
      }
    })();
  }, [keyword]);

  return result;
};

export default useSearch;
