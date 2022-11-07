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
import { truncateAddress } from '../utils/utils'

type UserBannerProps = {
    user: ProfileData,
}

const UserBanner = ({user}: UserBannerProps): JSX.Element => {
  const {address} = useWallet()
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
          <div className="flex justify-between fw-60 mt-5 relative">
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
                <div className="flex items-center text-[26px] text-slate-800 dark:text-[#F5F5F5] font-semibold mr-[16px]">
                  {user.username || 'username'}
                </div>
                {
                  user.isGregHolder &&
                  <div className="mr-2">
                    <Image src={Hgreg} alt="avatar" width="30px" height="30px" />
                  </div>
                }
                {
                  isStgStacker && <Image src={Stg} alt="avatar" width="30px" height="30px"/>
                }
              </div>

              <div className="text-[16px] text-[#969696]">
                {user && user.address ? truncateAddress(user.address) : truncateAddress(address || '')}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {
                user.address === address && 
                  <div className='flex items-center justify-center py-[4px] px-[12px] w-[100px] h-[26px] border-[1.5px] border-[#969696] rounded-full'>
                    <span className='text-secondary text-[15px] leading-[18px]'>edit profile</span>
                  </div>
              }
              <a href={user && user.website ? user.website : ''} target='_black' rel="noreferrer">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 25C20.9706 25 25 20.9706 25 16C25 11.0294 20.9706 7 16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25Z" stroke="#969696" strokeWidth="1.5" strokeMiterlimit="10"/>
                  <path d="M7.51562 13H24.4844" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.51562 19H24.4844" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 24.7564C18.0711 24.7564 19.75 20.8361 19.75 16.0001C19.75 11.1642 18.0711 7.2439 16 7.2439C13.9289 7.2439 12.25 11.1642 12.25 16.0001C12.25 20.8361 13.9289 24.7564 16 24.7564Z" stroke="#969696" strokeWidth="1.5" strokeMiterlimit="10"/>
                </svg>
              </a>
              <a href={user && user.twitter ? user.twitter : ''} target='_black' rel="noreferrer">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 12.2499C16 10.1874 17.7344 8.47173 19.7969 8.49985C20.5192 8.50819 21.2237 8.72496 21.8258 9.12411C22.4278 9.52326 22.9018 10.0878 23.1906 10.7499H26.5L23.4719 13.778C23.2765 16.8198 21.93 19.673 19.7061 21.7575C17.4823 23.842 14.5481 25.0014 11.5 24.9999C8.50002 24.9999 7.75002 23.8749 7.75002 23.8749C7.75002 23.8749 10.75 22.7499 12.25 20.4999C12.25 20.4999 6.25002 17.4999 7.75002 9.24985C7.75002 9.24985 11.5 12.9999 16 13.7499V12.2499Z" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBanner
