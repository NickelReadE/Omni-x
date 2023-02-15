import React, {useMemo} from 'react'
import { useState } from 'react'
import Link from 'next/link'
import classNames from '../../helpers/classNames'
import useWallet from '../../hooks/useWallet'
import {TextBody, TextBodyemphasis, TextH3} from '../common/Basic'
import {formatDollarAmount} from '../../utils/numbers'
import {UserCollectionType} from '../../types/collections'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import {SecondaryButton} from '../common/buttons/SecondaryButton'

const UserCollectionCard = ({ collection, ethPrice }: { collection: UserCollectionType, ethPrice: number }) => {
  const { address } = useWallet()
  const [hover, setHover] = useState<boolean>(false)
  const [imageError, setImageError] = useState(false)

  const floor_price = useMemo(() => {
    if (collection.floor_prices.ethereum === 0) {
      return collection.floor_prices.stable
    }
    if (collection.floor_prices.stable === 0) {
      return collection.floor_prices.ethereum * ethPrice
    }
    return Math.min(collection.floor_prices.ethereum * ethPrice, collection.floor_prices.stable)
  }, [collection, ethPrice])

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
              src={imageError ? '/images/omni-logo-mint-cropped.jpg' : collection.profile_image}
              alt="nft-image"
              onError={() => { setImageError(true) }}
              data-src={collection.profile_image} />
          </div>
        </Link>
      </div>

      <div className={'flex flex-col justify-between h-[108px] space-y-2 p-3'}>
        <TextH3 className={'text-primary-light'}>
          {collection.name}
        </TextH3>

        {
          hover
            ?
            <div className={'flex items-center justify-between px-3 space-x-5'}>
              <SecondaryButton text={'create post'} className={'w-full flex-1'} />
              <PrimaryButton text={'edit collection'} className={'w-full flex-1'} />
            </div>
            :
            <div className="flex justify-between h-[48px]">
              <div className={'flex flex-col items-center justify-between'}>
                <TextBody className={'text-[#969696]'}>Items</TextBody>
                <TextBodyemphasis className={'text-primary-light'}>
                  {collection.items_count}
                </TextBodyemphasis>
              </div>
              <div className={'flex flex-col items-center justify-between'}>
                <TextBody className={'text-[#969696]'}>Owners</TextBody>
                <TextBodyemphasis className={'text-primary-light'}>
                  {collection.owners_count}
                </TextBodyemphasis>
              </div>
              <div className={'flex flex-col items-center justify-between'}>
                <TextBody className={'text-[#969696]'}>Floor</TextBody>
                <TextBodyemphasis className={'text-primary-light'}>
                  {formatDollarAmount(floor_price)}
                </TextBodyemphasis>
              </div>
              <div className={'flex flex-col items-center justify-between'}>
                <TextBody className={'text-[#969696]'}>Revenue</TextBody>
                <TextBodyemphasis className={'text-primary-light'}>
                  {collection.revenue}
                </TextBodyemphasis>
              </div>
            </div>
        }

      </div>

      <div className={`flex absolute top-3 left-3 rounded-[20px] bg-primary opacity-80 items-center px-2 py-1.5 space-x-1 ${hover ? 'block' : 'hidden'}`}>
        <div>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5023 2.75601L11.5024 2.75588C11.9009 2.35715 12.3741 2.04085 12.895 1.82505C13.4158 1.60924 13.974 1.49817 14.5378 1.49817C15.1015 1.49817 15.6598 1.60924 16.1806 1.82505C16.7014 2.04085 17.1746 2.35715 17.5732 2.75588L17.5734 2.75613C17.9721 3.15467 18.2884 3.62787 18.5042 4.14869C18.72 4.66951 18.8311 5.22775 18.8311 5.79151C18.8311 6.35527 18.72 6.9135 18.5042 7.43432C18.2884 7.95514 17.9721 8.42834 17.5734 8.82689L17.5733 8.82701L16.6016 9.79868L10.0003 16.4L3.39893 9.79868L2.42727 8.82701C1.6222 8.02195 1.16992 6.93004 1.16992 5.79151C1.16992 4.65297 1.6222 3.56107 2.42727 2.75601C3.23233 1.95094 4.32424 1.49866 5.46277 1.49866C6.60131 1.49866 7.69321 1.95094 8.49828 2.75601L9.46994 3.72767C9.76283 4.02057 10.2377 4.02057 10.5306 3.72767L11.5023 2.75601Z" stroke="#FF166A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default UserCollectionCard
