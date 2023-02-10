import React from 'react'
import type {NextPage} from 'next'
import Router from 'next/router'
import DropCard from '../../components/drops/DropCard'
import useLaunchPad from '../../hooks/useLaunchPad'
import {FeaturedCard} from '../../components/drops/FeaturedCard'
import {SkeletonCard} from '../../components/common/skeleton/Card'
import {TextBodyemphasis, TextH1, TextH2, TextSH2} from '../../components/common/Basic'
import {PrimaryButton} from '../../components/common/buttons/PrimaryButton'
import {LaunchPadType} from '../../types/collections'

const Launchpad: NextPage = () => {
  const { loading, collectionsForComing, collectionsFeatured, collectionsForPast } = useLaunchPad()

  return (
    <div className="w-full">
      <div className="flex w-full justify-center">
        <div className={'flex flex-col items-center py-8'}>
          <TextH1 className="bg-clip-text text-transparent bg-rainbow-gradient text-shadow-sm">connect through art</TextH1>
          <TextSH2 className={'text-secondary text-shadow-sm'}>
            the best place to launch your next NFT collection
          </TextSH2>
          <div className={'flex items-center space-x-4 mt-4'}>
            <PrimaryButton text={'learn more'} background={'bg-primary'} onClick={() => Router.push('/learn-more')} />
            <a
              href={'https://docs.google.com/forms/d/e/1FAIpQLSf6VCJyF1uf9SZ9BJwbGuP7bMla7JzOXMg6ctXN6SlSgNgFlw/viewform?usp=pp_url'} target={'_blank'} rel="noreferrer">
              <div className={'flex items-center justify-center bg-primary-gradient rounded-full py-2 px-4 hover:shadow-[0_0_6px_rgba(0,240,236,1)]'}>
                <TextBodyemphasis>creators apply here!</TextBodyemphasis>
              </div>
            </a>
          </div>
        </div>
      </div>

      {loading ?
        <SkeletonCard/>
        :
        <>
          <div className="flex flex-col mt-8">
            <TextH2 className="text-primary-light">
              Live Drops
            </TextH2>
            <TextSH2 className={'text-secondary'}>
              minting is live on these awesome projects!
            </TextSH2>
          </div>

          <div className={'mt-6 w-full'}>
            <div className={'flex space-x-8'}>
              {
                collectionsFeatured.map((collection: LaunchPadType, index: number) => {
                  return (
                    <FeaturedCard key={index} collection={collection}/>
                  )
                })
              }
            </div>
          </div>
          {
            collectionsForComing.length > 0 &&
            <div className="mt-12">
              <TextH2 className="text-primary-light">
                Upcoming Drops
              </TextH2>
              <TextSH2 className={'text-secondary'}>
                explore Omni X vetted projects with incredible promise
              </TextSH2>
              <div className="flex flex-wrap space-x-12">
                {
                  collectionsForComing.map((collection: LaunchPadType, index: any) => {
                    return <FeaturedCard key={index} collection={collection}/>
                  })
                }
              </div>
            </div>
          }

          {
            collectionsForPast.length > 0 &&
            <div className="mt-12">
              <TextH2 className="text-primary-light">
                Past Drops
              </TextH2>
              <div className="flex flex-wrap mt-6 space-x-12">
                {
                  collectionsForPast.map((collection: LaunchPadType, index: any) => {
                    return <DropCard
                      key={index}
                      collection={collection}
                    />
                  })
                }
              </div>
            </div>
          }
        </>
      }
    </div>
  )
}

export default Launchpad
