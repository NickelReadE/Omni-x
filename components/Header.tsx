import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import { Menu } from '@headlessui/react'
import useData from '../hooks/useData'
import SearchBar from './layout/header/SearchBar'
import { chainInfos, SUPPORTED_CHAIN_IDS } from '../utils/constants'
import { ChainIds } from '../types/enum'
import useWallet from '../hooks/useWallet'

type HeaderProps = {
  menu: string
}

const Header = ({ menu }: HeaderProps): JSX.Element => {
  const { chainId } = useWallet()
  const { profile, onFaucet } = useData()
  const { pending, histories, clearHistories } = useProgress()

  const [avatarError, setAvatarError] = useState(false)

  const onClear = () => {
    clearHistories()
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
        <div className='flex flex-wrap items-center justify-between'>
          <div className='flex items-center'>
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
                <span className='text-[#F5F5F5] font-[450] text-[32px] leading-[38px] ml-3'>
                  omni x
                </span>
              </button>
            </Link>
            <SearchBar />
          </div>

          <div className='flex items-center ml-auto space-x-8'>
            <span className='text-[20px] leading-[24px] text-[#969696]'>
              Launchpad
            </span>
            <Link href='/'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.1" cx="20" cy="20" r="20" fill="#303030"/>
                <path d="M20.224 26.802C23.8839 26.802 26.8508 23.8351 26.8508 20.1752C26.8508 16.5153 23.8839 13.5483 20.224 13.5483C16.5641 13.5483 13.5972 16.5153 13.5972 20.1752C13.5972 23.8351 16.5641 26.802 20.224 26.802Z" stroke="#969696" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round"/>
                <path d="M10.4029 27.5156C8.83326 25.3959 7.99048 22.8259 8.00008 20.1884C8.00968 17.5509 8.87114 14.987 10.4561 12.8789M27.5254 30.0556C25.4066 31.6296 22.8355 32.4759 20.196 32.4682C17.5566 32.4606 14.9905 31.5994 12.8808 30.0132M30.0329 12.9143C31.6101 15.0275 32.4623 17.5938 32.4623 20.2307C32.4623 22.8676 31.6101 25.4339 30.0329 27.5471M12.9282 10.4197C15.0466 8.84283 17.6186 7.99399 20.2595 8.00003C22.9004 8.00608 25.4684 8.86668 27.5797 10.4532" stroke="#969696" strokeWidth="1.5" strokeMiterlimit="10"/>
              </svg>
            </Link>
            <Link href='/'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.1" cx="20" cy="20" r="20" fill="#303030"/>
                <path d="M22.3145 20.2295L26.552 24.467L30.7895 20.2295" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M26.5518 11.4668V24.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.3145 11.4668V21.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="22.3145" y1="29.4668" x2="31.3145" y2="29.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8.31445" y1="29.4668" x2="17.3145" y2="29.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8.31445" y1="25.4668" x2="17.3145" y2="25.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round"/>
                <line x1="26.3145" y1="11.4668" x2="13.3145" y2="11.4668" stroke="#969696" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link href='/'>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.1" cx="20" cy="20" r="20" fill="#303030"/>
                <path d="M27 27H14.0845L10.9292 9.7425C10.8922 9.53583 10.7839 9.3485 10.6228 9.21291C10.4617 9.07732 10.258 9.00201 10.047 9H8" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.5 32C16.8807 32 18 30.8807 18 29.5C18 28.1193 16.8807 27 15.5 27C14.1193 27 13 28.1193 13 29.5C13 30.8807 14.1193 32 15.5 32Z" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27.5 32C28.8807 32 30 30.8807 30 29.5C30 28.1193 28.8807 27 27.5 27C26.1193 27 25 28.1193 25 29.5C25 30.8807 26.1193 32 27.5 32Z" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.6399 23H27.8446C28.2676 23.0013 28.6774 22.8542 29.0022 22.5847C29.3269 22.3152 29.5458 21.9404 29.6202 21.5262L31 14H12" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <div className='w-[40px] h-[40px]'>
              {
                SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                  return chainId === networkId && <img key={index} alt={'networkIcon'} src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="m-auto h-[45px]" />
                })
              }
            </div>
            <div className='w-[40px] h-[40px]'>
              <Image
                src={avatarImage}
                alt="avatar"
                onError={() => { profile && profile.avatar && setAvatarError(true) }}
                width={40}
                height={40}
                className='rounded-full'
              />
            </div>
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
                      <div className='overflow-auto max-h-[280px]'>
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
