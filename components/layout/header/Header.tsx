import React, {useMemo} from 'react'
import {useConnectModal} from '@rainbow-me/rainbowkit'
import NavMenu from './NavMenu'
import useData from '../../../hooks/useData'
import SearchBar from './SearchBar'
import useWallet from '../../../hooks/useWallet'
import classNames from '../../../helpers/classNames'
import {SelectNetworks} from './SelectNetworks'
import {PfpMenu} from './PfpMenu'
import {NotificationArea} from './NotificationArea'
import {TransactionTracker} from './TransactionTracker'
import {MessageArea} from './MessageArea'

const S3_BUCKET_URL = process.env.S3_BUCKET_URL || ''

const Header = (): JSX.Element => {
  const { address } = useWallet()
  const { profile, onFaucet } = useData()
  const { openConnectModal } = useConnectModal()

  const onConnect = () => {
    if (!address && openConnectModal) {
      openConnectModal()
    }
  }

  const avatarImage = useMemo(() => {
    if (profile && profile.avatar) {
      if (profile.avatar.startsWith('https://ipfs.io')) {
        return profile.avatar
      }
      if (profile.avatar.startsWith('ipfs')) {
        return `https://ipfs.io/${profile.avatar}`
      }
      return S3_BUCKET_URL + profile.avatar
    }
    return '/images/default_avatar.png'
  }, [profile])

  return (
    <>
      <nav className={
        classNames(
          'bg-[#161616]',
          'h-[64px]',
          'px-8',
          'z-50',
          'fixed',
          'w-full',
        )}
      >
        <div className='flex items-center'>
          <div className={'flex items-center flex-1 space-x-[50px] md:w-auto mx-auto'}>
            <TransactionTracker />
            <NavMenu />
          </div>

          <div className='flex flex-1 items-center justify-center mr-auto'>
            <SearchBar />
          </div>

          <div className='flex flex-1 items-center justify-end ml-auto space-x-[20px]'>
            {
              address ?
                <>
                  <div className={'h-9 bg-primary-gradient text-primary px-4 py-[9px] flex items-center justify-center rounded-md cursor-pointer'} onClick={onFaucet}>$USD</div>
                  <SelectNetworks />
                  {/* <MessageArea /> */}
                  {/* <NotificationArea /> */}
                  <PfpMenu avatarImage={avatarImage} />
                </>
                :
                <div className={'w-[100px] h-[40px] bg-primary-gradient text-primary px-[16px] py-[9px] flex items-center justify-center rounded-md cursor-pointer'} onClick={onConnect}>connect</div>
            }
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
