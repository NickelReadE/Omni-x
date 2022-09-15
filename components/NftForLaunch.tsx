import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { chain_list } from '../utils/utils'
import { IPropsNFTItem } from '../interface/interface'
import LazyLoad from 'react-lazyload'
import {useDraggable} from '@dnd-kit/core'
import ConfirmSell from './collections/ConfirmSell'
import { cpuUsage, prependOnceListener } from 'process'

import useWallet from '../hooks/useWallet'
// import { addressesByNetwork } from '../constants'
import { SupportedChainId } from '../types'
import { postMakerOrder } from '../utils/makeOrder'
import { addDays } from 'date-fns'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import { ethers } from 'ethers'
import { getOrders, selectOrders,selectBidOrders, selectLastSaleOrders } from '../redux/reducers/ordersReducer'
import { selectCollections } from '../redux/reducers/collectionsReducer'
import { IGetOrderRequest } from '../interface/interface'
import { useDispatch, useSelector } from 'react-redux'
import editStyle from '../styles/nftbox.module.scss'
import classNames from '../helpers/classNames'
import { currencies_list } from '../utils/constants'

import Router from 'next/router'
interface ITypeNFT{
  typeNFT:string
}
const NftForLaunch = (pro:ITypeNFT) => {
  const typeNFT = pro.typeNFT
  return (
    <div className='border-[2px] border-[#F8F9FA]  rounded-[8px] '>
      <p className='font-bold text-xl2 mb-[24px]'>
        {typeNFT==='live'?'Live Launches':'Upcoming'}
        
      </p>
      <div className='flex flex-col bg-l-50 '>
        <div className="group relative flex justify-center text-center overflow-hidden rounded-md" >
          <img className='w-[300px] rounded-md ' src='/images/nft.png' alt="nft-image" />        
        </div>
        <div className="flex flex-row justify-between  px-3 align-middle  font-['RetniSans']">
          <div className=" text-[#000000] text-[14px] font-bold">
            Tiny Dinose
          </div>
        </div>
        <div className='flex px-3 justify-between'>    
          <div className='flex space-x-6'>
            <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
              <div className="flex items-center">
              items
              </div>
              <div className="flex items-center ">
              8000
              </div>
            </div>
            <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
              <div className="flex items-center ">
                price
              </div>
              <div className="flex items-center">
                0.1Eth
              </div>
            </div>
          </div>    
          <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
            <div className="flex items-center ">
              {typeNFT==='live'?'time remaining':'date'}
            </div>
            <div className="flex items-center  text-[#B00000] ">
              {typeNFT==='live'?'23hrs 10min':'5 Sep'}
              
            </div>
          </div>
        </div>
      </div>
      
      
      
    </div>
  )
}

export default NftForLaunch
