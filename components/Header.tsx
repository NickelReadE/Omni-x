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
import clear from '../public/images/clear.png'
import viewExplorer from '../public/images/viewExplorer.png'
import optimism from '../public/sidebar/optimism_small.png'
import ethereum from '../public/sidebar/ethereum_small.png'
import binance from '../public/sidebar/binance_small.png'
import polygon from '../public/sidebar/polygon_small.png'
import avax from '../public/sidebar/avax_small.png'
import arbitrum from '../public/sidebar/arbitrum_small.png'
import fantom from '../public/sidebar/fantom_small.png'
import { getBlockExplorer } from '../utils/constants'

type HeaderProps = {
  menu: string
}

type HoverType = {
  hoverMenu: string,
  isHover: boolean
}

const Header = ({ menu }: HeaderProps): JSX.Element => {
  const [isSearch, setSearch] = useState(false)
  const [hover, setHovering] = useState<HoverType>({
    hoverMenu: menu,
    isHover: false
  })
  const [expand, setExpand] = useState(false)
  const { txInfo, pending, setPendingTxInfo } = useProgress()

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

  const onViewExplorer = () => {
    if (pending && txInfo && txInfo.txHash && txInfo.senderChainId) {
      const explorer = getBlockExplorer(txInfo.senderChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.txHash}`, '_blank')
      }
    }
  }

  const onViewExplorerOnDest = () => {
    if (pending && txInfo && txInfo.destTxHash && txInfo.targetChainId) {
      const explorer = getBlockExplorer(txInfo.targetChainId)
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.destTxHash}`, '_blank')
      }
    }
  }

  const onClear = () => {
    setPendingTxInfo(null)
  }

  return (
    <>
      <nav className={
        classNames(
          'bg-[#F8F9FA]',
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
            {
              !isSearch &&
              <button
                onClick={() => setSearch(true)}
                className='flex items-center'>
                <img
                  src={'/images/logo.svg'}
                  className='mr-3 hover:bg-[url("../public/images/logo_hover.svg")]'
                  alt="logo"
                />
              </button>
            }
            {
              isSearch &&
              <input autoFocus type="text" placeholder='Acquire Your Desires' className="flex items-center bg-[#F8F9FA] bg-[url('../public/images/search.png')] w-[472px] h-[88px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0 px-[85px]" onBlur={() => setSearch(false)} onClick={() => setSearch(false)} />
            }
          </div>

          <div className='min-w-[200px]'></div>
          <div className='justify-between items-center w-full md:flex md:w-auto mx-auto md:order-2' id='mobile-menu-3'>
            <ul className="flex flex-col md:flex-row md:space-x-8 md:text-sm md:font-medium" >
              <li onMouseOver={() => handleMouseOver('home')} onMouseOut={handleMouseOut}>
                <Link href='/'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{ backgroundImage: `url('/navbar/home${menu == 'home' ? '_active' : (hover.isHover && hover.hoverMenu == 'home' ? '_hover' : '')}.svg')` }}>
                      <div className="relative top-full text-center">
                        <span className={`px-10 py-2 text-lg bg-[#f1f1f1] rounded-[25px] ${hover.isHover && hover.hoverMenu == 'home' ? 'text-[#1E1C21] font-bold' : 'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu ? '' : 'hidden'}`} >HOME</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li onMouseOver={() => handleMouseOver('collections')} onMouseOut={handleMouseOut}>
                <Link href='/collections'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{ backgroundImage: `url('/navbar/collections${menu == 'collections' ? '_active' : (hover.isHover && hover.hoverMenu == 'collections' ? '_hover' : '')}.svg')` }}>
                      <div className="relative top-full text-center">
                        <span className={`px-10 py-2 text-lg bg-[#f1f1f1] rounded-[25px] ${hover.isHover && hover.hoverMenu == 'collections' ? 'text-[#1E1C21] font-bold' : 'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu ? '' : 'hidden'}`} >MARKET</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
              <li onMouseOver={() => handleMouseOver('analytics')} onMouseOut={handleMouseOut}>
                <Link href='/launchpad'>
                  <a>
                    <div className="w-[219px] h-[90px] bg-no-repeat bg-center" style={{ backgroundImage: `url('/navbar/analytics${menu == 'analytics' ? '_active' : (hover.isHover && hover.hoverMenu == 'analytics' ? '_hover' : '')}.svg')` }}>
                      <div className="relative top-full text-center">
                        <span className={`px-10 py-2 text-lg bg-[#f1f1f1] rounded-[25px] ${hover.isHover && hover.hoverMenu == 'analytics' ? 'text-[#1E1C21] font-bold' : 'text-[#ADB5BD]'} ${hover.isHover && hover.hoverMenu != menu ? '' : 'hidden'}`} >LAUNCHPAD</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {
            pending &&
            <div className={'rounded-[8px] w-[250px] md:order-2 mr-[70px] px-4 flex flex-col justify-center shadow-md ' + (expand ? 'h-[80px]' : 'h-[40px]')}>
              <div className="flex items-center justify-between">
                <span className="text-lg">
                  {(pending && txInfo && txInfo.destTxHash) ? 'last transaction' : 'processing'}
                </span>
                {
                  !(pending && txInfo && txInfo.destTxHash)
                    ?
                    <Image src={loading} alt="loading" width={30} height={30} />
                    :
                    <Image src={clear} alt="clear" width={30} height={30} style={{ cursor: 'pointer' }} onClick={onClear} />
                }
                {
                  expand
                    ?
                    <Image src={arrowUp} alt="arrowUp" style={{ cursor: 'pointer' }} onClick={() => setExpand(!expand)} />
                    :
                    <Image src={arrowDown} alt="arrowDown" style={{ cursor: 'pointer' }} onClick={() => setExpand(!expand)} />
                }
              </div>
              {
                expand &&
                (
                  txInfo?.type === 'bridge'
                    ?
                    <div className='flex items-center justify-between'>
                      <Image src={viewExplorer} alt="view Explorer" width={20} height={20} style={{ cursor: 'pointer' }} onClick={onViewExplorer} />
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
                      <Image
                        src={viewExplorer}
                        alt="view Explorer"
                        width={20}
                        height={20}
                        style={{ cursor: (pending && txInfo && txInfo.destTxHash) ? 'pointer' : 'auto', opacity: (pending && txInfo && txInfo.destTxHash) ? 1 : 0.4 }}
                        onClick={onViewExplorerOnDest}
                      />
                      <span className="text-md text-gray-500 w-[90px] truncate">{txInfo?.itemName}</span>
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