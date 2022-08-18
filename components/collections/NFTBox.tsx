import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IPropsNFTItem } from '../../interface/interface'
import LazyLoad from 'react-lazyload'
import USD from '../../public/images/USD.png'
import { ethers } from 'ethers'
import editStyle from '../../styles/nftbox.module.scss'
import classNames from '../../helpers/classNames'

const NFTBox = ({nft, col_url, chain}: IPropsNFTItem) => {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className={classNames('w-full border-[2px] border-[#F6F8FC] rounded-[8px] hover:shadow-[0_0_8px_rgba(0,0,0,0.25)] hover:bg-[#F6F8FC]', editStyle.nftContainer)}>
      <Link href={`/collections/${col_url}/${nft.token_id}`}>
        <a>
          <div className="relative w-full">
            <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="nft-image" />}>
              <img className='collection-nft-image-item' src={imageError||nft.image==null?'/images/omnix_logo_black_1.png':nft.image} alt="nft-image" onError={(e)=>{setImageError(true)}} data-src={nft.image} />
            </LazyLoad>
            <div className={classNames('absolute top-[8px] right-[9px] p-[12px]', editStyle.ellipseBtn)}>
              <div className="bg-[url('/images/ellipse.png')] hover:bg-[url('/images/ellipse_hover.png')] bg-cover w-[21px] h-[21px]"></div>
            </div>
          </div>
          <div className="text-[#6C757D] text-[14px] font-medium  mt-3 ml-3">
            {nft.name}
          </div>
          <div className="flex flex-row mt-2.5 mb-3.5 justify-between align-middle">
            <div className="flex items-center ml-3">
              <img src="/svgs/ethereum.svg" className="w-[18px] h-[18px]" />
              <span className="text-[#1E1C21] text-sm ml-2"> {nft.price && ethers.utils.formatEther(nft.price)}</span>
            </div>
            <div className="mr-3 flex items-center">
              <div className={classNames("mr-3 flex items-center cursor-pointer bg-[url('/images/round-refresh.png')] hover:bg-[url('/images/round-refresh_hover.png')] bg-cover w-[20px] h-[20px]", editStyle.refreshBtn)}></div>
              <div className="flex items-center ml-1">
                {(chain === 'eth' || chain === 'rinkeby') &&
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
                {/* <span className="text-[#6C757D] text-sm mr-2">Chain : </span> */}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default NFTBox
