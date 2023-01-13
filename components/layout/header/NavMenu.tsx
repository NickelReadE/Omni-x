import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import {TextH3} from '../../basic'

export default function NavMenu() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = React.useState<number | undefined>()

  const activeClass = (index: number) => {
    return index === hoveredId ? 'bg-secondary' : 'bg-white'
  }

  const menu = useMemo(() => {
    if (router.pathname.includes('/collections')) {
      return 'collections'
    } else if (router.pathname === '/drops') {
      return 'drops'
    } else if (router.pathname === '/stats') {
      return 'stats'
    } else if (router.pathname === '/' || router.pathname === '/learn-more') {
      return 'home'
    } else {
      return 'others'
    }
  }, [router.pathname])

  return (
    <div className='h-full'>
      <ul className="flex flex-col space-x-8 justify-between md:flex-row md:text-sm md:font-medium h-full">
        <li className="flex">
          <Link href='/'>
            <a className='relative flex items-center h-full'>
              <div className={`h-[40px] ${menu === 'home' && 'bg-white'} ${activeClass(0)}`} onMouseEnter={() => setHoveredId(0)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex items-center justify-center ${(menu === 'home' || hoveredId === 0) ? 'h-[38px]' : 'h-[40px]'}`}>
                  <TextH3 className={menu === 'home' ? 'text-white' : 'text-secondary'}>Home</TextH3>
                </div>
              </div>
            </a>
          </Link>
        </li>
        <li className="flex">
          <Link href='/drops'>
            <a className='relative flex items-center h-full'>
              <div className={`h-[40px] ${menu === 'drops' && 'bg-white'} ${activeClass(1)}`} onMouseEnter={() => setHoveredId(1)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex items-center justify-center ${(menu === 'drops' || hoveredId === 1) ? 'h-[38px]' : 'h-[40px]'}`}>
                  <TextH3 className={menu === 'drops' ? 'text-white' : 'text-secondary'}>Drops</TextH3>
                </div>
              </div>
            </a>
          </Link>
        </li>
        <li className="flex">
          <Link href='/stats'>
            <a className='relative flex items-center h-full'>
              <div className={`h-[40px] ${menu === 'stats' && 'bg-white'} ${activeClass(2)}`} onMouseEnter={() => setHoveredId(2)} onMouseLeave={() => setHoveredId(undefined)}>
                <div className={`bg-primary w-full flex items-center justify-center ${(menu === 'stats' || hoveredId === 2) ? 'h-[38px]' : 'h-[40px]'}`}>
                  <TextH3 className={menu === 'stats' ? 'text-white' : 'text-secondary'}>Stats</TextH3>
                </div>
              </div>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
