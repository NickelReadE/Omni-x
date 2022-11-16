import React, {useMemo} from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import {useConnectModal} from '@rainbow-me/rainbowkit'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import NavMenu from './layout/header/NavMenu'
import useProgress from '../hooks/useProgress'
import useData from '../hooks/useData'
import SearchBar from './layout/header/SearchBar'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import HomeLogo from '../public/images/icons/home_logo.svg'
import {SelectNetworks} from './layout/header/SelectNetworks'
import {PfpMenu} from './layout/header/PfpMenu'
import {NotificationArea} from './layout/header/NotificationArea'

const Header = (): JSX.Element => {
  const { address } = useWallet()
  const { profile } = useData()
  const { pending, histories, clearHistories } = useProgress()
  const { openConnectModal } = useConnectModal()

  const onClear = () => {
    clearHistories()
  }

  const onConnect = () => {
    if (!address && openConnectModal) {
      openConnectModal()
    }
  }

  const avatarImage = useMemo(() => {
    if (profile && profile.avatar) {
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
            <Link href='/'>
              <button className='flex items-center'>
                <HomeLogo />
              </button>
            </Link>
            <SearchBar />
          </div>

          <NavMenu />

          <div className='flex flex-1 items-center justify-end ml-auto space-x-[20px]'>
            {
              address ?
                <>
                  <NotificationArea />
                  <SelectNetworks />
                  <PfpMenu avatarImage={avatarImage} />
                </>
                :
                <div className={'w-[100px] h-[40px] bg-primary-gradient text-primary px-[16px] py-[9px] flex items-center justify-center rounded-md cursor-pointer'} onClick={onConnect}>connect</div>
            }
          </div>

          {
            histories.length > 0 &&
              <div className={'absolute right-[250px] h-[64px] flex items-center'}>
                <div className={'relative'}>
                  <Menu>
                    <Menu.Button className={'w-[250px] h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between outline-0'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                      <div className={'flex items-center'}>
                        {pending ? 'processing' : 'last transactions'}
                        {
                          pending
                            ?
                            <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                            :
                            <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                        }
                      </div>
                      <div className={'flex items-center'}>
                        <img width={15} height={15} src={'/images/refresh_round.png'} onClick={onClear} alt="nft-image" />
                        <img width={10} height={6} src={'/images/arrowDown.png'} style={{marginLeft: 10}} alt="nft-image" />
                      </div>
                    </Menu.Button>

                    <Menu.Items className={'absolute top-0 w-[250px] bg-white outline-0'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                      <div className={'h-[38px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}>
                        <div className={'flex items-center'}>
                          {pending ? 'processing' : 'last transactions'}
                          {
                            pending
                              ?
                              <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                              :
                              <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                          }
                        </div>
                        <div className={'flex items-center'}>
                          <img width={10} height={6} src={'/images/arrowUp.png'} alt="nft-image" />
                        </div>
                      </div>
                      <div className='overflow-y-auto overflow-x-hidden max-h-[280px]'>
                        {
                          histories.map((item, index) => {
                            return (
                              <Menu.Item key={index}>
                                <ProcessingTransaction txInfo={item} />
                              </Menu.Item>
                            )
                          })
                        }
                      </div>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
          }
        </div>
      </nav>
    </>
  )
}

export default Header
