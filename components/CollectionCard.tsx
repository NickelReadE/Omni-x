import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import editStyle from '../styles/nftbox.module.scss'
import classNames from '../helpers/classNames'
import Loading from '../public/images/loading_f.gif'
import { useModal } from '../hooks/useModal'
import { ModalIDs } from '../contexts/modal'
import { longNumberShortify, numberShortify } from '../utils/constants'
import { calcVolumeUp } from '../utils/utils'

const CollectionCard = (props:any) => {
  const [imageError, setImageError] = useState(false)

  const { openModal, closeModal } = useModal()
  const collectionBid = {
    collectionUrl: props.collection.col_url as string,
    collectionAddressMap: props.collection.address
  }

  const onBuyFloor = (nft: any) => {
    const tradingInput = {
      collectionUrl: collectionBid.collectionUrl,
      collectionAddressMap: collectionBid.collectionAddressMap,
      tokenId: nft.token_id,
      selectedNFTItem: nft
    }

    openModal(ModalIDs.MODAL_BUY, {
      nftImage: nft.image,
      nftTitle: nft.name,
      order: nft.order_data,
      tradingInput,
      instantBuy: true,
      handleBuyDlgClose: closeModal
    })
  }

  const volumeUp = props.collection ? calcVolumeUp(props.collection.volume24h, props.collection.volume48h) : 0

  return (
    <div className={classNames(' border-[2px] border-[#F6F8FC] w-[340px] rounded-lg hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <div className='relative'>
        <div >
          <img className='nft-image w-[340px] background-fill' src={imageError?'/images/omnix_logo_black_1.png':props.collection.profile_image} alt="nft-image" onError={()=>{setImageError(true)}} data-src={props.collection.profile_image} />
        </div>
        <div className={classNames('absolute w-full h-full  flex items-center justify-center  ', editStyle.actionBtn)}>
          <div>
            <Link href={`/collections/${props.collection.col_url}`}>
              <div className='w-[230px] text-[18px] text-white text-extrabold text-center items-center bg-[#B444F9] rounded-lg mb-[24px]  py-[7px] hover:cursor-pointer'>view collection</div>
            </Link>

            <div
              className='w-[230px] text-[18px] text-white text-extrabold text-center items-center bg-[#38B000] rounded-lg  py-[7px]'
              onClick={() => {
                openModal(ModalIDs.MODAL_BID, {
                  nftImage: props.collection.profile_image,
                  nftTitle: props.collection.name,
                  collectionBid,
                  collectionInfo: props.collection,
                  onBuyFloor,
                  handleBidDlgClose: closeModal
                })
              }}
            >
              make a collection bid
            </div>
          </div>

        </div>
      </div>
      <div className="flex flex-row mt-2.5 justify-start">
        <div className="ml-3 text-[#000000] text-[20px] font-bold ">
          {props.collection.name}
        </div>
      </div>

      <div className="flex flex-row space-x-2 justify-between p-2">
        <div className={classNames(' col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)}>
          <div className='text-[14px] flex flex-col justify-between'>
            <span className='font-extrabold mr-[1px] text-center mb-1'>Items</span>
            <span className='font-medium text-[12px] text-center'>{props.collection?props.collection.itemsCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div  className={classNames(' col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-col justify-between'>
            <span className='font-extrabold mr-[1px] text-center mb-1'>Owners</span>
            <span className='font-medium text-[12px] text-center'>{props.collection?props.collection.ownerCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div className={classNames('col-span-2 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] flex flex-col justify-between'>
            <div className='text-[14px] flex flex-col justify-between'>
              <div className='text-[14px] font-extrabold  mb-1 text-center'>Floor</div>
              <div className='flex flex-row space-x-1 justify-center' >
                <span className='font-medium text-[12px]'>{props.collection?numberShortify(props.collection.floorPrice.omni):<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
                <img src='/images/currency/omni_asset.svg' className='w-[16px]' alt='asset img'></img>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames(' col-span-3 bg-l-50 p-2 rounded-lg',editStyle.valuePanel)} >
          <div className='text-[14px] font-extrabold mb-1 text-center'>Volume(24h)</div>
          <div className='text-[14px] flex flex-row justify-center' >
            <div className='flex flex-row mr-4'>
              <span className='font-medium mr-1 text-[12px]'>${props.collection?longNumberShortify(props.collection.volume24h):<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
            </div>
            <span className={classNames('font-medium text-[12px] ml-auto', volumeUp >= 0 ? 'text-[#38B000]': 'text-[#B00000]')}> {props.collection ? `${(numberShortify(volumeUp, 0))}%` : <Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
