import type {NextPage} from 'next'
import React from 'react'
import Image from 'next/image'
import NftForLaunch from '../../components/NftForLaunch'
import useLaunchPad, { LaunchPadType } from '../../hooks/useLaunchPad'
import Loading from '../../public/images/loading_f.gif'
import {FeaturedCard} from '../../components/launchpad/FeaturedCard'

const Launchpad: NextPage = () => {
  const { collectionsForLive, collectionsForComing } = useLaunchPad()

  return (
    <div className="pt-6 w-full">
      <div className="flex w-full justify-center">
        <div className={'bg-dark-gradient border-1 border-[#383838] rounded-[20px] backdrop-blur shadow-[0_0_30px_rgba(255,255,255,0.06)] w-[1000px] flex flex-col items-center pt-6 pb-10'}>
          <span className="bg-clip-text text-center text-transparent bg-rainbow-gradient text-extraxl font-bold shadow-[0_4_6px_rgba(0,0,0,0.25)]">connect through art</span>
          <span className={'text-secondary text-xg1'}>
            the best place to launch your next NFT collection
          </span>
          <a href={'https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad'} target={'_blank'} rel="noreferrer" className={'my-8'}>
            <span className={'bg-clip-text text-center text-transparent bg-primary-gradient text-xg1 font-medium'}>
                learn why
            </span>
          </a>
          <a
            href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'} target={'_blank'} rel="noreferrer">
            <div className={'flex items-center justify-center bg-primary-gradient rounded-full py-2 px-8 text-xxxl font-medium'}>
                creators apply here!
            </div>
          </a>
        </div>
      </div>
      {/*<div className="flex  justify-between">
        <div className="py-6 px-12 flex flex-col bg-l-50 space-y-4 ">
          <p className="text-xg1 italic font-bold text-center">
            **CREATORS**
          </p>
          <p className="text-xg text-[#A0B3CC]">
            Interested in launching your own collection?
          </p>
          <div className='flex items-center justify-center'>
            <div
              className="transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]">
              <Link
                href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'}>
                <a target="_blank">
                  <button
                    className="w-[304px] h-[64px] text-[32px] px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]">
                  apply to launchpad
                  </button>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex flex-column space-x-2 justify-center space-x-16 mt-[40px]">
            <Link href="https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad">
              <a target="_blank">
                <button className="py-1 text-[#B444F9] border-b-2 border-b-[#B444F9] bg-transparent">
                  learn more
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>*/}
      <div className="flex mt-12">
        <div className="text-primary-light text-xxxl pl-8">
          Featured Launches
        </div>
      </div>
        
      <div className={'mt-8 w-full'}>
        <div className={'flex space-x-8'}>
          {
            collectionsForLive.map((collection: LaunchPadType, index: number) => {
              return (
                <FeaturedCard key={index} collection={collection} />
              )
            })
          }
        </div>
      </div>
      <div className="mt-12">
        {
          (collectionsForLive?.length <= 0 && collectionsForComing?.length <= 0) &&
          <Image src={Loading} alt="Loading..." width="80px" height="80px"/>
        }
        {
          collectionsForComing.length > 0 &&
          <div className="">
            <p className="font-bold text-xl2 mb-[24px]">
              Upcoming Launches
            </p>
            <div className="flex flex-wrap space-x-12">
              {
                collectionsForComing.map((collection: LaunchPadType, index: any) => {
                  return <NftForLaunch
                    key={index}
                    typeNFT={collection.mint_status}
                    items={collection.itemsCnt}
                    col_url={collection.col_url}
                    name={collection.name}
                    img={collection.profile_image}
                    price={collection.price}
                  />
                })
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Launchpad
