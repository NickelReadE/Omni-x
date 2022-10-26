import React, { useState } from 'react'
import Link from 'next/link'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import { Menu } from '@headlessui/react'
import useData from '../hooks/useData'
import SearchBar from './header/SearchBar'

type HeaderProps = {
  menu: string
}

type HoverType = {
  hoverMenu: string,
  isHover: boolean
}

const Header = ({ menu }: HeaderProps): JSX.Element => {
  const [hover, setHovering] = useState<HoverType>({
    hoverMenu: menu,
    isHover: false
  })

  const { pending, histories, clearHistories } = useProgress()
  const { onFaucet } = useData()


  const handleMouseOver = (hoverMenu: string) => {
    setHovering({
      hoverMenu: hoverMenu,
      isHover: true
    })
  }

  const handleMouseOut = () => {
    setHovering({
      hoverMenu: '',
      isHover: false
    })
  }

  const onClear = () => {
    clearHistories()
  }

  return (
    <>
      <nav className={
        classNames(
          'bg-[#F6F8FC]',
          'border-gray-200',
          'px-2',
          'sm:px-4',
          'py-0',
          'rounded',
          // 'dark:bg-gray-800',
          'z-50',
          'fixed',
          'w-full',
        )}
      >
        <div className='flex flex-wrap items-start'>
          <div className='absolute'>
            <div className='flex'>
              <Link href='/'>
                <button className='flex items-center'>
                  <img
                    src={'/images/logo.svg'}
                    className='mr-3 bg-contain'
                    alt="logo"
                    width='50px'
                    height='50px'
                  />
                </button>
              </Link>
              <SearchBar />
            </div>
          </div>

          {/* // Menus aligned to center on desktop */}
          <div className='justify-between h-[90px] items-center w-full md:flex md:w-auto mx-auto md:order-2' id='mobile-menu-3'>
            <ul className="flex flex-col justify-between md:flex-row md:text-sm md:font-medium h-full">
              <li className="flex items-center w-[160px]" onMouseOver={() => handleMouseOver('home')} onMouseOut={handleMouseOut}>
                <Link href='/'>
                  <a className='relative flex items-center h-full'>
                    <div className={`w-[100px] h-[40px] flex items-center justify-center ${menu === 'home' ? 'bg-black' : 'bg-transparent'} rounded-full`}>
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.8333 13.7222C23.7383 13.7227 23.6441 13.7045 23.5561 13.6686C23.4681 13.6326 23.388 13.5797 23.3206 13.5127L13 3.18496L2.67944 13.5127C2.54128 13.6311 2.36356 13.6929 2.18179 13.6859C2.00003 13.6788 1.82761 13.6035 1.69898 13.4749C1.57036 13.3462 1.49501 13.1738 1.48799 12.992C1.48097 12.8103 1.54279 12.6326 1.66111 12.4944L12.4944 1.66107C12.6298 1.52655 12.8128 1.45105 13.0036 1.45105C13.1944 1.45105 13.3775 1.52655 13.5128 1.66107L24.3461 12.4944C24.4455 12.5958 24.5128 12.7242 24.5396 12.8636C24.5664 13.0031 24.5515 13.1473 24.4968 13.2783C24.4421 13.4093 24.35 13.5213 24.232 13.6002C24.114 13.6792 23.9753 13.7216 23.8333 13.7222Z" fill={menu === 'home' ? '#F6F8FC' : '#000000'}/>
                        <path d="M13 5.6261L4.33333 14.3217V23.1111C4.33333 23.4942 4.48551 23.8616 4.7564 24.1325C5.02729 24.4034 5.39469 24.5555 5.77778 24.5555H10.8333V17.3333H15.1667V24.5555H20.2222C20.6053 24.5555 20.9727 24.4034 21.2436 24.1325C21.5145 23.8616 21.6667 23.4942 21.6667 23.1111V14.2711L13 5.6261Z" fill={menu === 'home' ? '#F6F8FC' : '#000000'}/>
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <span className={`text-lg ${hover.isHover && hover.hoverMenu == 'home'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'home' && 'hidden'}`} >HOME</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center w-[160px]" onMouseOver={() => handleMouseOver('collections')} onMouseOut={handleMouseOut}>
                <Link href='/collections'>
                  <a className='relative flex items-center h-full'>
                    <div className={`w-[100px] h-[40px] flex items-center justify-center ${menu === 'collections' ? 'bg-black' : 'bg-transparent'} rounded-full`}>
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.24999 9.75H1.08333V21.6667C1.08333 22.8692 2.04749 23.8333 3.24999 23.8333H20.5833V21.6667H3.24999V9.75Z" fill={menu === 'collections' ? '#F6F8FC' : '#000000'}/>
                        <path d="M19.5 5.41671V3.25004C19.5 2.04754 18.5358 1.08337 17.3333 1.08337H13C11.7975 1.08337 10.8333 2.04754 10.8333 3.25004V5.41671H5.41667V17.3334C5.41667 18.5359 6.38084 19.5 7.58334 19.5H22.75C23.9525 19.5 24.9167 18.5359 24.9167 17.3334V5.41671H19.5ZM13 3.25004H17.3333V5.41671H13V3.25004ZM13 16.25V8.66671L18.9583 12.4584L13 16.25Z" fill={menu === 'collections' ? '#F6F8FC' : '#000000'}/>
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <span className={`text-lg  ${hover.isHover && hover.hoverMenu == 'collections'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'collections' && 'hidden'}` }>MARKET</span>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center w-[160px]" onMouseOver={() => handleMouseOver('analytics')} onMouseOut={handleMouseOut}>
                <Link href='/launchpad'>
                  <a className='relative flex items-center h-full'>
                    <div className={`w-[100px] h-[40px] flex items-center justify-center ${menu === 'analytics' ? 'bg-black' : 'bg-transparent'} rounded-full`}>
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2803_1368)">
                          <path d="M23.1111 3.61108H2.8889C2.50581 3.61108 2.13841 3.76327 1.86753 4.03415C1.59664 4.30504 1.44446 4.67244 1.44446 5.05553V20.9444C1.44446 21.3275 1.59664 21.6949 1.86753 21.9658C2.13841 22.2367 2.50581 22.3889 2.8889 22.3889H23.1111C23.4942 22.3889 23.8616 22.2367 24.1325 21.9658C24.4034 21.6949 24.5556 21.3275 24.5556 20.9444V5.05553C24.5556 4.67244 24.4034 4.30504 24.1325 4.03415C23.8616 3.76327 23.4942 3.61108 23.1111 3.61108ZM16.2933 18.7344L11.1656 11.0933L6.58668 17.7955L3.33668 14.9066L4.33335 13.7583L6.28335 15.4844L11.1656 8.34886L16.3583 16.0839L21.4139 9.38886L22.6417 10.3133L16.2933 18.7344Z" fill={menu === 'analytics' ? '#F6F8FC' : '#000000'}/>
                        </g>
                        <defs>
                          <clipPath id="clip0_2803_1368">
                            <rect width="26" height="26" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 text-center">
                      <span className={`text-lg ${hover.isHover && hover.hoverMenu == 'analytics'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'analytics' && 'hidden'}`} >LAUNCHPAD</span>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {
            histories.length > 0 &&
              <div className={'absolute right-[250px] h-[90px] flex items-center'}>
                <div className={'relative'}>
                  <Menu>
                    <Menu.Button className={'w-[250px] h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
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

                    <Menu.Items className={'absolute top-0 w-[250px] bg-white'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
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
                      {
                        histories?.map((item, index) => {
                          return (
                            <Menu.Item key={index}>
                              <ProcessingTransaction txInfo={item} />
                            </Menu.Item>
                          )
                        })
                      }
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
          }

          <div className='absolute right-[100px] top-[25px]'>
            <button
              className='bg-transparent h-[40px] w-[126px] border-black border-[1.5px] rounded-full rounded-lg text-black font-[16px]'
              onClick={onFaucet}
            >
              Get Test OMNI
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
