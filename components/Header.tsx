import { useState, useEffect } from 'react'
import Link from 'next/link'
import headerStyle from '../styles/header.module.scss'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import Image from 'next/image'
import logo from '../public/images/logo.png'
import arrowUp from '../public/images/arrowUp.png'
import arrowDown from '../public/images/arrowDown.png'
import arrowRight from '../public/images/arrowRight.png'
import loading from '../public/images/loading.gif'
import optimism from '../public/sidebar/optimism.png'
import ethereum from '../public/sidebar/ethereum.png'
import binance from '../public/sidebar/binance.png'
import polygon from '../public/sidebar/polygon.png'
import avax from '../public/sidebar/avax.png'
import arbitrum from '../public/sidebar/arbitrum.png'
import fantom from '../public/sidebar/fantom.png'
import { getOmniInstance } from '../utils/contracts'
import useWallet from '../hooks/useWallet'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../redux/reducers/snackBarReducer'

import { getSearchText } from '../redux/reducers/headerReducer'

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
  const [expand, setExpand] = useState(false)
  const { txInfo, pending } = useProgress()
  const {
    provider,
    signer,
    address
  } = useWallet()

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

  const dispatch = useDispatch()

  const handleChangeInput = (text: string) => {
    dispatch(getSearchText(text) as any)
  }
  const onOmniFaucet = async () => {
    const chainId = provider?.network.chainId as number
    const omni = getOmniInstance(chainId, signer)

    await omni.mint({ gasLimit: '300000' })

    dispatch(openSnackBar({ message: 'You will receive an 1000 $OMNI soon', status: 'success' }))
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
              <button className='flex items-center mt-[20px]'>
                <img
                  src={'/images/logo.svg'}
                  className='mr-3 bg-contain'
                  alt="logo"
                  width='50px'
                  height='50px'
                />
              </button>
              <input autoFocus type="text" placeholder='Search' className="flex items-center bg-[#F6F8FC] bg-[url('../public/images/search.png')] bg-contain bg-no-repeat	 w-[248px] h-[40px] mt-[25px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0 px-[85px]" onChange={e => handleChangeInput(e.target.value)}/>
            </div>
          </div>

          <div className='absolute right-[100px] top-[20px]'>
            <button className='bg-gradient-to-br from-[#F3F9FF] to-[#DBE1E9] border-2 border-[#A0B3CC] rounded-lg text-black text-lg p-[10px]' onClick={() => onOmniFaucet()}>Get Test OMNI</button>
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
            pending &&
            <div className={'rounded-[8px] w-[200px] md:order-2 mr-[70px] px-4 flex flex-col justify-center shadow-md ' + (expand ? 'h-[80px]' : 'h-[40px]')}>
              <div className="flex items-center justify-between">
                <span className="text-lg">Processing</span>
                <Image src={loading} alt="loading" width={30} height={30} />
                {
                  expand
                    ?
                    <Image src={arrowUp} alt="arrowUp" onClick={() => setExpand(!expand)} />
                    :
                    <Image src={arrowDown} alt="arrowDown" onClick={() => setExpand(!expand)} />
                }
              </div>
              {
                expand &&
                (
                  txInfo?.type === 'bridge'
                    ?
                    <div className='flex items-center justify-between'>
                      {
                        (txInfo?.senderChainId === 4 || txInfo?.senderChainId === 4) &&
                          <Image src={ethereum} alt="ethereum" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 97 || txInfo?.senderChainId === 97) &&
                          <Image src={binance} alt="binance" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 43113 || txInfo?.senderChainId === 43113) &&
                          <Image src={avax} alt="avax" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 80001 || txInfo?.senderChainId === 80001) &&
                          <Image src={polygon} alt="polygon" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 421611 || txInfo?.senderChainId === 421611) &&
                          <Image src={arbitrum} alt="arbitrum" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 69 || txInfo?.senderChainId === 69) &&
                          <Image src={optimism} alt="optimism" width={20} height={20} />
                      }
                      {
                        (txInfo?.senderChainId === 4002 || txInfo?.senderChainId === 4002) &&
                          <Image src={fantom} alt="fantom" width={20} height={20} />
                      }
                      <Image src={arrowRight} alt="arrowRight" />
                      {
                        (txInfo?.targetChainId === 4 || txInfo?.targetChainId === 4) &&
                        <Image src={ethereum} alt="ethereum" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 97 || txInfo?.targetChainId === 97) &&
                        <Image src={binance} alt="binance" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 43113 || txInfo?.targetChainId === 43113) &&
                        <Image src={avax} alt="avax" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 80001 || txInfo?.targetChainId === 80001) &&
                        <Image src={polygon} alt="polygon" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 421611 || txInfo?.targetChainId === 421611) &&
                        <Image src={arbitrum} alt="arbitrum" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 69 || txInfo?.targetChainId === 69) &&
                        <Image src={optimism} alt="optimism" width={20} height={20} />
                      }
                      {
                        (txInfo?.targetChainId === 4002 || txInfo?.targetChainId === 4002) &&
                        <Image src={fantom} alt="fantom" width={20} height={20} />
                      }
                      <span className="text-md text-gray-500 w-[87px] truncate">{txInfo?.itemName}</span>
                    </div>
                    :
                    <div />
                )
              }
            </div>
          }
        </div>
      </nav>
    </>
  )
}

export default Header