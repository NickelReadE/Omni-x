import React, { Fragment, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import useWallet from '../hooks/useWallet'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import ProcessingTransaction from './transaction/ProcessingTransaction'
import { Menu } from '@headlessui/react'
import { updateRefreshBalance } from '../redux/reducers/userReducer'
import { getOmniInstance, getUSDCInstance } from '../utils/contracts'
import { ContractName, getAddressByName, STABLECOIN_DECIMAL } from '../utils/constants'
import useSearch from '../hooks/useSearch'

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
  const [query, setQuery] = useState('')
  const { pending, histories, clearHistories } = useProgress()
  const dispatch = useDispatch()
  const { signer, chainId } = useWallet()
  const { collections, profiles } = useSearch(query)

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

  const onOmniFaucet = async () => {
    if (!signer || !chainId) return

    // faucet omni
    try {
      const omni = getOmniInstance(chainId, signer)

      const tx = await omni.mint({ gasLimit: '300000' })
      await tx.wait()

      dispatch(openSnackBar({ message: 'You received an 10000 $OMNI', status: 'success' }))
    } catch (e) {
      console.error('While fauceting OMNI token', e)
    }

    // faucet usdc/usdt
    try {
      let currencyName: ContractName = 'USDC'
      let currencyAddr = getAddressByName(currencyName, chainId)
      if (!currencyAddr) {
        currencyName = 'USDT'
        currencyAddr = getAddressByName(currencyName, chainId)
      }

      const usdc = getUSDCInstance(currencyAddr, chainId, signer)
      if (usdc) {
        const decimal = STABLECOIN_DECIMAL[chainId][currencyAddr] || 6
        const tx = await usdc.mint(await signer.getAddress(), ethers.utils.parseUnits('1000', decimal), { gasLimit: '300000' })
        await tx.wait()

        dispatch(openSnackBar({ message: `You received an 1000 $${currencyName}`, status: 'success' }))
      }
      else {
        dispatch(openSnackBar({ message: `Not support $${currencyName} on this chain`, status: 'warning' }))
      }
    } catch (e) {
      console.error('While fauceting USDC/USDT token', e)
    }

    dispatch(updateRefreshBalance())
  }

  const onClear = () => {
    clearHistories()
  }

  const debounce = (func: any, wait: any) => {
    let timerId: any
    return (...args: any) => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        func(...args)
      }, wait)
    }
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
              <div className={'h-[90px] flex items-center'}>
                <div className={'relative'}>
                  {
                    <div className={query !== '' ? 'absolute w-[250px] bg-white' : 'w-[250px]'} style={query !== '' ? { borderRadius: '20px', border: '1.5px solid #000000', top: -20 } : {}}>
                      <div className={'h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={query !== '' ? { borderTopLeftRadius: '20px', borderTopRightRadius: '20px' } : { borderRadius: '20px', border: '1.5px solid #000000' }}>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                        </svg>
                        <input
                          autoFocus
                          type="text"
                          placeholder='Search'
                          className="flex items-center bg-transparent w-[248px] h-[40px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0"
                          onChange={debounce((e: any) => {
                            setQuery(e.target.value)
                          }, 500)}
                        />
                      </div>
                      {
                        query !== '' && 
                        <div className='p-3'>
                          <div className="text-[#A0B3CC]" style={{fontSize: 15, lineHeight: '19px'}}>Collections</div>
                          {
                            collections.map((item, index) => {
                              return (
                                <div className='my-2 font-bold' key={index}>
                                  <Link href={`/collections/${item.col_url}`}>
                                    {item.name}
                                  </Link>
                                </div>
                              )
                            })
                          }
                          {
                            collections.length === 0 &&
                            <div className='my-2 font-bold'>No results found</div>
                          }
                          <div className="text-[#A0B3CC] mt-4" style={{ fontSize: 15, lineHeight: '19px' }}>Profiles</div>
                          {
                            profiles.map((item, index) => {
                              return (
                                <div className='my-2 font-bold truncate' key={index}>
                                  <Link href={`/user/${item.address}`}>
                                    {item.address}
                                  </Link>
                                </div>
                              )
                            })
                          }
                          {
                            profiles.length === 0 &&
                              <div className='my-2 font-bold'>No results found</div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <div className='min-w-[200px]'></div> */}
          <div className='justify-between h-[90px] items-center w-full md:flex md:w-auto mx-auto md:order-2' id='mobile-menu-3'>
            <ul className="flex flex-col justify-between md:flex-row md:space-x-8 md:text-sm md:font-medium" >
              <li className="flex items-center" onMouseOver={() => handleMouseOver('home')} onMouseOut={handleMouseOut}>
                <Link href='/'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/home${menu == 'home' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={`text-lg  ${hover.isHover && hover.hoverMenu == 'home'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'home' && 'hidden'}`} >HOME</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center" onMouseOver={() => handleMouseOver('collections')} onMouseOut={handleMouseOut}>
                <Link href='/collections'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/collections${menu == 'collections' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={` text-lg  ${hover.isHover && hover.hoverMenu == 'collections'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} ${menu == 'collections' && 'hidden'}` }>MARKET</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li className="flex items-center" onMouseOver={() => handleMouseOver('analytics')} onMouseOut={handleMouseOut}>
                <Link href='/launchpad'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{backgroundImage: `url('/navbar/analytics${menu == 'analytics' ? '_active' : ''}.svg')`}}>
                      <div className="relative top-3/4 text-center">
                        <span className={`text-lg ${hover.isHover && hover.hoverMenu == 'analytics'?'text-[#000000] font-bold':'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu?'':'hidden'} {menu == 'analytics' && 'hidden'}`} >LAUNCHPAD</span>
                      </div>
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

          <div className='absolute right-[100px] top-[20px]'>
            <button className='bg-gradient-to-br from-[#F3F9FF] to-[#DBE1E9] border-2 border-[#A0B3CC] rounded-lg text-black text-lg p-[10px]' onClick={() => onOmniFaucet()}>Get Test OMNI</button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
