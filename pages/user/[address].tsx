import { useRouter } from "next/router";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import UserBanner from "../../components/user/Banner";
import NFTGrid from "../../components/user/NFTGrid";
import { UserFavorites } from "../../components/user/Favorites";
import { SkeletonCard } from "../../components/common/skeleton/Card";
import UserActivity from "../../components/user/UserActivity";
import useActivities from "../../hooks/useActivities";
import useProfile from "../../hooks/useProfile";
import UserCollections from "../../components/user/UserCollections";
import { userService } from "../../services/users";
import { getETHPrice } from "../../utils/helpers";
import { FavoriteCollectionType, FavoriteItemType, UserCollectionType } from "../../types/collections";
import { activeClasses, activeTextClasses } from "../../utils/utils";

const User: NextPage = () => {
  const router = useRouter();
  const userAddress = router.query.address as string;
  const { profile, nfts, isLoading } = useProfile(userAddress);
  const { activities } = useActivities(userAddress);

  const [ethPrice, setEthPrice] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [collections, setCollections] = useState<UserCollectionType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItemType[]>([]);
  const [favoriteCollections, setFavoriteCollections] = useState<FavoriteCollectionType[]>([]);

  useEffect(() => {
    (async () => {
      if (userAddress) {
        const _collections = await userService.getUserCollections(userAddress);
        setCollections(_collections);
        const _favoritesItems = await userService.getFavoriteItems(userAddress);
        setFavorites(_favoritesItems);
        const _favoritesCollections = await userService.getFavoriteCollections(userAddress);
        setFavoriteCollections(_favoritesCollections);
      }
    })();
  }, [userAddress]);

  useEffect(() => {
    (async () => {
      const ethPrice = await getETHPrice();
      setEthPrice(ethPrice);
    })();
  }, []);

  return (
    <div>
      {profile ? (
        <>
          <UserBanner user={profile} />
          <div className={"grid grid-cols-4 lg:grid-cols-6"}>
            <div className={"hidden lg:block"} />
            {/*Tabs section*/}
            <div className={"col-span-4 flex items-center mt-6"}>
              <div className='text-xl font-medium text-center text-secondary'>
                <ul className='flex flex-wrap -mb-px'>
                  <li onClick={() => setSelectedTab(0)}>
                    <div className={`${activeClasses(0, selectedTab)} pb-[2px] cursor-pointer`}>
                      <div className={"flex flex-col justify-between h-full bg-primary text-white p-4 pb-1"}>
                        <span className={`${activeTextClasses(0, selectedTab)}`}>collected</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => setSelectedTab(1)}>
                    <div className={`${activeClasses(1, selectedTab)} pb-[2px] cursor-pointer`}>
                      <div className={"flex flex-col justify-between h-full bg-primary text-white p-4 pb-1"}>
                        <span className={`${activeTextClasses(1, selectedTab)}`}>created</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => setSelectedTab(2)}>
                    <div className={`${activeClasses(2, selectedTab)} pb-[2px] cursor-pointer`}>
                      <div className={"flex flex-col justify-between h-full bg-primary text-white p-4 pb-1"}>
                        <span className={`${activeTextClasses(2, selectedTab)}`}>activity</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => setSelectedTab(3)}>
                    <div className={`${activeClasses(3, selectedTab)} pb-[2px] cursor-pointer`}>
                      <div className={"flex flex-col justify-between h-full bg-primary text-white p-4 pb-1"}>
                        <span className={`${activeTextClasses(3, selectedTab)}`}>favorites</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => setSelectedTab(4)}>
                    <div className={`${activeClasses(4, selectedTab)} pb-[2px] cursor-pointer`}>
                      <div className={"flex flex-col justify-between h-full bg-primary text-white p-4 pb-1"}>
                        <span className={`${activeTextClasses(4, selectedTab)}`}>hidden</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={"my-6"}>
            {selectedTab === 0 && <NFTGrid nfts={nfts} isLoading={isLoading} />}
            {selectedTab === 1 && <UserCollections ethPrice={ethPrice} collections={collections} />}
            {selectedTab === 2 && <UserActivity activities={activities} />}
            {selectedTab === 3 && <UserFavorites items={favorites} collections={favoriteCollections} />}
            {selectedTab === 4 && <div />}
          </div>
        </>
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

export default User;
