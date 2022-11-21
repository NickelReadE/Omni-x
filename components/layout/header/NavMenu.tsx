import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

export default function NavMenu() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = React.useState<number | undefined>()

  const activeClass = (index: number) => {
    return index === hoveredId ? 'bg-secondary' : 'bg-primary-gradient'
  }

  const menu = useMemo(() => {
    if (router.pathname.includes('/collections')) {
      return 'collections'
    } else if (router.pathname === '/launchpad') {
      return 'launchpad'
    } else if (router.pathname === '/analytics') {
      return 'analytics'
    } else if (router.pathname === '/' || router.pathname === '/learn-more') {
      return 'home'
    } else {
      return 'others'
    }
  }, [router.pathname])

  return (
    <div className='h-full w-full flex justify-center flex-1 md:w-auto mx-auto'>
      <ul className="flex flex-col justify-between md:flex-row md:text-sm md:font-medium h-full">
        <li className="flex w-[92px]">
          <Link href='/'>
            <a className='relative flex items-center h-full'>
              <div className={`w-[100px] h-[40px] pb-1 ${menu === 'home' && 'bg-primary-gradient'} ${activeClass(0)}`} onMouseEnter={() => setHoveredId(0)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex justify-center ${(menu === 'home' || hoveredId === 0) ? 'h-[39px]' : 'h-[40px]'}`}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.625 22.7501V17.5001C16.625 17.268 16.5328 17.0455 16.3687 16.8814C16.2046 16.7173 15.9821 16.6251 15.75 16.6251H12.25C12.0179 16.6251 11.7954 16.7173 11.6313 16.8814C11.4672 17.0455 11.375 17.268 11.375 17.5001V22.7501C11.375 22.9822 11.2828 23.2047 11.1187 23.3688C10.9546 23.5329 10.7321 23.6251 10.5 23.6251H5.25C5.01794 23.6251 4.79538 23.5329 4.63128 23.3688C4.46719 23.2047 4.375 22.9822 4.375 22.7501V12.6329C4.37696 12.5118 4.40313 12.3924 4.45197 12.2815C4.50081 12.1707 4.57133 12.0708 4.65937 11.9876L13.4094 4.03605C13.5707 3.88848 13.7814 3.80664 14 3.80664C14.2186 3.80664 14.4293 3.88848 14.5906 4.03605L23.3406 11.9876C23.4287 12.0708 23.4992 12.1707 23.548 12.2815C23.5969 12.3924 23.623 12.5118 23.625 12.6329V22.7501C23.625 22.9822 23.5328 23.2047 23.3687 23.3688C23.2046 23.5329 22.9821 23.6251 22.75 23.6251H17.5C17.2679 23.6251 17.0454 23.5329 16.8813 23.3688C16.7172 23.2047 16.625 22.9822 16.625 22.7501Z" fill={menu === 'home' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <defs>
                      <linearGradient id="paint0_linear_185_8613" x1="7.98438" y1="3.80664" x2="24.4789" y2="7.67595" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00F0EC"/>
                        <stop offset="1" stopColor="#16FFC5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </a>
          </Link>
        </li>
        <li className="flex w-[92px]">
          <Link href='/launchpad'>
            <a className='relative flex items-center h-full'>
              <div className={`w-[100px] h-[40px] pb-1 ${menu === 'launchpad' && 'bg-primary-gradient'} ${activeClass(1)}`} onMouseEnter={() => setHoveredId(1)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex justify-center ${(menu === 'launchpad' || hoveredId === 1) ? 'h-[39px]' : 'h-[40px]'}`}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.2922 20.1908C9.04531 23.8986 4.10156 23.8986 4.10156 23.8986C4.10156 23.8986 4.10156 18.9549 7.80938 17.708" fill={menu === 'launchpad' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <path d="M20.1906 12.7642V19.8298C20.1873 20.0606 20.093 20.2807 19.9281 20.4423L16.3953 23.986C16.2832 24.098 16.1429 24.1774 15.9892 24.2158C15.8355 24.2543 15.6743 24.2502 15.5227 24.2042C15.3711 24.1582 15.2349 24.0718 15.1285 23.9544C15.0221 23.837 14.9496 23.693 14.9187 23.5376L14 18.9548" fill={menu === 'launchpad' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <path d="M15.2361 7.80957H8.17048C7.93968 7.81286 7.71953 7.90721 7.55798 8.07207L4.01423 11.6049C3.90227 11.717 3.82285 11.8573 3.78443 12.011C3.74601 12.1647 3.75003 12.3259 3.79606 12.4775C3.8421 12.6291 3.92842 12.7653 4.04582 12.8717C4.16322 12.9781 4.30729 13.0506 4.46266 13.0814L9.04548 14.0002" fill={menu === 'launchpad' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <path d="M13.6465 19.3082L14.0001 19.6617L14.3537 19.3082L21.7802 11.8816C24.7304 8.93142 24.7155 5.94766 24.525 4.63373C24.4851 4.3405 24.3503 4.06837 24.141 3.85907C23.9317 3.64978 23.6595 3.5149 23.3663 3.47507C22.0524 3.28451 19.0686 3.26962 16.1184 6.21982L8.69186 13.6464L8.3383 13.9999L8.69186 14.3535L13.6465 19.3082Z" fill={menu === 'launchpad' ? 'url(#paint0_linear_185_8613)' : '#969696'} stroke="#161616" strokeLinecap="round"/>
                    <linearGradient id="paint0_linear_185_8613" x1="7.98438" y1="3.80664" x2="24.4789" y2="7.67595" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00F0EC"/>
                      <stop offset="1" stopColor="#16FFC5"/>
                    </linearGradient>
                  </svg>
                </div>
              </div>
            </a>
          </Link>
        </li>
        <li className="flex w-[92px]">
          <Link href='/analytics'>
            <a className='relative flex items-center h-full'>
              <div className={`w-[100px] h-[40px] pb-1 ${menu === 'analytics' && 'bg-primary-gradient'} ${activeClass(2)}`} onMouseEnter={() => setHoveredId(2)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex justify-center ${(menu === 'analytics' || hoveredId === 2) ? 'h-[39px]' : 'h-[40px]'}`}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="14" width="6" height="9" rx="1" fill={menu === 'analytics' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <rect x="11" y="8" width="6" height="15" rx="1" fill={menu === 'analytics' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <rect x="2" y="22" width="24" height="2" rx="1" fill={menu === 'analytics' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <rect x="18" y="3" width="6" height="20" rx="1" fill={menu === 'analytics' ? 'url(#paint0_linear_185_8613)' : '#969696'}/>
                    <linearGradient id="paint0_linear_185_8613" x1="7.98438" y1="3.80664" x2="24.4789" y2="7.67595" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00F0EC"/>
                      <stop offset="1" stopColor="#16FFC5"/>
                    </linearGradient>
                  </svg>
                </div>
              </div>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
