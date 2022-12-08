import React from 'react'
import Link from 'next/link'
import {LaunchPadType} from '../../hooks/useLaunchPad'

export const FeaturedCard = ({collection}: { collection: LaunchPadType }) => {
  return (
    <div className={'w-[600px]'}>
      <Link href={`/launchpad/${collection.col_url}`}>
        <img
          className="w-[600px] hover:cursor-pointer"
          src={collection.profile_image}
          alt="NFT">
        </img>
      </Link>
      <div className="flex flex-col pt-4">
        <span className={'text-xl3 text-primary-light'}>{collection.name}</span>
        <Link href={`/launchpad/${collection.col_url}`}>
          <span className={'bg-clip-text text-transparent bg-primary-gradient text-xg font-medium cursor-pointer mt-4'}>
            view launchpad page
          </span>
        </Link>
        <span className={'text-secondary font-["CircularXX TT"] text-xg1 mt-4'}>{collection.description}</span>
      </div>
    </div>
  )
}