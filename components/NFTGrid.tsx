import React, { useState, useEffect } from 'react'
import NFTBox from './NFTBox'
import NFTbox from './collections/NFTBox'
import { IPropsImage } from '../interface/interface'
import { getOrders,getLastSaleOrders } from '../redux/reducers/ordersReducer'
import { IGetOrderRequest } from '../interface/interface'
import useWallet from '../hooks/useWallet'
import { useDispatch, useSelector } from 'react-redux'
import { getCollections } from '../redux/reducers/collectionsReducer'
import { selectSearchText } from '../redux/reducers/headerReducer'
import { selectNFTInfo } from '../redux/reducers/collectionsReducer'
import {  getCollectionInfo,getCollectionAllNFTs, selectCollectionAllNFTs,selectCollectionInfo } from '../redux/reducers/collectionsReducer'

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
  const [chain, setChain] = useState('all')
  const [isSearch, setSearch] = useState(false)
  const [nft, setNFT] = useState(null)
  const [colURL, setColURL] = useState('')
  const [tokenID, setTokenID] = useState(0)

  const {
    provider,
    address
  } = useWallet()
  const dispatch = useDispatch()
  const searchText = useSelector(selectSearchText)
  const col_url = searchText.split('#')[0]
  const token_id = searchText.split('#')[1]

  const allNFTs = useSelector(selectCollectionAllNFTs)
  const collectionInfo = useSelector(selectCollectionInfo)

  useEffect(()=>{
    if(searchText==''){
      setSearch(false)
    }else{
      if(col_url!=''&&Number(token_id)>0){
        setSearch(true)
        setColURL(col_url)
        setTokenID(Number(token_id))
        if(colURL!=col_url){
          dispatch(getCollectionAllNFTs(col_url,'','') as any)
        }
        dispatch(getCollectionInfo(col_url) as any)
      } else{
        setSearch(false)
      }
    }

  },[searchText])

  
  useEffect(() => {
    if(allNFTs && tokenID>0){
      setNFT(allNFTs[tokenID-1])
    }
  }, [allNFTs,tokenID])

  useEffect(() => {
    dispatch(getCollections() as any)
  }, [])


  useEffect(()=> {
    if(nfts.length>0){
      const request: IGetOrderRequest = {
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
      dispatch(getLastSaleOrders(excutedRequest) as any)
    }
  },[nfts])

  // useEffect(()=>{
  //   if(nfts.length>0){
  //     console.log(nfts)
  //   }
  // },[nfts])


  return (
    <>
      <div className="w-full mb-5 mt-4">
        <div className="flex justify-start bg-[#F6F8FC] border-2 border-[#E9ECEF] rounded-lg p-2 w-fit">
          {
            chainList.map((item, index) => {
              return <div key={index} className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[96px] ${chain == item.chain ? 'bg-[#E9ECEF] border-2 border-[#ADB5BD] rounded-lg text-[#1E1C21]' : ''} ${item.disabled ? 'bg-[#e8e8e8] rounded-lg cursor-default' : ''}`} onClick={() =>{item.disabled ? undefined : setChain(item.chain)}}>
                <img src={item.img_url} className="w-[21px] h-[22px]" />
                <p className="mt-1  leading-[18px] text-[14px]">{item.title}</p>
              </div>
            })
          }
        </div>
        <div className="grid grid-cols-4 gap-6 2xl:grid-cols-5 2xl:gap-10 mt-4">
          {!isSearch&&nfts.map((item, index) => {
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
          {
            isSearch&&nft!=null&&<NFTbox nft={nft} index={1} col_url={col_url} col_address={collectionInfo.address}  chain={collectionInfo?collectionInfo.chain:'eth'}/>
          }
        </div>
      </div>
    </>
  )
}

export default NFTGrid
