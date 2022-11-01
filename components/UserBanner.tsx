/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useState} from 'react'
import Image from 'next/image'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import Twitter from '../public/images/twitter.png'
import Web from '../public/images/web.png'
import {getVeSTGInstance} from '../utils/contracts'
import Hgreg from '../public/images/gregs/logo.png'
import Stg from '../public/images/stg/stg.png'
import { ProfileData } from '../hooks/useProfile'
import { chainsFroSTG, veSTGContractAddress } from '../utils/constants/addresses'

type UserBannerProps = {
    user: ProfileData,
}

const UserBanner = ({user}: UserBannerProps): JSX.Element => {
  const {address} = useWallet()
  const [avatarError, setAvatarError] = useState(false)
  const [isStgStacker, setIsStgStacker] = useState(false)
  const [balances, setBalanceSTG] = useState(0)
  const DEFAULT_AVATAR = 'uploads\\default_avatar.png'

  const fetchToken = async (chain: number) => {
    const veSTGInstance = getVeSTGInstance(veSTGContractAddress[chain], chain, null)
    setBalanceSTG(await veSTGInstance.balanceOf(address))
  }

  useEffect(() => {
    if (address) {
      chainsFroSTG.map((chain) => {
        fetchToken(chain)
      })
    }
  }, [address])

  useEffect(() => {
    if (balances > 0) {
      setIsStgStacker(true)
    }
  }, [balances])

  const bannerImage = useMemo(() => {
    if (user && user.banner) {
      return process.env.API_URL + user.banner
    }
    return '/images/default_banner.png'
  }, [user])

  const avatarImage = useMemo(() => {
    if (!avatarError && user && user.avatar) {
      return process.env.API_URL + user.avatar
    }
    return '/images/default_avatar.png'
  }, [user])

  return (
    <>
      <div
        className={classNames(
          'w-full',
          'mt-[134px]',
          'h-[500px]',
        )}
      >
        <div>
          <div className={'flex justify-center h-[540px]'}>
            <img
              src={bannerImage}
              className="banner-slider"
              alt={'banner'}
            />
          </div>
        </div>
        <div className="flex justify-center w-full ">
          <div className="flex justify-between justify-center fw-60 mt-5 relative">
            <div className="bottom-[0rem] left-[4rem]  absolute">
              <Image
                src={avatarImage}
                alt="avatar"
                onError={() => {
                  user.avatar && setAvatarError(true)
                }}
                width={200}
                height={200}
                className={'rounded-[8px]'}
              />
            </div>
                      
            <div className="flex flex-col ml-[20rem] mt-[10px]">
              <div className="flex flex-row h-8">
                <div className="flex items-center text-[26px] text-slate-800 font-semibold mr-[16px]">
                  {user.username ? user.username : 'username'}
                </div>
                {
                  user.isGregHolder &&
                <div className="mr-2"><Image src={Hgreg} alt="avatar" width="30px" height="30px"/></div>
                }
                {
                  isStgStacker && <Image src={Stg} alt="avatar" width="30px" height="30px"/>
                }
              </div>

              <div className="text-[#6C757D] text-[16px] text-slate-800">
                {user && user.bio ? user.bio : 'You can see the short description about your account'}
              </div>
            </div>
            
            <div className="flex ml-[]">
              <a href={(user && user.twitter) ? user.twitter : '#'} target="_blank" rel="noreferrer">
                <div className="mr-6">
                  <Image src={Twitter} alt="twitter"/>
                </div>
              </a>
              <a href={(user && user.website) ? user.website : '#'} target="_blank" rel="noreferrer">
                <div className="mr-6">
                  <Image src={Web} alt="website"/>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBanner
