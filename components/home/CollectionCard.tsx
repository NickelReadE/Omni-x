import React, {useMemo} from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useBalance } from 'wagmi'
import classNames from '../../helpers/classNames'
import useWallet from '../../hooks/useWallet'
import {ModalIDs} from '../../contexts/modal'
import {useModal} from '../../hooks/useModal'
import useData from '../../hooks/useData'
import {TextBodyemphasis, TextH3} from '../common/Basic'
import {formatDollarAmount} from '../../utils/numbers'
import {FullCollectionType} from '../../types/collections'

const CollectionCard = ({ collection, ethPrice }: { collection: FullCollectionType, ethPrice: number }) => {
  const { address } = useWallet()
  const { openModal, closeModal } = useModal()
  const { totalUSDCBalance, totalUSDTBalance } = useData()
  const { data: nativeBalance } = useBalance({
    address: `0x${address?.substring(2)}`,
  })
  const [hover, setHover] = useState<boolean>(false)
  const [imageError, setImageError] = useState(false)

  const collectionBid = {
    collectionUrl: collection.col_url as string,
    collectionAddressMap: collection.address
  }

  const onBuyFloor = (nft: any) => {
    const tradingInput = {
      collectionUrl: collectionBid.collectionUrl,
      collectionAddressMap: collectionBid.collectionAddressMap,
      tokenId: nft.token_id,
      selectedNFTItem: nft
    }

    openModal(ModalIDs.MODAL_BUY, {
      nftImage: nft.image,
      nftTitle: nft.name,
      nftTokenId: nft.token_id,
      collectionName: collection.name,
      order: nft.order_data,
      tradingInput,
      instantBuy: true,
      handleBuyDlgClose: closeModal
    })
  }
  // REWRITE THIS FUNCTION!!! It only captures NFTs listed in OMNI
  const getValidFloorNFT = () => {
    for (const kind in collection.floorPrice) {
      const floorPrice = collection.floorPrice[kind]
      if (floorPrice > 0) {
        if (kind === 'omni') {
          return collection.floorNft[kind]
        } else if (kind === 'usd' || kind === 'usdc' || kind === 'usdt') {
          if (floorPrice <= totalUSDCBalance || floorPrice <= totalUSDTBalance) {
            return collection.floorNft[kind]
          }
        } else if (kind === 'eth' && nativeBalance?.formatted) {
          // if (floorPrice <= (+nativeBalance.formatted))
          return collection.floorNft[kind]
        }
      }
    }
  }

  const floor_price = useMemo(() => {
    return Math.min(collection.floor_prices.ethereum * ethPrice, collection.floor_prices.stable)
  }, [collection, ethPrice])

  const ceil_price = useMemo(() => {
    return Math.max(collection.ceil_prices.ethereum * ethPrice, collection.ceil_prices.stable)
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
              src={imageError ? '/images/omnix_logo_black_1.png' : collection.profile_image}
              alt="nft-image"
              onError={() => { setImageError(true) }}
              data-src={collection.profile_image} />
          </div>
        </Link>
      </div>

      <div className={'flex flex-col justify-between h-[90px] pt-3 px-3 pb-4'}>
        <TextH3 className={'text-primary-light'}>
          {collection.name}
        </TextH3>

        <div className="flex justify-left">
          <TextBodyemphasis className={'text-transparent bg-primary-gradient bg-clip-text'}>
            {formatDollarAmount(floor_price)} - {formatDollarAmount(ceil_price)}
          </TextBodyemphasis>
        </div>
      </div>

      <div className={`flex absolute top-3 left-3 rounded-[20px] bg-primary opacity-80 items-center px-2 py-1.5 space-x-1 ${hover ? 'block' : 'hidden'}`}>
        <div>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5023 2.75601L11.5024 2.75588C11.9009 2.35715 12.3741 2.04085 12.895 1.82505C13.4158 1.60924 13.974 1.49817 14.5378 1.49817C15.1015 1.49817 15.6598 1.60924 16.1806 1.82505C16.7014 2.04085 17.1746 2.35715 17.5732 2.75588L17.5734 2.75613C17.9721 3.15467 18.2884 3.62787 18.5042 4.14869C18.72 4.66951 18.8311 5.22775 18.8311 5.79151C18.8311 6.35527 18.72 6.9135 18.5042 7.43432C18.2884 7.95514 17.9721 8.42834 17.5734 8.82689L17.5733 8.82701L16.6016 9.79868L10.0003 16.4L3.39893 9.79868L2.42727 8.82701C1.6222 8.02195 1.16992 6.93004 1.16992 5.79151C1.16992 4.65297 1.6222 3.56107 2.42727 2.75601C3.23233 1.95094 4.32424 1.49866 5.46277 1.49866C6.60131 1.49866 7.69321 1.95094 8.49828 2.75601L9.46994 3.72767C9.76283 4.02057 10.2377 4.02057 10.5306 3.72767L11.5023 2.75601Z" stroke="#FF166A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* <div className={`w-full flex items-center bg-[#202020] absolute right-0 left-0 bottom-3 rounded-br-[8px] rounded-bl-[8px] px-3 ${hover ? 'block' : 'hidden'}`}> */}
      <button
        className={`bg-primary-green absolute bottom-0 w-full py-2 px-4 rounded-b-lg h-[38px] ${hover ? 'block' : 'hidden'}`}
        onClick={ () => {
          const floorNft = getValidFloorNFT()
          if (floorNft) {
            onBuyFloor(floorNft)
          } else {
            console.log('-no floor nft to buy-')
          }
        }}>
        <TextBodyemphasis className={'text-primary'}>buy floor now</TextBodyemphasis>
      </button>
      {/* </div> */}
    </div>
  )
}

export default CollectionCard
