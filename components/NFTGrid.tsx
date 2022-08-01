import React from 'react'
import NFTBox from './NFTBox'
import { IPropsImage } from '../interface/interface'

const chainList = [
  { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs'},
  { chain: 'eth', img_url: '/svgs/ethereum.svg', title: 'Ethereum'},
  { chain: 'arbitrum', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum'},
  { chain: 'avalanche', img_url: '/svgs/avax.svg', title: 'Avalanche'},
  { chain: 'bsc', img_url: '/svgs/binance.svg', title: 'BNB Chain'},
  { chain: 'fantom', img_url: '/svgs/fantom.svg', title: 'Fantom'},
  { chain: 'optimism', img_url: '/svgs/optimism.svg', title: 'Optimism'},
  { chain: 'matic', img_url: '/svgs/polygon.svg', title: 'Polygon'},
]
const NFTGrid = ({ nfts }: IPropsImage) => {
  const [chain, setChain] = React.useState('eth')
  return (
    <>
      <div className="w-full mb-5 mt-4">
        <div className="flex justify-start bg-[#F8F9FA] border-2 border-[#E9ECEF] rounded-lg p-2 w-fit">
          {
            chainList.map((item, index) => {
              return <div key={index} className={`grid justify-items-center content-center p-3 font-medium cursor-pointer ${chain == item.chain ? 'bg-[#E9ECEF] border-2 border-[#ADB5BD] rounded-lg text-[#1E1C21]' : ''}`} onClick={() =>{setChain(item.chain)}}>
                <img src={item.img_url} className="w-[21px] h-[22px]" />
                <p className="mt-1 font-['Circular_Std'] leading-[18px] text-[14px]">{item.title}</p>
              </div>
            })
          }
        </div>
        <div className="grid grid-cols-5 gap-10 mt-4">
          {nfts.map((item, index) => {
            return (
              <NFTBox nft={item} index={index} key={index} />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default NFTGrid
