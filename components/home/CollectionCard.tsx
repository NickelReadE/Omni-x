import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from '../../helpers/classNames'
import Loading from '../../public/images/loading_f.gif'
import { numberShortify } from '../../utils/constants'
import useWallet from '../../hooks/useWallet'
import {SecondaryButton} from '../common/buttons/SecondaryButton'
import {PrimaryButton} from '../common/buttons/PrimaryButton'

type CollectionType = {
  profile_image: string
  col_url: string
  name: string
  itemsCnt: number
  ownerCnt: number
  floorPrice: {
    omni: number
  }
}

interface ICollectionCardProps {
  collection: CollectionType
}

const CollectionCard = ({ collection }: ICollectionCardProps) => {
  const { address } = useWallet()
  const [hover, setHover] = useState<boolean>(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={classNames('relative bg-[#202020] rounded-lg hover:shadow-[0_0_12px_rgba(160,179,204,0.3)] max-w-[340px]')}
      onMouseEnter={() => {
        if (address) setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className='relative cursor-pointer'>
        <Link href={`/collections/${collection.col_url}`}>
          <div>
            <img
              className='nft-image w-full rounded-tr-[8px] rounded-tl-[8px] background-fill'
              src={imageError ? '/images/omnix_logo_black_1.png' : collection.profile_image}
              alt="nft-image"
              onError={() => { setImageError(true) }}
              data-src={collection.profile_image} />
          </div>
        </Link>
        {/*<div className={classNames('absolute w-full h-full rounded-tr-[8px] rounded-tl-[8px] flex items-center justify-center top-0', `${hover ? 'flex bg-[#303030b3] backdrop-blur block' : 'hidden top-0'}`)}>
          <div>
            <Link href={`/collections/${collection.col_url}`}>
              <div className='w-[230px] h-[40px] text-xg text-primary font-bold justify-center flex items-center bg-primary-gradient rounded-lg mb-[24px] hover:cursor-pointer'>view collection</div>
            </Link>
            <div className='border-gradient-radius w-[230px] h-[40px] hover:cursor-pointer'>
              <div className={'w-full h-full flex items-center justify-center'}>
                <span className='bg-primary-gradient text-xg font-bold text-center bg-clip-text text-transparent'>make a collection bid</span>
              </div>
            </div>
          </div>
        </div>*/}
      </div>

      <div className="flex flex-row mt-2.5 justify-between px-3">
        <div className="text-primary-light text-xg leading-[22px] font-bold ">
          {collection.name}
        </div>
      </div>

      <div className="flex flex-row space-x-2 justify-between p-2">
        <div className={classNames('col-span-2 flex p-2 rounded-lg')}>
          <div className='text-md flex flex-col justify-between'>
            <span className='mr-[1px] text-center text-secondary'>Items</span>
            <span className='font-medium text-md text-center text-primary-light'>{collection?collection.itemsCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div  className={classNames('col-span-2 flex p-2 rounded-lg')} >
          <div className='text-md flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <span className='mr-[1px] text-center text-secondary'>Owners</span>
            <span className='font-medium text-md text-center text-primary-light'>{collection?collection.ownerCnt:<Image src={Loading} alt='Loading...' width='20px' height='20px'/>}</span>
          </div>
        </div>
        <div className={classNames('col-span-2 flex p-2 rounded-lg')} >
          <div className='text-md flex flex-col justify-center' style={{justifyContent: 'space-between'}}>
            <div className='text-md mb-1 text-center text-secondary'>Floor</div>
            <div className='flex flex-row space-x-2 justify-center' >
              <span className='font-medium text-md mr-[px] text-primary-light'>
                {collection ? numberShortify(collection.floorPrice.omni) : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
              </span>
              <img src='/svgs/omni_asset.svg' className='w-[16px]' alt='asset img' />
            </div>
          </div>
        </div>
        <div className={classNames('col-span-3 flex flex-col p-2 rounded-lg')} >
          <div className='text-md mb-1 text-center text-secondary'>7d Volume</div>
          <div className='text-md flex flex-row justify-center space-x-4' >
            <div className='flex flex-row mr-4'>
              <span className='font-medium mr-1 text-md text-primary-light'>
                {collection ? 0 /* numberShortify(collection.totalVolume) */ : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
              </span>
              <img src='/images/chain/ethereum_solid.svg' className='' alt='asset img'></img>
            </div>
            <span className='font-medium text-[#38B000] text-md'>
              {collection ? '0%' /* numberShortify(collection.totalVolumeChange) */ : <Image src={Loading} alt='Loading...' width='20px' height='20px' />}
            </span>
          </div>
        </div>
      </div>

      <div className={`flex absolute top-3 left-3 rounded-[20px] bg-primary opacity-80 items-center px-2 py-1.5 space-x-1 ${hover ? 'block' : 'hidden'}`}>
        <div>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5023 2.75601L11.5024 2.75588C11.9009 2.35715 12.3741 2.04085 12.895 1.82505C13.4158 1.60924 13.974 1.49817 14.5378 1.49817C15.1015 1.49817 15.6598 1.60924 16.1806 1.82505C16.7014 2.04085 17.1746 2.35715 17.5732 2.75588L17.5734 2.75613C17.9721 3.15467 18.2884 3.62787 18.5042 4.14869C18.72 4.66951 18.8311 5.22775 18.8311 5.79151C18.8311 6.35527 18.72 6.9135 18.5042 7.43432C18.2884 7.95514 17.9721 8.42834 17.5734 8.82689L17.5733 8.82701L16.6016 9.79868L10.0003 16.4L3.39893 9.79868L2.42727 8.82701C1.6222 8.02195 1.16992 6.93004 1.16992 5.79151C1.16992 4.65297 1.6222 3.56107 2.42727 2.75601C3.23233 1.95094 4.32424 1.49866 5.46277 1.49866C6.60131 1.49866 7.69321 1.95094 8.49828 2.75601L9.46994 3.72767C9.76283 4.02057 10.2377 4.02057 10.5306 3.72767L11.5023 2.75601Z" stroke="#FF166A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className='text-md text-[#FF166A]'>
          24
        </span>
      </div>
      
      {/*button group at the bottom*/}
      <div className={`w-full flex items-center justify-between bg-[#202020] absolute h-[65px] right-0 left-0 bottom-0 rounded-br-[8px] rounded-bl-[8px] px-3 ${hover ? 'block' : 'hidden'}`}>
        <SecondaryButton text={'bid collection'} />
        <PrimaryButton text={'instant floor buy'} />
      </div>
    </div>
  )
}

export default CollectionCard
