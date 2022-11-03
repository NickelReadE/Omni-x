import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './layout/Footer'
import SideBar from './SideBar'
import SnackbarComponent from './SnackBar'

type LayoutProps = {
  children?: React.ReactNode
}

const Layout: React.FC = ({ children }: LayoutProps) => {
  const router = useRouter()
  const [ menu, setMenu ] = useState('home')

  useEffect(() => {
    if ( router.pathname.includes('/collections')) {
      setMenu('collections')
    } else if ( router.pathname === '/launchpad' ) {
      setMenu('analytics')
    } else if ( router.pathname === '/' ) {
      setMenu('home')
    } else {
      setMenu('others')
    }
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>Omni-X Marketplace</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1'
        />
      </Head>
      <SnackbarComponent />
      <main className='w-full flex flex-col'>
        <SideBar />
        <Header menu={menu} />
        <div className='pt-[64px] pb-[170px]'>
          {children}
        </div>
        <Footer />
      </main>
    </>
  )
}

export default Layout
