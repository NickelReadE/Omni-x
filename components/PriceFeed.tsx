import React, { useState, useEffect } from 'react'
import { getAssetPrices, getGasPrices, selectAssetPrices, selectGasPrices} from '../redux/reducers/feeddataReducer'
import { useDispatch, useSelector } from 'react-redux'
const volume24 = 342000
interface PRICE {
  chain: string,
  price: number
}
interface GAS {
  chain: string,
  price: number,
  unit: string
}
const price: Array<PRICE> = [
  {
    chain: 'ETH',
    price: 1820.30
  },
  {
    chain: 'AVAX',
    price: 29.20
  },
  {
    chain: 'BNB',
    price: 250.50
  },
  {
    chain: 'FTM',
    price: 2.30
  },
  {
    chain: 'MATIC',
    price: 0.90
  }
]
const gas: Array<GAS> = [
  {
    chain: 'Ethereum',
    price: 55,
    unit: 'Gwei'
  },
  {
    chain: 'Avalanche',
    price: 25,
    unit: 'nAVAX'
  },
  {
    chain: 'Arbitrum',
    price: 2,
    unit: 'Gwei'
  },
  {
    chain: 'BNBChain',
    price: 12,
    unit: 'Gwei'
  },
  {
    chain: 'Fantom',
    price: 1,
    unit: 'Gwei'
  },
  {
    chain: 'Optimism',
    price: 3,
    unit: 'Gwei'
  },
  {
    chain: 'Polygon',
    price: 4,
    unit: 'Gwei'
  }
]

const PriceFeed = () => {
  const dispatch = useDispatch()
  const assetPrices = useSelector(selectAssetPrices)
  const gasPrices = useSelector(selectGasPrices)
  const updateDatafeed = () => {
    dispatch(getAssetPrices() as any)
    dispatch(getGasPrices() as any)
  }

  useEffect(()=>{
    updateDatafeed()
    const interval = setInterval(() => {      
      updateDatafeed()
    }, 30000)
    return () => clearInterval(interval)
  },[])  

  return (
    <div className="fixed bottom-0 w-full z-[99] pr-[70px]">
      <div className=' flex justify-center w-full px-10  bg-[#F6F8FC]  text-center'>
        
        <div className='flex  mr-3'>          
          <div className='flex  mr-3'>
            <span className='text-md font-bold font-mono mr-1	'>
              {'ETH'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              ${assetPrices.eth}
            </span>              
                         
          </div>
          <div className='flex  mr-3'>
            <span className='text-md font-bold font-mono mr-1	'>
              {'BNB'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              ${assetPrices.bnb}
            </span>              
                         
          </div>
          <div className='flex  mr-3'>
            <span className='text-md font-bold font-mono mr-1	'>
              {'AVAX'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              ${assetPrices.avax}
            </span>              
                         
          </div>
          <div className='flex  mr-3'>
            <span className='text-md font-bold font-mono mr-1	'>
              {'FTM'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              ${assetPrices.ftm}
            </span>              
                         
          </div>
          <div className='flex  mr-3'>
            <span className='text-md font-bold font-mono mr-1	'>
              {'MATIC'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              ${assetPrices.matic}
            </span>           
          </div>         
        </div>   
        <div  className='flex mr-3'>
          <div className="flex">
            <span className='text-md font-bold font-mono mr-1'>|</span>
          
          </div>
            
        </div>     
        <div className='flex'>          
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Ethereum'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.eth}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Avalanche'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.avalanche}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'nAVAX'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Arbitrum'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.arbitrm}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Binance'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.bsc}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Fantom'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.fantom}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Optimism'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.optimism}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>            
                     
          </div>
          <div className="flex mr-3">
            <span className='text-md font-bold font-mono mr-1	'>
              {'Polygon'}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {gasPrices.polygon}
            </span>
            <span className='text-md font-normal font-mono mr-1	'>
              {'Gwei'}
            </span>       
          </div>
          
        </div>


      </div>
    </div>
  )
}
export default PriceFeed

