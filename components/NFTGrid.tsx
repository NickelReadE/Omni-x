import React, { useState, useEffect } from 'react'
import NFTBox from './NFTBox'
import { IPropsImage } from '../interface/interface'
import { getOrders, selectOrders } from '../redux/reducers/ordersReducer'
import { IGetOrderRequest } from '../interface/interface'
import useWallet from '../hooks/useWallet'
import { useDispatch, useSelector } from 'react-redux'

const chainList = [
  { chain: 'all', img_url: '/svgs/all_chain.svg', title: 'all NFTs', disabled: false},
  { chain: 'rinkeby', img_url: '/svgs/ethereum.svg', title: 'Ethereum', disabled: false},
  { chain: 'mumbai', img_url: '/svgs/polygon.svg', title: 'Polygon', disabled: false},
  { chain: 'avalanche testnet', img_url: '/svgs/avax.svg', title: 'Avalanche', disabled: false},
  { chain: 'bsc testnet', img_url: '/svgs/binance.svg', title: 'BNB Chain', disabled: false},
  { chain: 'fantom', img_url: '/svgs/fantom.svg', title: 'Fantom', disabled: false},
  { chain: 'optimism', img_url: '/svgs/optimism.svg', title: 'Optimism', disabled: false},
  { chain: 'arbitrum', img_url: '/svgs/arbitrum.svg', title: 'Arbitrum', disabled: false},
]
const NFTGrid = ({ nfts }: IPropsImage) => {
  const [chain, setChain] = useState('rinkeby')

  const {
    provider,
    address
  } = useWallet()
  const dispatch = useDispatch()

  useEffect(()=> {
    if(nfts){
      const request: IGetOrderRequest = {
        isOrderAsk: true,
        chain: provider?.network.name,
        signer: address,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'OLDEST'
      }
      dispatch(getOrders(request) as any)
    }
  },[nfts])


  return (
    <>
      <div className="w-full mb-5 ">
        <div className="flex relative justify-start bg-[#F8F9FA] p-2 w-fit" style={{'width':'100%'}}>
          {
            chainList.map((item, index) => {
              return <div key={index} className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px]  ${chain == item.chain ? 'border-b-2 border-black' : ''} ${item.disabled ? 'bg-[#e8e8e8] rounded-lg cursor-default' : ''}`} onClick={() =>{item.disabled ? undefined : setChain(item.chain)}}>
                <img src={item.img_url} className="w-[21px] h-[22px] " />
              </div>
            })
          }
          <div className="flex p-3 font-medium cursor-pointer text-[#6C757D] absolute right-0">
            <img src='/images/listing.png' className="w-[21px] h-[22px]"/>
            <span>active listing</span>
            <img src='/images/downArrow.png' className="w-[10px] h-[7px] ml-5 mt-auto mb-auto"/>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-10 mt-4">
          {nfts.map((item, index) => {

            if(chain == 'all'){
              return (
                <NFTBox nft={item} index={index} key={index}/>
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
