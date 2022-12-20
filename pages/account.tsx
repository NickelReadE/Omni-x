import type { NextPage } from 'next'
import React, { useState } from 'react'
import UserBanner from '../components/UserBanner'
import NFTGrid from '../components/NFTGrid'
import {UserFavorites} from '../components/user/Favorites'
import {SkeletonCard} from '../components/skeleton/card'
import UserActivity from '../components/user/UserActivity'
import useData from '../hooks/useData'
import useActivities from '../hooks/useActivities'
import useWallet from '../hooks/useWallet'

const Account: NextPage = () => {
  const { address } = useWallet()
  const {profile, userNfts: nfts, isLoadingNfts: isLoading} = useData()
  const { activities } = useActivities(address)

  const [selectedTab, setSelectedTab] = useState(0)

  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
  }

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
              {selectedTab === 1 && <div />}
              {selectedTab === 2 && <UserActivity activities={activities}/>}
              {selectedTab === 3 && <UserFavorites />}
              {selectedTab === 4 && <div/>}
            </div>
          </>
          :
          <SkeletonCard />
      }
    </div>
  )
}

export default Account
