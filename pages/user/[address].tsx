import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import useProfile from '../../hooks/useProfile'
import React, { useState } from 'react'
import UserBanner from '../../components/UserBanner'
import NFTGrid from '../../components/NFTGrid'
import {UserLikes} from '../../components/user/Likes'

const User: NextPage = () => {
  const router = useRouter()
  const userAddress = router.query.address as string
  const {profile, nfts, isLoading} = useProfile(userAddress)

  const [currentTab, setCurrentTab] = useState<string>('NFTs')
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
        profile &&
        <>
          <UserBanner user={profile} />
          <div className={'grid grid-cols-6'}>
            <div />
            {/*Tabs section*/}
            <div className={'col-span-4 flex items-center mt-8'}>
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
                        <span className={`${activeTextClasses(2)}`}>likes</span>
                      </div>
                    </div>
                  </li>
                  <li onClick={() => setSelectedTab(3)}>
                    <div className={`${activeClasses(3)} pb-[2px] cursor-pointer`}>
                      <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                        <span className={`${activeTextClasses(3)}`}>activity</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={'mt-6 mb-20'}>
            {selectedTab === 0 && <NFTGrid nfts={nfts} isLoading={isLoading} />}
            {selectedTab === 1 && <div/>}
            {selectedTab === 2 && <UserLikes />}
            {selectedTab === 3 && <div/>}
          </div>
        </>
      }
    </div>
  )
}

export default User
