/* eslint-disable react-hooks/exhaustive-deps */
import React, {useMemo, useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import {makeStyles} from '@material-ui/core/styles'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import { ProfileData } from '../hooks/useProfile'
import { truncateAddress } from '../utils/utils'
import {ExternalLink} from './basic'
import WebsiteIcon from '../public/images/icons/website.svg'
import InstagramIcon from '../public/images/icons/instagram.svg'
import TwitterIcon from '../public/images/icons/twitter.svg'
import UserEdit from './user/UserEdit'
import {PrimaryButton} from './common/buttons/PrimaryButton'
import {GreyButton} from './common/buttons/GreyButton'
import {formatAmount} from '../utils/numbers'

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
            <div className={'flex items-center'}>
              <div className={'flex flex-col space-y-2'}>
                <span className={'text-xg1 text-primary-light'}>{user.username || 'username'}</span>
                <span className={'text-md text-secondary'}>{user && user.address ? truncateAddress(user.address) : truncateAddress(address || '')}</span>
              </div>
            </div>
            <div className={'flex items-center'}>
              <div className={'flex flex-col h-[60px] items-end justify-between space-y-2 mr-4'}>
                <div className={'w-[90px]'}>
                  <PrimaryButton text={'following'} className={'h-[24px] text-md font-medium'} />
                </div>
                <div className={'flex items-center'}>
                  <span className={'text-md text-primary-light'}>{formatAmount(16800)} followers</span>
                  <span className={'text-md text-primary-light ml-2'}>{formatAmount(16500)} following</span>
                </div>
              </div>
              {/*Social links*/}
              <div className={'flex items-center space-x-3'}>
                <div className={`flex flex-col h-[60px] items-end ${user.address === address ? 'justify-between' : 'justify-center'} space-y-2`}>
                  {
                    user.address === address &&
                      <GreyButton text={'settings'} className={'h-[26px]'} onClick={() => setSettingModal(true)} />
                  }
                  <div className={'flex items-center'}>
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
                      <ExternalLink link={user.instagram}>
                        <InstagramIcon />
                      </ExternalLink>
                    </div>
                  </div>
                </div>
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
