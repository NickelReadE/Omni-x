import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './layout/Footer'
import SideBar from './SideBar'
import SnackbarComponent from './SnackBar'

type LayoutProps = {
  children?: React.ReactNode
}

const Layout: React.FC = ({ children }: LayoutProps) => {
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
        <Header />
        <div className={'pt-[88px] pb-[42px] bg-primary'}>
          {children}
        </div>
        <Footer />
      </main>
    </>
  )
}

export default Layout
