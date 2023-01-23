import React from 'react'
import {ITypeNFT} from '../interface/interface'
import Link from 'next/link'

const NftForLaunch = ({ items, img, name, col_url, price }: ITypeNFT) => {
  return (
    <div className="border-[#F8F9FA] rounded-lg hover:cursor-pointer">
      <div className={'flex flex-col bg-[#F6F8FC]'}>
        <div className={'relative'}>
          <div className={'group relative flex justify-center text-center overflow-hidden rounded-md'}>
            <img className="w-[300px] rounded-md " src={img ?? '/images/nft.png'} alt="nft-image"/>
          </div>
          <div
            className={'absolute w-full h-full  flex items-center justify-center'}>
            <div>
              <Link href={`/drops/${col_url}`}>
                <div
                  className="w-[230px] text-xg text-white	 text-extrabold text-center items-center bg-[#B444F9] rounded-lg  py-[7px] hover:cursor-pointer">view
                  collection
                </div>
              </Link>
            </div>

          </div>
        </div>

        <div className="flex flex-row justify-between  px-3 mt-[12px] align-middle  font-['RetniSans']">
          <div className=" text-[#000000] text-md font-bold">
            {name.toUpperCase()}
          </div>
        </div>
        <div className="flex px-3 justify-between">
          <div className="flex space-x-6">
            <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
              <div className="flex items-center">
                items
              </div>
              <div className="flex items-center ">
                {items}
              </div>
            </div>
            <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
              <div className="flex items-center ">
                price
              </div>
              <div className="flex items-center">
                {price}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
            {/* <div className="flex items-center ">
              {typeNFT==='Live'?'time remaining':'date'}
            </div>
            <div className="flex items-center  text-[#B00000] ">
              {typeNFT==='Live'?'23hrs 10min':'5 Sep'}
            </div> */}
            <div className="flex items-center  text-[#B00000] ">
              {'0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NftForLaunch
