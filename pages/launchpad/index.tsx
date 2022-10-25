import type {NextPage} from 'next'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NftForLaunch from '../../components/NftForLaunch'
import useLaunchPad, { LaunchPadType } from '../../hooks/useLaunchPad'
import Loading from '../../public/images/loading_f.gif'

const Launchpad: NextPage = () => {
  const { collectionsForLive, collectionsForComing, sampleCollection } = useLaunchPad()

  return (
    <div className="mt-[75px] w-full px-[130px] pt-[50px]">
      <div className="flex  justify-between">
        <div className="flex flex-col">
          <p className="text-xxl2 font-bold italic">OMNI X LAUNCHPAD</p>
          <p className="text-xl2">art for everyone, everwhere </p>
        </div>
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
      </div>
      <div className="flex jutify-left">
        <div className="text-[#B444F9] w-[600px] italic text-xg1 text-center ">
          featured collection
        </div>
      </div>
      {
        !sampleCollection &&
          <Image src={Loading} alt="Loading..." width="80px" height="80px"/>
      }
      {
        sampleCollection && 
          <div className="flex  justify-between mt-[30px]">
            <Link href={`/launchpad/${sampleCollection.col_url}`}>
              <img
                className="w-[600px] hover: cursor-pointer"
                src={sampleCollection.profile_image}
                alt="NFT">
              </img>
            </Link>
            <div className="flex flex-col">
              <p className="text-xxl2">
                {sampleCollection.name}
              </p>
              <p className="w-[830px] text-xg1 text-[#A0B3CC]">
                {sampleCollection.description}
              </p>
              <Link href={`/collections/${sampleCollection.col_url}`}>
                <button className="mt-[25px] px-2 py-1 w-[170px]  bg-[#B444F9] text-white rounded-lg">
                  view collection
                </button>
              </Link>
            </div>
          </div>
      }
      <div className="mt-[80px]">
        {
          (collectionsForLive?.length <= 0 && collectionsForComing?.length <= 0) &&
          <Image src={Loading} alt="Loading..." width="80px" height="80px"/>
        }

        {
          collectionsForLive.length > 0 &&
          <div className="">
            <p className="font-bold text-xl2 mb-[24px]">
              Live Launches
            </p>
            <div className="flex flex-wrap space-x-12">
              {
                collectionsForLive.map((collection: LaunchPadType, index: any) => {
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

        {
          collectionsForComing.length > 0 &&
          <div className="">
            <p className="font-bold text-xl2 mb-[24px]">
              Upcoming
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
      <div className="bg-l-50 px-[40px] py-[30px] mt-[100px] mb-[50px]">
        <p className="text-xxl2 font-bold italic">
          Launch with Omni X
        </p>
        <div className="flex justify-center space-x-20 mt-[80px]">
          <div
            className="flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold">
            Superior UX
          </div>
          <div
            className="flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold">
            Unparalleled Liquidity
          </div>
          <div
            className="flex justify-center items-center w-[140px] h-[140px] text-center text-black rounded-[100%] border-2 border-black ext-xl font-bold">
            Extensive <br/> Support
          </div>
        </div>
        <div className="flex justify-center mt-[60px]">
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
    </div>
  )

}

export default Launchpad
