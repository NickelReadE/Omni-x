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
import {CalendarArea} from './CalendarArea'

const Header = (): JSX.Element => {
  const { address } = useWallet()
  const { profile } = useData()
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
      return process.env.API_URL + profile.avatar
    }
    return '/images/default_avatar.png'
  }, [profile])

  return (
    <>
      <nav className={
        classNames(
          'dark:bg-[#161616]',
          'bg-[#F6F8FC]',
          'h-[64px]',
          'px-4',
          'sm:px-6',
          'z-50',
          'fixed',
          'w-full',
        )}
      >
        <div className='flex items-center'>
          <div className='flex flex-1 items-center mr-auto space-x-[24px]'>
            <TransactionTracker />
            <SearchBar />
          </div>

          <NavMenu />

          <div className='flex flex-1 items-center justify-end ml-auto space-x-[20px]'>
            {
              address ?
                <>
                  {/*<CalendarArea />*/}
                  <MessageArea />
                  <NotificationArea />
                  <SelectNetworks />
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
