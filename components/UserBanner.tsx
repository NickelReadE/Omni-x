/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import {makeStyles} from '@material-ui/core/styles'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import { ProfileData } from '../hooks/useProfile'
import { truncateAddress } from '../utils/utils'
import {ExternalLink, TextBody, TextH3} from './basic'
import UserEdit from './user/UserEdit'
import {PrimaryButton} from './common/buttons/PrimaryButton'
import {GreyButton} from './common/buttons/GreyButton'
import {formatAmount} from '../utils/numbers'
import Image from 'next/image'

type UserBannerProps = {
    user: ProfileData,
}

const useStyles = makeStyles({
  paper: {
    padding: 0,
    width: '90%',
    maxWidth: '960px',
  },
})

const UserBanner = ({user}: UserBannerProps): JSX.Element => {
  const {address} = useWallet()
  const classes = useStyles()
  const [settingModal, setSettingModal] = useState(false)

  const bannerImage = useMemo(() => {
    if (user && user.banner) {
      return process.env.API_URL + user.banner
    }
    return '/images/default_banner.png'
  }, [user])

  const avatarImage = useMemo(() => {
    if (user && user.avatar) {
      if (user.avatar.startsWith('https://ipfs.io')) {
        return user.avatar
      }
      if (user.avatar.startsWith('ipfs')) {
        return `https://ipfs.io/${user.avatar}`
      }
      return process.env.API_URL + user.avatar
    }
    return '/images/default_avatar.png'
  }, [user])

  return (
    <>
      <div className={'grid grid-cols-4 lg:grid-cols-6 pt-5'}>
        <div className={'hidden lg:block'} />
        <div className={classNames( 'col-span-4')}>
          <div className={'relative'}>
            <div className={'overflow-hidden aspect-[3/1]'}>
              <img
                src={bannerImage}
                className="rounded-md w-full object-cover"
                alt={'banner'}
              />
            </div>
            <div className="bottom-[-80px] left-6 w-[120px] h-[120px] absolute flex items-end">
              <img
                src={avatarImage}
                alt="avatar"
                className={'w-full h-full rounded-lg'}
              />
            </div>
          </div>

          <div className={'flex items-center justify-between w-full pl-[160px] pt-5'}>
            <div className={'flex flex-col justify-between h-full'}>
              <div className={'flex space-x-2'}>
                <TextH3 className={'text-primary-light'}>{user.username || 'username'}</TextH3>
                <div className={'flex items-center space-x-2 bg-[#202020] py-1 px-2 rounded-[12px]'}>
                  <TextBody className={'text-[#4D94FF] leading-[16px]'}>{user && user.address ? truncateAddress(user.address) : truncateAddress(address || '')}</TextBody>
                  <img src={'/images/icons/copy.svg'} alt={'copy'} className={'cursor-pointer'} onClick={() => navigator.clipboard.writeText(user.address)} />
                </div>
              </div>

              <div className={'flex items-center space-x-3 mt-1'}>
                <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(16800)}</TextBody>
                  <TextBody className={'text-secondary'}>followers</TextBody>
                </div>
                <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(16500)}</TextBody>
                  <TextBody className={'text-secondary'}>following</TextBody>
                </div>
              </div>
            </div>
            <div className={'flex items-center space-x-4'}>
              <PrimaryButton text={'following'} className={'py-2 px-4 text-md font-medium'} />
              {
                user.address === address &&
                <GreyButton text={'settings'} className={'py-2 px-4'} onClick={() => setSettingModal(true)} />
              }
              <div className={'w-11 h-11'}>
                <Image src={'/images/icons/chat.svg'} alt={'chat'} width={44} height={44} />
              </div>
              <div className={'w-11 h-11'}>
                <ExternalLink link={user.website}>
                  <Image src={'/images/icons/website.svg'} alt={'website'} width={44} height={44} />
                </ExternalLink>
              </div>
              <div className={'w-11 h-11'}>
                <ExternalLink link={user.twitter}>
                  <Image src={'/images/icons/twitter.svg'} alt={'website'} width={44} height={44} />
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>
        <div className={'hidden lg:block'} />
      </div>
      <Dialog open={settingModal} onClose={() => setSettingModal(false)} aria-labelledby='simple-dialog-title' maxWidth={'xl'} classes={{ paper: classes.paper }}>
        <UserEdit updateModal={() => setSettingModal(false)} />
      </Dialog>
    </>
  )
}

export default UserBanner
