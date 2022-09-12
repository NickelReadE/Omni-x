import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import { getCollectionInfo, selectCollectionInfo, getCollectionOwners, selectCollectionOwners } from '../redux/reducers/collectionsReducer'
import { convertUSDTtoETH } from '../utils/convertRate'

import { useDispatch, useSelector } from 'react-redux'
import editStyle from '../styles/nftbox.module.scss'
import classNames from '../helpers/classNames'
import CircularProgress from '@material-ui/core/CircularProgress'
import Hgreg from '../public/images/gregs/logo.png'
import Loading from '../public/images/loading_f.gif'
const CollectionCard = (props:any) => {

  const [chain, setChain] = useState('eth')
  const [image, setImage] = useState(props.collection.profile_image)
  const [imageError, setImageError] = useState(false)
  const [openSellDlg, setOpenSellDlg] = React.useState(false)
  ///only in the beta version
  const [islisted,setList] = useState(false)
  const [itemCounts, setItemCounts] = useState(0)
  const [ownerNum, setOwnerNum] = useState(0)
  const {
    provider,
    address
  } = useWallet()

  const dispatch = useDispatch()
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `draggable-${1}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined  
  return (
    <div className={classNames(' border-[2px] border-[#F6F8FC] w-[340px] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <div className='relative'  style={style} >
        <div >
          <img className='nft-image w-[340px] background-fill' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} />
        </div>
        <div className={classNames('absolute w-full h-full  flex items-center justify-center  ', editStyle.actionBtn)}>
          <div>
            <Link href={`/collections/${props.collection.col_url}`}>
              <div className='w-[230px] text-[18px] text-white	 text-extrabold text-center items-center bg-[#B444F9] rounded-lg mb-[24px]  py-[7px] hover:cursor-pointer'>view collection</div>
            </Link>
            
            <div className='w-[230px] text-[18px] text-white	 text-extrabold text-center items-center bg-[#38B000] rounded-lg  py-[7px]'>make a collection bid</div>
          </div>
          
        </div>
      </div>
      <div className="flex flex-row mt-2.5 justify-start">
        <div className="ml-3 text-[#000000] text-[20px] font-bold ">
          {props.collection.name}
        </div>        
      </div>
      
      <div className="grid grid-rows-6 grid-flow-col gap-1 p-2">
        <div className={classNames('row-span-6 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] font-extrabold  mb-1 w-[60px]'>Floor</div>
          <div className='flex flex-col space-y-2' >
            <div className=' flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
              <span className='font-medium text-[12px] mr-[4px]'>{props.card?props.card.floorPrice.eth:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
              <img src='/svgs/eth_asset.svg' className='w-[16px]' alt='asset img'></img>
            </div>
            <div className='flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
              <span className='font-medium text-[12px] mr-[4px]' >{props.card?props.card.floorPrice.usd:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
              <img src='/svgs/usd_asset.svg' className='w-[16px]' alt='asset img'></img>
            </div>
            <div className='flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
              <span className='font-medium text-[12px] mr-[px]'>{props.card?props.card.floorPrice.usd:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
              <img src='/svgs/omni_asset.svg' className='w-[16px]' alt='asset img'></img>
            </div>
          </div>            
        </div>
        <div className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)}>
          <div className='text-[14px] flex flex-row justify-between'>
            <span className='font-extrabold mr-[1px]'>Items</span>
            <span className='font-medium text-[12px]'>{props.card?props.card.itemsCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div  className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
            <span className='font-extrabold mr-[1px]'>Owners</span>
            <span className='font-medium text-[12px]'>{props.card?props.card.ownerCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
            <span className='font-extrabold mr-[1px]'>Listed</span>
            <span className='font-medium text-[12px]'>{props.card?props.card.orderCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div className={classNames('row-span-3 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] font-extrabold mb-1'>Volume(Total)</div>
          <div className='text-[14px] flex flex-row '>
            <span className='mr-1 text-[12px]'>{props.card?0:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
            <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
          </div>
        </div>
        <div className={classNames('row-span-3 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] font-extrabold mb-1 '>Volume(7d)</div>
          <div className='text-[14px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
            <div className='flex flex-row mr-4'>
              <span className='font-medium mr-1 text-[12px]'>{props.card?0:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
              <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
            </div>               
            <span className='font-medium text-[#38B000] text-[12px]'> {props.card?'0%':<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
      </div>
      

    </div>
  )
}

export default CollectionCard
