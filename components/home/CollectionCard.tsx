import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from '../../helpers/classNames'
import Loading from '../../public/images/loading_f.gif'
import { numberShortify } from '../../utils/constants'
import useWallet from '../../hooks/useWallet'

const CollectionCard = (props:any) => {
  const { address } = useWallet()
  const [hover, setHover] = useState<boolean>(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={classNames('relative bg-[#202020] rounded-[8px] hover:shadow-[0_0_12px_rgba(160,179,204,0.3)]')}
      onMouseEnter={() => {
        if (address) setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className='relative'>
        <div>
          <img
            className='nft-image w-[340px] rounded-tr-[8px] rounded-tl-[8px] background-fill'
            src={imageError ? '/images/omnix_logo_black_1.png' : props.collection.profile_image}
            alt="nft-image"
            onError={() => { setImageError(true) }}
            data-src={props.collection.profile_image} />
        </div>
        <div className={classNames('absolute w-full h-full rounded-tr-[8px] rounded-tl-[8px] flex items-center justify-center top-0', `${hover ? 'flex bg-[#303030b3] backdrop-blur block' : 'hidden top-0'}`)}>
          <div>
            <Link href={`/collections/${props.collection.col_url}`}>
              <div className='w-[230px] h-[40px] text-xg text-primary text-extrabold text-center items-center bg-primary-gradient rounded-lg mb-[24px] py-[7px] hover:cursor-pointer'>view collection</div>
            </Link>
            <div className='border-gradient-radius w-[230px] h-[40px] hover:cursor-pointer'>
              <div className={'w-full h-full flex items-center justify-center'}>
                <span className='bg-primary-gradient text-xg text-extrabold text-center bg-clip-text text-transparent'>make a collection bid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-2.5 justify-between px-3">
        <div className="text-primary-light text-xg leading-[22px] font-bold ">
          {props.collection.name}
        </div>
        <div className="flex items-center space-x-1">
          <div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M15.6301 3.4574C15.247 3.07416 14.7922 2.77014 14.2916 2.56272C13.791 2.3553 13.2545 2.24854 12.7126 2.24854C12.1707 2.24854 11.6342 2.3553 11.1336 2.56272C10.633 2.77014 10.1782 3.07416 9.79509 3.4574L9.00009 4.2524L8.20509 3.4574C7.43132 2.68364 6.38186 2.24894 5.28759 2.24894C4.19331 2.24894 3.14386 2.68364 2.37009 3.4574C1.59632 4.23117 1.16162 5.28063 1.16162 6.3749C1.16162 7.46918 1.59632 8.51864 2.37009 9.2924L3.16509 10.0874L9.00009 15.9224L14.8351 10.0874L15.6301 9.2924C16.0133 8.90934 16.3174 8.45451 16.5248 7.95392C16.7322 7.45333 16.839 6.91677 16.839 6.3749C16.839 5.83304 16.7322 5.29648 16.5248 4.79589C16.3174 4.29529 16.0133 3.84047 15.6301 3.4574Z" fill="url(#paint0_linear_185_2339)"/>
              <defs>
                <linearGradient id="paint0_linear_185_2339" x1="4.10112" y1="2.24853" x2="17.2643" y2="5.89337" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FA16FF"/>
                  <stop offset="1" stopColor="#F00056"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className='bg-clip-text text-transparent text-[15px] leading-[18px] opacity-50' style={{ backgroundImage: 'linear-gradient(103.58deg, #FA16FF 15.1%, #F00056 87.92%)' }}>
            24
          </span>
        </div>
      </div>

      <div className="flex flex-row space-x-2 justify-between p-2">
        <div className={classNames('col-span-2 flex p-2 rounded-lg')}>
          <div className='text-md flex flex-col justify-between'>
            <span className='mr-[1px] text-center text-secondary font-medium'>Items</span>
            <span className='font-medium text-sm text-center text-primary-light'>{props.collection?props.collection.itemsCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div  className={classNames('col-span-2 flex p-2 rounded-lg')} >
          <div className='text-md flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <span className='mr-[1px] text-center text-secondary font-medium'>Owners</span>
            <span className='font-medium text-sm text-center text-primary-light'>{props.collection?props.collection.ownerCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div className={classNames('col-span-2 flex p-2 rounded-lg')} >
          <div className='text-md flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <div className='text-md font-medium  mb-1 text-center text-secondary'>Floor</div>
            <div className='flex flex-row space-x-2 justify-center' >
              <span className='font-medium text-sm mr-[px] text-primary-light'>
                {props.collection ? numberShortify(props.collection.floorPrice.omni) : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
              </span>
              <img src='/svgs/omni_asset.svg' className='w-[16px]' alt='asset img'></img>
            </div>
          </div>
        </div>
        <div className={classNames('col-span-3 flex flex-col p-2 rounded-lg')} >
          <div className='text-md font-medium mb-1 text-center text-secondary'>Volume(7d)</div>
          <div className='text-md flex flex-row justify-center space-x-4' >
            <div className='flex flex-row mr-4'>
              <span className='font-medium mr-1 text-sm text-primary-light'>
                {props.collection ? 0 /* numberShortify(props.collection.totalVolume) */ : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
              </span>
              <img src='/svgs/ethereum.svg' className='w-[16px]' alt='asset img'></img>
            </div>
            <span className='font-medium text-[#38B000] text-sm'>
              {props.collection ? '0%' /* numberShortify(props.collection.totalVolumeChange) */ : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
            </span>
          </div>
        </div>
      </div>

      <div className={`w-full h-[62px] flex items-center justify-center text-xg bg-dark-green text-white absolute bottom-0 rounded-br-[8px] rounded-bl-[8px] ${hover ? 'block' : 'hidden'}`}>
        instant floor buy
      </div>
    </div>
  )
}

export default CollectionCard
