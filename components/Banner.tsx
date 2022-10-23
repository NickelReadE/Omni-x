/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import Twitter from '../public/images/twitter.png'
import Web from '../public/images/web.png'
import Carousel from './carousel'
import { getVeSTGInstance } from '../utils/contracts'
import Hgreg from '../public/images/gregs/logo.png'
import Stg from '../public/images/stg/stg.png'
import useData from '../hooks/useData'
import { chainsFroSTG, veSTGContractAddress } from '../utils/constants/addresses'

type BannerProps = {
  slides: Array<React.ReactNode>
  blur: boolean
  menu: string
}

const Banner = ({ slides, blur, menu }: BannerProps): JSX.Element => {
  const { address } = useWallet()
  const { profile } = useData()
  const [avatarError, setAvatarError] = useState(false)
  const [isStgStacker, setIsStgStacker] = useState(false)
  const [balances, setBalanceSTG] = useState(0)

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
    if (profile && profile.banner) {
      return process.env.API_URL + profile.banner
    }
    return '/images/default_banner.png'
  }, [profile])

  const avatarImage = useMemo(() => {
    if (!avatarError && profile && profile.avatar) {
      return process.env.API_URL + profile.avatar
    }
    return '/images/default_avatar.png'
  }, [profile])

  return (
    <>
      <div
        className={classNames(
          'w-full',
          'mt-[134px]',
          menu === 'home' ? 'h-[500px]' : 'h-[300px]',
          blur && menu === 'home' ? 'blur-sm' : ''
        )}
      >
        <div>
          {
            menu === 'home' && (
              <div className={'flex justify-center h-[540px]'}>
                <img
                  src={bannerImage}
                  className="banner-slider"
                  alt={'banner'}
                />
              </div>
            )
          }
          {
            menu === 'collections' &&
            <Carousel slides={slides} />
          }
        </div>
        {menu === 'home' && (
          <div className="flex justify-center w-full ">
            <div className="flex justify-between justify-center fw-60 mt-5 relative">
              <div className="bottom-[0rem] left-[4rem]  absolute">
                <Image
                  src={avatarImage}
                  alt="avatar"
                  onError={() => {
                    profile?.avatar && setAvatarError(true)
                  }}
                  width={200}
                  height={200}
                  className={'rounded-[8px]'}
                />
              </div>
              <div className="flex flex-col ml-[20rem] mt-[10px]">

                <div className="flex flex-row h-8">
                  <div
                    className="flex items-center text-[26px] text-slate-800 font-semibold mr-[16px]">{profile && profile.username ? profile.username : 'username'}</div>
                  {
                    profile && profile.isGregHolder &&
                    <div className="mr-2"><Image src={Hgreg} alt="avatar" width="30px" height="30px" /></div>
                  }
                  {
                    isStgStacker && <Image src={Stg} alt="avatar" width="30px" height="30px" />
                  }
                </div>

                <div className="text-[#6C757D] text-[16px] text-slate-800">
                  {profile && profile.bio ? profile.bio : 'You can see the short description about your account'}
                </div>
              </div>
              <div className="flex ml-[]">
                <Link href={profile && profile.twitter ? profile.twitter : ''}>
                  <a target="_blank">
                    <div className="mr-6">
                      <Image src={Twitter} alt="twitter" />
                    </div>
                  </a>
                </Link>
                <Link href={profile && profile.website ? profile.website : ''}>
                  <a target="_blank">
                    <div className="mr-6">
                      <Image src={Web} alt="website" />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Banner
