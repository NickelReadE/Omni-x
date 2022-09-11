import { useState, useEffect } from 'react'
import Link from 'next/link'
import headerStyle from '../styles/header.module.scss'
import classNames from '../helpers/classNames'
import useProgress from '../hooks/useProgress'
import { getOmniInstance } from '../utils/contracts'
import useWallet from '../hooks/useWallet'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import ProcessingTransaction from './transaction/ProcessingTransaction'

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
  const { histories } = useProgress()
  const dispatch = useDispatch()
  const {
    provider,
    signer,
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
            {
              !isSearch &&
              <button
                onClick={() => setSearch(true)}
                className='flex items-center'>
                <img
                  src={'/images/logo.svg'}
                  className='mr-3 bg-contain hover:bg-[url("../public/images/logo_hover.svg")]'
                  alt="logo"
                  width='75px'
                  height='75px'
                />
              </button>
            }
            {
              isSearch &&
              <input autoFocus type="text" placeholder='Acquire Your Desires' className="flex items-center bg-[#F6F8FC] bg-[url('../public/images/search.png')] bg-contain bg-no-repeat	 w-[472px] h-[75px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0 px-[85px]" onBlur={() => setSearch(false)} onClick={() => setSearch(false)}/>
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
              <li className="flex items-center" onMouseOver={() => handleMouseOver('analytics')} onMouseOut={handleMouseOut}>
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

          <div className='absolute right-[100px] h-[90px] flex items-center flex-col overflow-y-auto'>
            {
              histories?.map((item, index) => {
                return <ProcessingTransaction txInfo={item} key={index} />
              })
            }
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header
