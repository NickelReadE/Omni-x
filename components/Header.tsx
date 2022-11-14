import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu } from '@headlessui/react'
import {useConnectModal} from '@rainbow-me/rainbowkit'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import NavMenu from './layout/header/NavMenu'
import useProgress from '../hooks/useProgress'
import useData from '../hooks/useData'
import SearchBar from './layout/header/SearchBar'
import useWallet from '../hooks/useWallet'
import classNames from '../helpers/classNames'
import { chainInfos } from '../utils/constants'
import { ChainIds } from '../types/enum'

const Header = (): JSX.Element => {
  const { chainId, address } = useWallet()
  const { profile } = useData()
  const { pending, histories, clearHistories } = useProgress()
  const { openConnectModal } = useConnectModal()

  const [avatarError, setAvatarError] = useState(false)

  const onClear = () => {
    clearHistories()
  }

  const onConnect = () => {
    if (!address && openConnectModal) {
      openConnectModal()
    }
  }

  const avatarImage = useMemo(() => {
    if (!avatarError && profile && profile.avatar) {
      return process.env.API_URL + profile.avatar
    }
    return '/images/default_avatar.png'
  }, [profile, avatarError])

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
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.9906 28.2101C24.5654 28.2101 28.2741 24.5015 28.2741 19.9266C28.2741 15.3517 24.5654 11.6431 19.9906 11.6431C15.4157 11.6431 11.707 15.3517 11.707 19.9266C11.707 24.5015 15.4157 28.2101 19.9906 28.2101Z" stroke="url(#paint0_linear_1_2065)" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round"/>
                  <path d="M7.71402 29.102C5.75203 26.4524 4.69855 23.2399 4.71055 19.943C4.72255 16.6461 5.79938 13.4413 7.78061 10.8061M29.1172 32.2771C26.4687 34.2445 23.2548 35.3024 19.9555 35.2928C16.6562 35.2833 13.4485 34.2067 10.8114 32.224M32.2516 10.8504C34.2231 13.4919 35.2883 16.6998 35.2883 19.9959C35.2883 23.2921 34.2231 26.4999 32.2516 29.1414M10.8706 7.73209C13.5188 5.76105 16.7337 4.7 20.0348 4.70756C23.3359 4.71512 26.546 5.79087 29.185 7.77401" stroke="url(#paint1_linear_1_2065)" strokeWidth="2" strokeMiterlimit="10"/>
                  <defs>
                    <linearGradient id="paint0_linear_1_2065" x1="14.8134" y1="11.6431" x2="28.9647" y2="15.0608" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00F0EC"/>
                      <stop offset="1" stopColor="#16FFC5"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1_2065" x1="10.4438" y1="4.70752" x2="36.5637" y2="11.0142" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00F0EC"/>
                      <stop offset="1" stopColor="#16FFC5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </Link>
            <SearchBar />
          </div>

          <NavMenu />

          <div className='flex flex-1 items-center justify-end ml-auto space-x-[20px]'>
            {
              address ?
                <>
                  <Link href='/'>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle opacity="0.1" cx="16" cy="16" r="16" fill="#F5F5F5"/>
                      <path d="M8.37412 12.9145C8.37278 11.966 8.5591 11.0267 8.92234 10.1506C9.28558 9.27452 9.81856 8.47894 10.4906 7.8097C11.1626 7.14046 11.9604 6.61079 12.838 6.2512C13.7156 5.8916 14.6557 5.70919 15.6041 5.71447C19.5641 5.74447 22.7341 9.03447 22.7341 13.0045V13.7145C22.7341 17.2945 23.4841 19.3745 24.1441 20.5145C24.2142 20.6359 24.2512 20.7736 24.2513 20.9138C24.2514 21.054 24.2147 21.1917 24.1448 21.3132C24.0749 21.4348 23.9744 21.5358 23.8531 21.6062C23.7319 21.6766 23.5943 21.714 23.4541 21.7145H7.65412C7.51393 21.714 7.37633 21.6766 7.2551 21.6062C7.13388 21.5358 7.03329 21.4348 6.96341 21.3132C6.89353 21.1917 6.85681 21.054 6.85693 20.9138C6.85706 20.7736 6.89402 20.6359 6.96412 20.5145C7.62412 19.3745 8.37412 17.2945 8.37412 13.7145V12.9145Z" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.354 21.7144V22.5144C12.354 23.363 12.6911 24.177 13.2913 24.7771C13.8914 25.3772 14.7053 25.7144 15.554 25.7144C16.4027 25.7144 17.2166 25.3772 17.8167 24.7771C18.4169 24.177 18.754 23.363 18.754 22.5144V21.7144" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <div className='w-[32px] h-[32px]'>
                    <img alt={'networkIcon'} src={chainInfos[chainId || ChainIds.ETHEREUM].logo} className="h-full w-full" />
                  </div>
                  <div className='w-[32px] h-[32px]'>
                    <Image
                      src={avatarImage}
                      alt="avatar"
                      onError={() => { profile && profile.avatar && setAvatarError(true) }}
                      width={32}
                      height={32}
                      className='rounded-full'
                    />
                  </div>
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

          {/* <div className='absolute right-[100px] top-[25px]'>
            <button
              className='bg-transparent h-[40px] w-[126px] border-black border-[1.5px] rounded-full text-black font-[16px]'
              onClick={onFaucet}
            >
              Get Test OMNI
            </button>
          </div> */}
        </div>
      </nav>
    </>
  )
}

export default Header
