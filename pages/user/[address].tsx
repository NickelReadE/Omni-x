import { useRouter } from 'next/router'
import type { NextPage } from 'next'
import useProfile from '../../hooks/useProfile'
import { useState } from 'react'
import UserBanner from '../../components/UserBanner'
import NFTGrid from '../../components/NFTGrid'

const User: NextPage = () => {
  const router = useRouter()
  const userAddress = router.query.address as string
  const {profile, nfts, isLoading} = useProfile(userAddress)

  const [currentTab, setCurrentTab] = useState<string>('NFTs')

  return (
    <div>
      {
        profile &&
        <>
          <UserBanner user={profile} />
          <div className="flex justify-center">
            <div className={'flex justify-center mt-36 w-[90%] mb-20'}>
              <div className="w-[90%]">
                <ul
                  className="flex relative justify-item-stretch text-[16px] font-medium text-center border-b-2 border-[#E9ECEF]">
                  <li
                    className={`select-none inline-block p-4 border-b-2 border-black w-36 cursor-pointer z-30 ${currentTab === 'NFTs' ? 'text-[#1E1C21] ' : ' text-[#ADB5BD] '} `}
                    onClick={() => setCurrentTab('NFTs')}>
                    NFTs
                  </li>
                  <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>watchlist</li>
                  <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>feed</li>
                  <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>stats</li>
                </ul>
                {currentTab === 'NFTs' && <NFTGrid nfts={nfts} isLoading={isLoading} />}
                {currentTab === 'watchlist' && <div/>}
                {/* {currentTab === 'feed' && <Feed feed={feed} />} */}
                {currentTab === 'feed' && <div/>}
                {currentTab === 'stats' && <div/>}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default User
