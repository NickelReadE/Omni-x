import React from 'react'
import Link from 'next/link'
import {TextBody, TextH3, TextSH2} from '../basic'
import {LaunchPadType} from '../../types/collections'

export const FeaturedCard = ({collection}: { collection: LaunchPadType }) => {
  return (
    <div className={'w-[450px] rounded-[12px] bg-[#202020]'}>
      <Link href={`/drops/${collection.col_url}`}>
        <img
          className="w-full hover:cursor-pointer rounded-t-[12px]"
          src={collection.profile_image}
          alt="NFT"
        />
      </Link>
      <div className="flex flex-col py-4 px-3">
        <div className={'flex items-center justify-between'}>
          <TextH3 className={'text-primary-light'}>{collection.name}</TextH3>
          <TextSH2 className={'text-primary-light'}>1d 8hrs</TextSH2>
        </div>
        <TextBody className={'text-secondary mt-4'}>{collection.description}</TextBody>
      </div>
    </div>
  )
}
