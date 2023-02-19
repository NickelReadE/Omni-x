import type { NextPage } from 'next'
import React, {useEffect, useState} from 'react'
import UserBanner from '../components/user/Banner'
import NFTGrid from '../components/user/NFTGrid'
import {UserFavorites} from '../components/user/Favorites'
import {SkeletonCard} from '../components/common/skeleton/Card'
import UserActivity from '../components/user/UserActivity'
import useData from '../hooks/useData'
import useActivities from '../hooks/useActivities'
import useWallet from '../hooks/useWallet'
import UserCollections from '../components/user/UserCollections'
import {userService} from '../services/users'
import {FavoriteCollectionType, FavoriteItemType, UserCollectionType} from '../types/collections'
import {getETHPrice} from '../utils/helpers'
import UserHidden from '../components/user/UserHidden'
import {NFTItem} from '../interface/interface'

const Account: NextPage = () => {
  const { address } = useWallet()
  const {profile, userNfts: nfts, isLoadingNfts: isLoading} = useData()
  const { activities } = useActivities(address)

  const [ethPrice, setEthPrice] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const [collections, setCollections] = useState<UserCollectionType[]>([])
  const [favorites, setFavorites] = useState<FavoriteItemType[]>([])
  const [favoriteCollections, setFavoriteCollections] = useState<FavoriteCollectionType[]>([])
  const [hiddenItems, setHiddenItems] = useState<NFTItem[]>([])

  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
  }

  useEffect(() => {
    (async () => {
      if (address) {
        const _collections = await userService.getUserCollections(address)
        setCollections(_collections)
        const _favoritesItems = await userService.getFavoriteItems(address)
        setFavorites(_favoritesItems)
        const _favoritesCollections = await userService.getFavoriteCollections(address)
        setFavoriteCollections(_favoritesCollections)
        const _hiddenItems = await userService.getHideItems(address)
        setHiddenItems(_hiddenItems)
      }
    })()
  }, [address])

  useEffect(() => {
    (async () => {
      const ethPrice = await getETHPrice()
      setEthPrice(ethPrice)
    })()
  }, [])

  return (
    <div>
      {
        profile ?
          <>
            <UserBanner user={profile} />
            <div className={'grid grid-cols-4 lg:grid-cols-6'}>
              <div className={'hidden lg:block'} />
              {/*Tabs section*/}
              <div className={'col-span-4 flex items-center mt-6'}>
                <div className="text-xl font-medium text-center text-secondary">
                  <ul className="flex flex-wrap -mb-px">
                    <li onClick={() => setSelectedTab(0)}>
                      <div className={`${activeClasses(0)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(0)}`}>collected</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(1)}>
                      <div className={`${activeClasses(1)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(1)}`}>created</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(2)}>
                      <div className={`${activeClasses(2)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(2)}`}>activity</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(3)}>
                      <div className={`${activeClasses(3)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(3)}`}>favorites</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(4)}>
                      <div className={`${activeClasses(4)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(4)}`}>hidden</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={'my-6'}>
              {selectedTab === 0 && <NFTGrid nfts={nfts} isLoading={isLoading} />}
              {selectedTab === 1 && <UserCollections ethPrice={ethPrice} collections={collections} />}
              {selectedTab === 2 && <UserActivity activities={activities}/>}
              {selectedTab === 3 && <UserFavorites items={favorites} collections={favoriteCollections} />}
              {selectedTab === 4 && <UserHidden items={hiddenItems} />}
            </div>
          </>
          :
          <SkeletonCard />
      }
    </div>
  )
}

export default Account
