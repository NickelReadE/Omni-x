/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import NFTBox from './collections/NFTBox'
import {IPropsImage} from '../interface/interface'
import {useDispatch} from 'react-redux'
import {getCollections} from '../redux/reducers/collectionsReducer'
import {chainInfos, SUPPORTED_CHAIN_IDS} from '../utils/constants'
import {ChainIds} from '../types/enum'
import useData from '../hooks/useData'

const NFTGrid = ({nfts}: IPropsImage) => {
  const [chain, setChain] = useState(-1)

  const dispatch = useDispatch()
  const { refreshUserNfts } = useData()

  useEffect(() => {
    dispatch(getCollections() as any)
  }, [])

  useEffect(() => {
    if (nfts.length > 0) {
      /* const request: IGetOrderRequest = {
        isOrderAsk: true,
        signer: address,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'OLDEST'
      }
      dispatch(getOrders(request) as any)

      const bidRequest: IGetOrderRequest = {
        isOrderAsk: false,
        startTime: Math.floor(Date.now() / 1000).toString(),
        endTime: Math.floor(Date.now() / 1000).toString(),
        status: ['VALID'],
        sort: 'PRICE_ASC'
      }
      dispatch(getOrders(bidRequest) as any)

      const excutedRequest: IGetOrderRequest = {
        status: ['EXECUTED'],
        sort: 'UPDATE_OLDEST'
      }
      dispatch(getLastSaleOrders(excutedRequest) as any) */
    }
  }, [nfts])

  const onRefresh = () => {
    refreshUserNfts()
  }

  return (
    <>
      <div className="w-full mb-5 ">
        <div className="flex relative justify-start bg-[#F8F9FA] pl-2 pr-2 w-fit" style={{'width': '100%'}}>
          <div
            className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px] ${chain === -1 ? 'bg-[#C8D6E8]' : ''} `}
            onClick={() => {
              setChain(-1)
            }}
          >
            <img alt={'listing'} src="/svgs/all_chain.svg" className="w-[21px] h-[22px] "/>
          </div>
          {
            SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
              return <div
                key={index}
                className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px] ${chain === networkId ? 'bg-[#C8D6E8]' : ''} `}
                onClick={() => {
                  setChain(networkId)
                }}
              >
                <img alt={'listing'} src={chainInfos[networkId].logo} className="w-[21px] h-[22px] "/>
              </div>
            })
          }
          <div className="flex p-3 font-medium cursor-pointer text-[#6C757D] absolute right-0">
            <img alt={'listing'} src="/images/listing.png" className="w-[21px] h-[22px]"/>
            <span>active listing</span>
            <img alt={'listing'} src="/images/downArrow.png" className="w-[10px] h-[7px] ml-5 mt-auto mb-auto"/>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 2xl:grid-cols-5 2xl:gap-10 mt-4">
          {nfts.map((item, index) => {
            if (chain == -1) {
              return (
                <NFTBox 
                  nft={item}
                  index={index}
                  key={index}
                  onRefresh={onRefresh} 
                />
              )
            } else {
              if (chain == item.chain_id) {
                return (
                  <NFTBox 
                    nft={item}
                    index={index}
                    key={index}
                    onRefresh={onRefresh} 
                  />
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
