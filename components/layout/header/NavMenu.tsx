import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import {TextH3} from '../../common/Basic'

const MENU_ITEMS = [
  {
    name: 'home',
    url: '/',
    displayName: 'Home',
  },
  {
    name: 'drops',
    url: '/drops',
    displayName: 'Drops',
  },
  {
    name: 'stats',
    url: '/stats',
    displayName: 'Stats',
  }
]

export default function NavMenu() {
  const router = useRouter()
  const [hoveredId, setHoveredId] = React.useState<number | undefined>()

  const activeClass = (index: number) => {
    return index === hoveredId ? 'bg-secondary' : ''
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
        {MENU_ITEMS.map((item, idx) => (
          <li className="flex" key={idx}>
            <Link href={item.url}>
              <a className='relative flex items-center h-full'>
                <div className={`h-[40px] ${menu === item.name ? 'bg-white' : ''} ${activeClass(idx)}`} onMouseEnter={() => setHoveredId(idx)} onMouseLeave={() => setHoveredId(undefined)}>
                  <div className={`bg-primary w-full flex items-center justify-center h-[38px]`}>
                    <TextH3 className={menu === item.name ? 'text-white' : 'text-secondary'}>{item.displayName}</TextH3>
                  </div>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
