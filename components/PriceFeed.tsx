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
          icon: '/images/roundedColorEthereum.png',
          gasFee: gasPrices['eth'],
          price: assetPrices['eth']
        },
        {
          icon: '/svgs/arbitrum.svg',
          gasFee: gasPrices['arbitrm'],
          price: 0
        },
        {
          icon: '/svgs/avax.svg',
          gasFee: gasPrices['avalanche'],
          price: assetPrices['avax']
        },
        {
          icon: '/svgs/binance.svg',
          gasFee: gasPrices['bsc'],
          price: assetPrices['bnb']
        },
        {
          icon: '/svgs/fantom.svg',
          gasFee: gasPrices['fantom'],
          price: assetPrices['ftm']
        },
        {
          icon: '/svgs/polygon.svg',
          gasFee: gasPrices['polygon'],
          price: assetPrices['matic']
        },
        {
          icon: '/svgs/optimism.svg',
          gasFee: gasPrices['optimism'],
          price: 0
        },
      ]
    }
    return []
  }, [assetPrices, gasPrices])

  return (
    <div className="fixed bottom-0 w-full z-[99] pr-[70px] h-[42px] bg-[#161616]">
      <div className="flex items-center justify-center h-full w-full px-10 text-center">
        {
          data.map((item, index) => {
            return (
              <div key={index} className="flex mr-3">
                <Image alt={'chainIcon'} src={item.icon} width={20} height={20} />
                {
                  item.price > 0 &&
                  <span className="text-[13px] text-white font-normal ml-1">
                    ${item.price}
                  </span>
                }
                {
                  item.gasFee > 0 &&
                  <span className="text-[13px] text-[#969696] font-normal ml-1">
                    ${item.gasFee} gwei
                  </span>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
export default PriceFeed

