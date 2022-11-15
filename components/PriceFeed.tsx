/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo} from 'react'
import {getAssetPrices, getGasPrices, selectAssetPrices, selectGasPrices} from '../redux/reducers/feeddataReducer'
import {useDispatch, useSelector} from 'react-redux'
import Image from 'next/image'

const PriceFeed = () => {
  const dispatch = useDispatch()
  const assetPrices = useSelector(selectAssetPrices)
  const gasPrices = useSelector(selectGasPrices)

  const updateDatafeed = () => {
    dispatch(getAssetPrices() as any)
    dispatch(getGasPrices() as any)
  }

  useEffect(() => {
    updateDatafeed()
    const interval = setInterval(() => {
      updateDatafeed()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const data = useMemo(() => {
    if (assetPrices && gasPrices) {
      return [
        {
          icon: '/images/chain/omni_dark_round.png',
          gasFee: 0,
          price: 100
        },
        {
          icon: '/images/chain/ethereum_dark_round.png',
          gasFee: gasPrices['eth'],
          price: assetPrices['eth']
        },
        {
          icon: '/images/chain/arbitrum_dark_round.png',
          gasFee: gasPrices['arbitrm'],
          price: 0
        },
        {
          icon: '/images/chain/avalanche_dark_round.png',
          gasFee: gasPrices['avalanche'],
          price: assetPrices['avax']
        },
        {
          icon: '/images/chain/binance_dark_round.png',
          gasFee: gasPrices['bsc'],
          price: assetPrices['bnb']
        },
        /*{
          icon: '/svgs/fantom.svg',
          gasFee: gasPrices['fantom'],
          price: assetPrices['ftm']
        },*/
        {
          icon: '/images/chain/polygon_dark_round.png',
          gasFee: gasPrices['polygon'],
          price: assetPrices['matic']
        },
        /*{
          icon: '/svgs/optimism.svg',
          gasFee: gasPrices['optimism'],
          price: assetPrices['op']
        },*/
      ]
    }
    return []
  }, [assetPrices, gasPrices])

  return (
    <div className="fixed bottom-0 w-full z-[99] h-[42px] bg-[#F6F8FC] dark:bg-[#161616] border-t-[1px] border-[#303030]">
      <div className='flex items-center justify-between h-full px-10'>
        <div className="flex items-center h-full">
          <div className='mr-3'>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 9.5C11 8.67157 10.3284 8 9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11C10.3284 11 11 10.3284 11 9.5Z" fill="#969696"/>
              <path d="M4 9.5C4 8.67157 3.32843 8 2.5 8C1.67157 8 1 8.67157 1 9.5C1 10.3284 1.67157 11 2.5 11C3.32843 11 4 10.3284 4 9.5Z" fill="#969696"/>
              <path d="M18 9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5C15 10.3284 15.6716 11 16.5 11C17.3284 11 18 10.3284 18 9.5Z" fill="#969696"/>
            </svg>
          </div>
        </div>
        <div className={'flex items-center space-x-4'}>
          {
            data.map((item, index) => {
              return (
                <div key={index} className="flex mr-3">
                  <Image alt={'chainIcon'} src={item.icon} width={20} height={20} />
                  {
                    item.price > 0 &&
                    <span className="text-[13px] text-black dark:text-white font-normal ml-1">
                    ${item.price}
                    </span>
                  }
                  {
                    item.gasFee > 0 &&
                    <span className="text-[13px] text-[#969696] font-normal ml-1">
                      {item.gasFee} gwei
                    </span>
                  }
                </div>
              )
            })
          }
        </div>
        <div className='flex mr-[6px] items-center h-full'>
          <div className='w-[20px] h-[20px] mr-1'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.99529 14.1053C12.2827 14.1053 14.1371 12.251 14.1371 9.96355C14.1371 7.67611 12.2827 5.82178 9.99529 5.82178C7.70785 5.82178 5.85352 7.67611 5.85352 9.96355C5.85352 12.251 7.70785 14.1053 9.99529 14.1053Z" stroke="url(#paint0_linear_185_9089)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round"/>
              <path d="M3.85677 14.5508C2.87577 13.226 2.34903 11.6197 2.35503 9.97125C2.36103 8.3228 2.89944 6.72041 3.89006 5.4028M14.5584 16.1383C13.2341 17.122 11.6271 17.6509 9.9775 17.6462C8.32786 17.6414 6.72401 17.1031 5.40547 16.1118M16.1255 5.42497C17.1113 6.74571 17.6439 8.34965 17.6439 9.99772C17.6439 11.6458 17.1113 13.2497 16.1255 14.5705M5.43507 3.8658C6.75913 2.88028 8.3666 2.34976 10.0172 2.35354C11.6677 2.35731 13.2727 2.89519 14.5923 3.88676" stroke="url(#paint1_linear_185_9089)" strokeMiterlimit="10"/>
              <defs>
                <linearGradient id="paint0_linear_185_9089" x1="7.40668" y1="5.82178" x2="14.4824" y2="7.53062" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00F0EC"/>
                  <stop offset="1" stopColor="#16FFC5"/>
                </linearGradient>
                <linearGradient id="paint1_linear_185_9089" x1="5.22165" y1="2.35352" x2="18.2816" y2="5.50684" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00F0EC"/>
                  <stop offset="1" stopColor="#16FFC5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className='flex items-center'>
            <div className='text-lg leading-[19px] text-primary-light'>omni&nbsp;x</div>
            <span className='text-lg leading-[19px] text-secondary ml-1'>info</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PriceFeed

