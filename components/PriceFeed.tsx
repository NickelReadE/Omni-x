import React from 'react'

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

  return (
    <div className=" w-full">
      <div className=' flex justify-center w-full px-10 z-50 bg-[#F6F8FC] mt-[91px] text-center'>
        <div className='flex mr-3'>
          <div>
            <span className='text-sm font-bold font-mono mr-1.5	'>
              24hrVolume
            </span>
            <span className='text-sm font-normal font-mono'>
              ${volume24}
            </span>
          </div>

        </div>
        <div className='flex  mr-3'>
          {price.map((item, index) => (
            <div key={index}>
              <span className='text-sm font-bold font-mono mr-1.5	'>
                {item.chain}
              </span>
              <span className='text-sm font-normal font-mono mr-1.5	'>
                ${item.price}
              </span>

              {price.length - 2 > index &&
                <span className='text-sm font-normal font-mono mr-1.5	'>
                  -
                </span>
              }
            </div>
          ))}
        </div>
        <div className='flex'>
          {gas.map((item, index) => (
            <div key={index}>
              <span className='text-sm font-bold font-mono mr-1.5	'>
                {item.chain}
              </span>
              <span className='text-sm font-normal font-mono mr-1.5	'>
                {item.price}
              </span>
              <span className='text-sm font-normal font-mono mr-1.5	'>
                {item.unit}
              </span>

              {gas.length - 2 > index &&
                <span className='text-sm font-normal font-mono mr-1.5	'>
                  -
                </span>
              }
            </div>
          ))}
        </div>


      </div>
    </div>
  )
}
export default PriceFeed

