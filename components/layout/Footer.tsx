import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PriceFeed from '../PriceFeed'

export default function Footer() {
  const router = useRouter()

  const isHomePage = useMemo(() => {
    return router.pathname === '/'
  }, [router.pathname])

  return (
    <div className={`${isHomePage ? 'h-[170px]' : 'h-[42px]'} fixed bottom-0 w-full`}>
      {
        isHomePage && (
          <div className={'flex justify-between h-[128px] p-[32px] w-full bg-[#161616]'}>
            <span className='text-[24px] leading-[29px] text-[500] text-[#F5F5F5]'>
            Omni X, Inc
            </span>
            <div className='flex space-x-44'>
              <div className='flex flex-col'>
                <span className='text-[24px] leading-[29px] text-[500] text-[#F5F5F5] mb-[16px]'>
                  Company
                </span>
                <div className='flex items-center space-x-[48px]'>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Learn More
                    </span>
                  </Link>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Github
                    </span>
                  </Link>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Gitbook
                    </span>
                  </Link>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Team
                    </span>
                  </Link>
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='text-[24px] leading-[29px] text-[500] text-[#F5F5F5] mb-[16px]'>
                  Legal
                </span>
                <div className='flex items-center space-x-[48px]'>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Terms of Service
                    </span>
                  </Link>
                  <Link href='/'>
                    <span className='text-[#F5F5F5] text-[16px] text-[450] leading-[19px] hover:bg-primary-gradient hover:bg-clip-text hover:text-transparent cursor-pointer'>
                      Privacy Policy
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div />
          </div>
        )
      }
      <PriceFeed />
    </div>
  )
}
