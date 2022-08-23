import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
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
import editStyle from '../styles/nftbox.module.scss'
import classNames from '../helpers/classNames'

import Hgreg from '../public/images/gregs/logo.png'

const CollectionCard = (props:any) => {

  const [chain, setChain] = useState('eth')
  const [image, setImage] = useState(props.collection.profile_image)
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
    id: `draggable-${1}`,
    data: {
      type: 'NFT',
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99
  } : undefined

  useEffect(() => {
    console.log(props.collection.profile_image)
  }, [])

  const onListing = async (currency: string, price: number, period: number) => {
    const chainId = provider?.network.chainId as number
    
    const addresses = addressesByNetwork[SupportedChainId.RINKEBY]
    const startTime = Date.now()
  
  }
  
  return (
    <div className={classNames(' border-[2px] border-[#F6F8FC] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <div className='relative'  style={style} >
        <div >
          <img className='nft-image w-[340px] background-fill' src={imageError?'/images/omnix_logo_black_1.png':image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={image} />
        </div>
        <div className={classNames('absolute w-full h-full  flex items-center justify-center  ', editStyle.actionBtn)}>
          <div>
            <Link href={`/collections/${props.collection.col_url}`}>
              <div className='text-[18px] text-extrabold text-center items-center bg-[#B444F9] rounded-lg mb-[24px] px-[55px] py-[7px] hover:cursor-pointer'>view collection</div>
            </Link>
            
            <div className='text-[18px] text-extrabold text-center items-center bg-[#38B000] rounded-lg px-[55px] py-[7px]'>make a collection bid</div>
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
            <div className='text-[15px] font-extrabold  mb-1'>Floor</div>
            <div className='flex flex-col space-y-2' >
              <div className='text-[15px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                  <span className='font-medium'>65.22</span>
                  <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
              </div>
              <div className='flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                  <span className='font-medium' >69.22K</span>
                  <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
              </div>
              <div className='flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                  <span className='font-medium'>65.22K</span>
                  <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
              </div>
            </div>
            
        </div>
        <div className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)}>
            <div className='text-[15px] flex flex-row justify-between'>
                <span className='font-extrabold mr-[10px]'>Items</span>
                <span className='font-medium'>10K</span>
            </div>
        </div>
        <div  className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
            <div className='text-[15px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                <span className='font-extrabold mr-[10px]'>Owners</span>
                <span className='font-medium'>10K</span>
            </div>
        </div>
        <div className={classNames('row-span-2 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
            <div className='text-[15px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                <span className='font-extrabold mr-[10px]'>Listed</span>
                <span className='font-medium'>10K</span>
            </div>
        </div>
        <div className={classNames('row-span-3 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
            <div className='text-[14px] font-extrabold mb-1'>Volume(Total)</div>
            <div className='text-[15px] flex flex-row '>
                <span className='mr-1'>65.22</span>
                <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
            </div>
        </div>
        <div className={classNames('row-span-3 col-span-1 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
            <div className='text-[14px] font-extrabold mb-1'>Volume(7d)</div>
            <div className='text-[15px] flex flex-row justify-between' style={{justifyContent: 'space-between'}}>
                <div className='flex flex-row mr-4'>
                  <span className='font-medium mr-1'>65.22</span>
                  <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
                </div>               
                <span className='font-medium text-[#38B000]'> +25%</span>
            </div>
        </div>
      </div>
      

    </div>
  )
}

export default CollectionCard
