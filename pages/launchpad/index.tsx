import type {NextPage} from 'next'
import React from 'react'
import Image from 'next/image'
import NftForLaunch from '../../components/NftForLaunch'
import useLaunchPad, { LaunchPadType } from '../../hooks/useLaunchPad'
import Loading from '../../public/images/loading_f.gif'
import {FeaturedCard} from '../../components/launchpad/FeaturedCard'

const Launchpad: NextPage = () => {
  const { loading, collectionsForComing, collectionsFeatured } = useLaunchPad()

  return (
    <div className="pt-[20px] w-full">
      <div className="flex w-full justify-center">
        <div className={'aspect-[3/1] flex justify-center'}>
          <div className={'bg-dark-gradient border-[1px] border-[#383838] rounded-[20px] backdrop-blur-[15px] w-[1000px] flex flex-col items-center py-6'}>
            <span className="bg-clip-text text-center text-transparent bg-rainbow-gradient text-extraxl font-bold text-shadow-sm">connect through art</span>
            <span className={'text-secondary text-xg1 text-shadow-sm'}>
            the best place to launch your next NFT collection
            </span>
            <a href={'https://omni-x.gitbook.io/omni-x-nft-marketplace/marketplace-features/launchpad'} target={'_blank'} rel="noreferrer" className={'my-8'}>
              <span className={'bg-clip-text text-center text-transparent bg-primary-gradient text-xg1 font-medium'}>
                learn why
              </span>
            </a>
            <a
              href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'} target={'_blank'} rel="noreferrer">
              <div className={'flex items-center justify-center bg-primary-gradient rounded-full py-2 px-8 text-xxxl font-medium hover:shadow-[0_0_6px_rgba(0,240,236,1)]'}>
                creators apply here!
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="flex mt-12">
        <div className="text-primary-light text-xxxl pl-8">
          Featured Launches
        </div>
      </div>
        
      <div className={'mt-8 w-full'}>
        <div className={'flex space-x-8'}>
          {
            collectionsFeatured.map((collection: LaunchPadType, index: number) => {
              return (
                <FeaturedCard key={index} collection={collection} />
              )
            })
          }
        </div>
      </div>
      <div className="mt-12">
        {
          loading &&
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
