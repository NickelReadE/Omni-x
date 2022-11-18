import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import useComponentVisible from '../../hooks/useComponentVisible'
import useSearch from '../../hooks/useSearch'
import {truncateAddress} from '../../utils/utils'

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
    return values.filter(item => item > 0).reduce((a, b) => Math.min(a, b), 0)
  }

  return (
    <div ref={ref} className={'h-[90px] flex items-center'}>
      <div className={'relative'}>
        {
          <div className={(query !== '' && isComponentVisible) ? 'absolute w-[250px] bg-white' : 'w-[250px]'} style={(query !== '' && isComponentVisible) ? { borderRadius: '20px', border: '1.5px solid #000000', top: -20 } : {}}>
            <div className={'h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={(query !== '' && isComponentVisible) ? { borderTopLeftRadius: '20px', borderTopRightRadius: '20px' } : { borderRadius: '20px', border: '1.5px solid #000000' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.3126 14.5171L11.0646 10.2691C12.0854 9.04359 12.5945 7.47169 12.4858 5.88042C12.3772 4.28914 11.6593 2.80101 10.4814 1.72558C9.30354 0.650147 7.75639 0.0702278 6.16182 0.106459C4.56726 0.142691 3.04804 0.792283 1.92022 1.9201C0.792405 3.04792 0.142813 4.56713 0.106581 6.1617C0.0703499 7.75627 0.650269 9.30342 1.7257 10.4813C2.80113 11.6592 4.28927 12.3771 5.88054 12.4857C7.47182 12.5943 9.04371 12.0853 10.2692 11.0645L14.5172 15.3125L15.3126 14.5171ZM1.2501 6.31247C1.2501 5.31121 1.54701 4.33242 2.10328 3.4999C2.65956 2.66738 3.45021 2.0185 4.37526 1.63533C5.30031 1.25216 6.31821 1.15191 7.30024 1.34725C8.28227 1.54259 9.18432 2.02474 9.89232 2.73275C10.6003 3.44075 11.0825 4.3428 11.2778 5.32483C11.4732 6.30686 11.3729 7.32476 10.9897 8.24981C10.6066 9.17486 9.95769 9.96551 9.12517 10.5218C8.29265 11.0781 7.31386 11.375 6.3126 11.375C4.97039 11.3735 3.68359 10.8396 2.73451 9.89056C1.78543 8.94148 1.25158 7.65468 1.2501 6.31247Z" fill="#A0B3CC"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder='Search'
                className="flex items-center bg-transparent w-[248px] h-[40px] border-0 focus:outline-0 focus:shadow-none focus:ring-offset-0 focus:ring-0"
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
