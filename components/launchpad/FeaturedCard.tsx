import React, {useMemo} from 'react'
import Link from 'next/link'
import {TextBody, TextH3, TextSH2} from '../basic'
import {LaunchPadType} from '../../types/collections'

export const FeaturedCard = ({collection}: { collection: LaunchPadType }) => {
  const timeTillToMintStartTimestamp = useMemo(() => {
    const deltaTime = collection.mint_end_timestamp - (new Date().getTime() / 1000)
    const dayInMilliseconds = 60 * 60 * 24
    return deltaTime / dayInMilliseconds > 1 ? `${Math.floor(deltaTime / dayInMilliseconds)} days` : `${Math.floor(deltaTime / 60 / 60)} hours`
  }, [collection])

  return (
    <div className={'w-[450px] rounded-[12px] bg-[#202020] hover:shadow-[0_0_30px_#FFE817] cursor-pointer'}>
      <Link href={`/drops/${collection.col_url}`}>
        <div>
          <img
            className="w-full rounded-t-[12px]"
            src={collection.featured_image}
            alt="NFT drop"
          />
          <div className="flex flex-col py-4 px-3">
            <div className={'flex items-center justify-between'}>
              <TextH3 className={'text-primary-light'}>{collection.name}</TextH3>
              <TextSH2 className={'text-primary-light'}>{timeTillToMintStartTimestamp}</TextSH2>
            </div>
            <TextBody className={'text-secondary mt-4'}>{collection.description}</TextBody>
          </div>
        </div>
      </Link>
    </div>
  )
}
