/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useState} from 'react'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import { ProfileData } from '../hooks/useProfile'
import { truncateAddress } from '../utils/utils'
import {ExternalLink, GradientButton} from './basic'
import WebsiteIcon from '../public/images/icons/website.svg'
import TwitterIcon from '../public/images/icons/twitter.svg'
import BlockscanChatIcon from '../public/images/icons/blockscan_chat.svg'

type UserBannerProps = {
    user: ProfileData,
}

const UserBanner = ({user}: UserBannerProps): JSX.Element => {
  const {address} = useWallet()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarError, setAvatarError] = useState(false)
  // const [isStgStacker, setIsStgStacker] = useState(false)
  // const [balances, setBalanceSTG] = useState(0)
  //
  // const fetchToken = async (chain: number) => {
  //   const veSTGInstance = getVeSTGInstance(veSTGContractAddress[chain], chain, null)
  //   setBalanceSTG(await veSTGInstance.balanceOf(address))
  // }
  //
  // useEffect(() => {
  //   if (address) {
  //     chainsFroSTG.map((chain) => {
  //       fetchToken(chain)
  //     })
  //   }
  // }, [address])

  // useEffect(() => {
  //   if (balances > 0) {
  //     setIsStgStacker(true)
  //   }
  // }, [balances])

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
    <div className={'grid grid-cols-6'}>
      <div className={''} />
      <div className={classNames( 'col-span-4')}>
        <div className={'relative max-h-[350px]'}>
          <div className={'max-h-[350px] overflow-hidden'}>
            <img
              src={bannerImage}
              className="rounded-md w-full object-cover"
              alt={'banner'}
            />
          </div>
          <div className="bottom-[-80px] left-6 h-[120px] absolute flex items-end">
            <img
              src={avatarImage}
              alt="avatar"
              width={120}
              height={120}
              className={'rounded-[8px]'}
            />
          </div>
        </div>

        <div className={'flex items-center justify-between w-full pl-[160px] pt-5'}>
          <div className={'flex items-center'}>
            <div className={'flex flex-col space-y-2'}>
              <span className={'text-xg1 text-primary-light'}>{user.username || 'username'}</span>
              <span className={'text-md text-secondary'}>{user && user.address ? truncateAddress(user.address) : truncateAddress(address || '')}</span>
            </div>
            {/*<div className={'flex'}>
              {
                user.isGregHolder &&
                <div className="mr-2">
                  <Image src={Hgreg} alt="avatar" width="30px" height="30px" />
                </div>
              }
              {
                isStgStacker && <Image src={Stg} alt="avatar" width="30px" height="30px"/>
              }
            </div>*/}
          </div>
          <div className={'flex items-center'}>
            <div className={'flex flex-col items-end space-y-2 mr-4'}>
              <div className={'w-[90px]'}>
                <GradientButton height={26} borderRadius={50} title={'following'} textSize={'text-md font-medium'} />
              </div>
              <div className={'flex items-center'}>
                <span className={'text-md text-primary-light'}>1.65k followers</span>
                <span className={'text-md text-primary-light ml-2'}>1.65k following</span>
              </div>
            </div>
            {/*Social links*/}
            <div className={'flex items-center space-x-3'}>
              <div className={'w-8 h-8 p-1'}>
                <ExternalLink link={user.website}>
                  <WebsiteIcon />
                </ExternalLink>
              </div>
              <div className={'w-8 h-8 p-1'}>
                <ExternalLink link={user.twitter}>
                  <TwitterIcon />
                </ExternalLink>
              </div>
              <div className={'w-8 h-8 p-1'}>
                <ExternalLink link={`https://chat.blockscan.com/index?a=${user.address}`}>
                  <BlockscanChatIcon />
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={''} />
    </div>
  )
}

export default UserBanner
