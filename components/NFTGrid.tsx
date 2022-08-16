import React, { useState, useEffect } from 'react'
import NFTBox from './NFTBox'
import { IPropsImage } from '../interface/interface'

const chainList = [
  { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs', disabled: false},
  { chain: 'rinkeby', img_url: '/svgs/ethereum.svg', title: 'Ethereum', disabled: false},
  { chain: 'arbitrum', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum', disabled: true},
  { chain: 'avalanche testnet', img_url: '/svgs/avax.svg', title: 'Avalanche', disabled: false},
  { chain: 'bsc testnet', img_url: '/svgs/binance.svg', title: 'BNB Chain', disabled: false},
  { chain: 'fantom', img_url: '/svgs/fantom.svg', title: 'Fantom', disabled: true},
  { chain: 'optimism', img_url: '/svgs/optimism.svg', title: 'Optimism', disabled: true},
  { chain: 'mumbai', img_url: '/svgs/polygon.svg', title: 'Polygon', disabled: false},
]
const NFTGrid = ({ nfts }: IPropsImage) => {
  const [chain, setChain] = useState('all')

  return (
    <>
      <div className="w-full mb-5 mt-4">
        <div className="flex justify-start bg-[#F8F9FA] border-2 border-[#E9ECEF] rounded-lg p-2 w-fit">
          {
            chainList.map((item, index) => {
              return <div key={index} className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[96px] ${chain == item.chain ? 'bg-[#E9ECEF] border-2 border-[#ADB5BD] rounded-lg text-[#1E1C21]' : ''} ${item.disabled ? 'bg-[#e8e8e8] rounded-lg cursor-default' : ''}`} onClick={() =>{item.disabled ? undefined : setChain(item.chain)}}>
                <img src={item.img_url} className="w-[21px] h-[22px]" />
                <p className="mt-1 font-['Circular_Std'] leading-[18px] text-[14px]">{item.title}</p>
              </div>
            })
          }
        </div>
        <div className="grid grid-cols-5 gap-10 mt-4">
          {nfts.map((item, index) => {
            if(chain == 'all'){
              return (
                <NFTBox nft={item} index={index} key={index} />
              )
            } else {
              if(chain == item.chain) {
                return (
                  <NFTBox nft={item} index={index} key={index} />
                )
              }
            }
          })}
        </div>
      </div>
    </>
  )
}

export default NFTGrid
