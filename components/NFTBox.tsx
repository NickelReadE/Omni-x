import React from 'react'
import { useEffect, useState } from 'react'
import { chain_list } from '../utils/utils'
import { IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import {useDraggable} from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'
import { prependOnceListener } from 'process'

import useWallet from '../hooks/useWallet'
import { addressesByNetwork } from '../constants'
import { SupportedChainId } from '../types'
import { postMakerOrder } from '../utils/makeOrder'
import { ethers } from 'ethers'
import { addDays } from 'date-fns'
import { openSnackBar } from '../redux/reducers/snackBarReducer'


import { useDispatch, useSelector } from 'react-redux'

const NFTBox = ({nft, index}: IPropsNFTItem) => {

  const [chain, setChain] = useState('eth')
  const [image, setImage] = useState('/images/omnix_logo_black_1.png')
  const [imageError, setImageError] = useState(false)
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  ///only in the beta version
  const [islisted,setList] = useState(false)

  const {
    provider,
    address
  } = useWallet()

  const dispatch = useDispatch()

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `draggable-${index}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined

  useEffect(() => {
    const updateImage = async() => {
      const metadata = nft.metadata
      setChain(chain_list[nft.chain])
      if (metadata) {
        try {
          // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
          const image_uri = JSON.parse(metadata).image
          setImage(image_uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
        } catch (err) {
          console.log('NFTBox err? ', err)
        }
      }

      ///only in the beta version
      const collection_name = nft.name
      console.log("collection name->",nft.name)
      if (collection_name == 'Gregs (ETH)' || collection_name == 'Fake Bored Ape Yacht Club' || collection_name == 'Azuki God' || collection_name == 'Kith Friends' || collection_name == 'MyNFTHaHa'|| collection_name == 'MMLMT7') {
        setList(true)
      }

    }

    updateImage()
  }, [])

  const onListing = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()

    try {
      await postMakerOrder(
        provider as any,
        chainId,
        true,
        nft.token_address,
        addresses.STRATEGY_STANDARD_SALE,
        ethers.utils.parseUnits('1', 1),
        ethers.utils.parseEther(price.toString()),
        ethers.utils.parseUnits('2', 2),
        ethers.utils.parseUnits('2', 2),
        currency,
        {
          tokenId: String(nft.token_id),
          startTime: startTime,
          endTime: addDays(startTime, period).getTime(),
          params: {
            values: [10001],
            types: ['uint256'],
          },
        },
        nft.chain
      )
      setOpenSellDlg(false)
      dispatch(openSnackBar({ message: 'Listing Success', status: 'success' }))
    } catch (err: any) {
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }
  
  return (
  	<div className='border-[2px] border-[#F8F9FA] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F8F9FA]'>
      <div className="nft-image-container" ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
          <img className='nft-image' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} />
        </LazyLoad>
        <div className="absolute top-[8px] right-[9px] p-[12px]" style={{background: 'radial-gradient(50% 50% at 50% 50%, rgba(254, 254, 255, 0.2) 0%, rgba(254, 254, 255, 0) 100%)'}}>
          <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
        </div>
      </div>
      <div className="flex flex-row mt-2.5 justify-start">
        <div className="ml-3 text-[#6C757D] text-[14px] font-medium font-['Roboto_Mono']">
          {nft.name}
        </div>
        <div className="ml-1 text-[#6C757D] text-[14px] font-medium font-['Roboto_Mono']">
          {`#${nft.token_id}`}
        </div>
      </div>
      <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
        <div className="flex items-center">
          {islisted && <div className="ml-3 py-[1px] px-5 bg-[#ADB5BD] rounded-lg text-[14px] text-[#F8F9FA] font-medium cursor-pointer hover:bg-[#B00000]" onClick={() => setOpenSellDlg(true)}>
            {'Sell'}
          </div>}
        </div>
        <div className="mr-3 flex items-center">
          <div className="mr-3 flex items-center cursor-pointer bg-[url('/images/round-refresh.png')] hover:bg-[url('/images/round-refresh_hover.png')] bg-cover w-[20px] h-[20px]">
          </div>
          <div className="flex items-center ml-1">
            {chain === 'eth' &&
              <img src="/svgs/ethereum.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'bsc' &&
              <img src="/svgs/binance.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'matic' &&
              <img src="/svgs/polygon.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'avalanche' &&
              <img src="/svgs/avax.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'fantom' &&
              <img src="/svgs/fantom.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'optimism' &&
              <img src="/svgs/optimism.svg" className="w-[16px] h-[16px]" />
            }
            {chain === 'arbitrum' &&
              <img src="/svgs/arbitrum.svg" className="w-[16px] h-[16px]" />
            }
          </div>
        </div>
      </div>
      <ConfirmSell handleSellDlgClose={() => {setOpenSellDlg(false)}} openSellDlg={openSellDlg} nftImage={image} nftTitle={nft.name} onSubmit={onListing} />
    </div>
  )
}

export default NFTBox
