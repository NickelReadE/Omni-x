import type { NextPage } from 'next'
import React from 'react'
import NftForLaunch from '../components/NftForLaunch'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/launchpad.module.scss'
import classNames from '../helpers/classNames'
import OmniCoin from '/images/omnicoin.svg'
import OX from '/images/ox.svg'
const Analytics: NextPage = () => {
  return (
    <div className='mt-[75px] w-full px-[90px] pt-[50px]'>
      <div className='flex  justify-between'>
        <div className='flex flex-col'>
          <p className='text-xxl2 font-bold italic'>OMNI X LAUNCHPAD</p>
          <p className='text-xl2'>art for everyone, everwhere </p>
        </div>
        <div className='flex space-x-12 '>
          <img className='w-[100px]' src='/images/ox.svg' alt='Omni coin'/>
          <img  className='w-[150px]' src='/images/omnicoin.svg' alt='OX'/>          
        </div>
        <div className='py-6 px-14 flex flex-col bg-l-50 space-y-4 '>
          <p className='text-xg1 italic font-bold text-center'>
            **CREATORS**
          </p>
          <p className='text-xg text-[#A0B3CC]'>
            Interested in launching your own collection?
          </p>
          <div className='flex space-x-2 justify-center space-x-6'>
            
            <Link href="https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad">
              <a target="_blank">
                <button className='px-2 py-1 text-[#B444F9] border-2 border-[#B444F9] bg-transparent rounded-lg'>
                  learn more
                </button>
              </a>
            </Link>
            
            <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'}>
              <a target="_blank">
                <button className='px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg'>
                  apply to launchpad
                </button>
              </a>                
            </Link>
          </div>
        </div>        
      </div>
      <div className='flex jutify-left'>
        <div className='text-[#B444F9] w-[600px] italic text-xg1 text-center '> 
          featured collection
        </div>
      </div>
      <div className='flex  justify-between mt-[30px]'>
        <img className='w-[600px]' src='/images/nft.png' alt='NFT'></img>
        <div className='flex flex-col space-y-2'>
          <p className='text-xxl2'>
            Tiny Dinos
          </p>
          <p className='w-[830px] text-xg1 text-[#A0B3CC]'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
          </p>
          <button className='px-2 py-1 w-[170px] bg-[#B444F9] text-white rounded-lg'>
            view collection
          </button>

        </div>
      </div>
      <div className='flex flew-wrap space-x-12 mt-[80px]'>
        <NftForLaunch typeNFT='live'/>
        <NftForLaunch typeNFT='upcoming'/>
      </div>
      <div className='bg-l-50 px-[40px] py-[30px] mt-[100px] mb-[50px]'>
        <p className='text-xxl2 font-bold italic'>
          Launch with Omni X
        </p>
        <div className='flex justify-center space-x-20 mt-[80px]'>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Superior UX
          </div>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Unparalleled Liquidity
          </div>
          <div className='flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold'>
            Extensive <br/> Support
          </div>
        </div>
        <div className='flex justify-center mt-[60px]'>
          <Link href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'}>
            <a target="_blank">
              <button className='px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg'>
                apply to launchpad
              </button>
            </a>                
          </Link>
        </div>
      </div>
    </div>
  )
  
}

export default Analytics
