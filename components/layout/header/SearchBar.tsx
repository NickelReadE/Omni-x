import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import useComponentVisible from '../../../hooks/useComponentVisible'
import useSearch from '../../../hooks/useSearch'
import {truncateAddress} from '../../../utils/utils'

const S3_BUCKET_URL = process.env.API_URL || ''

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true)
  const { collections, profiles } = useSearch(query)

  useEffect(() => {
    setIsComponentVisible(!!query)
  }, [query, setIsComponentVisible])

  const debounce = (func: any, wait: any) => {
    let timerId: any
    return (...args: any) => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        func(...args)
      }, wait)
    }
  }

  const getMinValue = (values: number[]) => {
    return values.filter(item => item > 0).reduce((a, b) => Math.min(a, b))
  }

  return (
    <div ref={ref} className={'h-[64px] flex items-center'}>
      <div className={'relative'}>
        {
          <div className={`${(query !== '' && isComponentVisible) ? 'absolute bg-[#303030]' : ''} w-[250px]`} style={(query !== '' && isComponentVisible) ? { borderRadius: '20px', top: -20 } : {}}>
            <div className={'h-[40px] bg-[#303030] w-[250px] px-[18px] flex items-center justify-between'} style={(query !== '' && isComponentVisible) ? { borderTopLeftRadius: '20px', borderTopRightRadius: '20px' } : { borderRadius: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.875 18.75C15.2242 18.75 18.75 15.2242 18.75 10.875C18.75 6.52576 15.2242 3 10.875 3C6.52576 3 3 6.52576 3 10.875C3 15.2242 6.52576 18.75 10.875 18.75Z" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.4438 16.4434L21.0001 20.9996" stroke="#969696" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder='search'
                className="flex items-center text-white bg-transparent w-[250px] h-[40px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0"
                onChange={debounce((e: any) => {
                  setQuery(e.target.value)
                }, 500)}
              />
            </div>
            {
              query !== '' && isComponentVisible &&
              <div className='p-3 overflow-auto' style={{maxHeight: 'calc(100vh - 150px)'}}>
                <div className="text-[#A0B3CC]" style={{fontSize: 15, lineHeight: '19px'}}>Collections</div>
                {
                  collections.map((item, index) => {
                    return (
                      <div className='my-2 h-[50px] font-bold' key={index}>
                        <Link href={`/collections/${item.col_url}`}>
                          <div className={'flex items-center cursor-pointer'}>
                            <div className={'mr-2'}>
                              <img src={item.profile_image} alt={'collection profile image'} width={50} height={50} className={'rounded-sm'}/>
                            </div>
                            <div className={'flex flex-col'}>
                              <span className={'text-[16px]'}>{item.name}</span>
                              <div className={'flex items-center'}>
                                <span className={'text-[14px] text-[#A0B3CC]'}>floor ${getMinValue([item.floorPrice.omni, item.floorPrice.usd])}</span>
                                <span className={'text-[14px] text-[#A0B3CC] mx-2'}> | </span>
                                <span className={'text-[14px] text-[#A0B3CC]'}>items {item.itemsCnt}</span>
                              </div>
                            </div>
                          </div>
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
                      <div className='my-2 h-[50px] font-bold truncate' key={index}>
                        <Link href={`/user/${item.address}`}>
                          <div className={'flex items-center cursor-pointer'}>
                            <div className={'mr-2 w-[50px] h-[50px]'}>
                              <img
                                src={item.avatar ? (S3_BUCKET_URL + item.avatar) : '/images/omnix_logo_black_1.png'}
                                alt={'avatar'}
                                width={50}
                                height={50}
                                className={'rounded-sm'}
                              />
                            </div>
                            <div className={'flex flex-col'}>
                              <div className={'text-[16px]'}>{item.username}</div>
                              <div className={'text-[14px] text-[#A0B3CC] truncate'}>{truncateAddress(item.address)}</div>
                            </div>
                          </div>
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
  )
}
