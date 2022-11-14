import {CollectionType} from '../../hooks/useCollection'
import React, {useEffect, useMemo, useState} from 'react'
import {truncateAddress} from '../../utils/utils'
import useWallet from '../../hooks/useWallet'
import {useDispatch, useSelector} from 'react-redux'
import {getRoyalty, selectRoyalty} from '../../redux/reducers/collectionsReducer'
import {GradientButton} from '../basic'

interface CollectionBannerProps {
    collection: CollectionType
}

export const CollectionBanner = ({ collection }: CollectionBannerProps) => {
  const { chainId, signer } = useWallet()
  const royalty = useSelector(selectRoyalty)
  const [avatarError, setAvatarError] = useState(false)

  const dispatch = useDispatch()

  const collectionAddress = useMemo(() => {
    if (chainId) {
      return collection.address[chainId.toString()]
    }
  }, [collection, chainId])

  useEffect(() => {
    if (dispatch && signer) {
      dispatch(getRoyalty('ERC721', '0x4aA142f1Db95B50dA7ca22267Da557050f9A7Ec9', 5, signer) as any)
    }
  }, [dispatch, signer])

  return (
    <div className={'w-full flex items-center justify-center'}>
      <div className={'w-[1000px]'}>
        <div className={'h-[350px] relative'}>
          <img
            src={collection.banner_image}
            className="banner-slider h-full"
            alt={'banner'}
          />
          <div className="bottom-[-80px] left-6 h-[120px] absolute flex items-end">
            <img
              src={collection.profile_image}
              alt="avatar"
              onError={() => {
                collection.profile_image && setAvatarError(true)
              }}
              width={120}
              height={120}
              className={'rounded-[8px]'}
            />
          </div>
        </div>

        <div className={'flex items-end w-full space-x-4 pl-[160px]'}>
          <div className={'flex flex-col space-y-2'}>
            <span className={'text-xg1 text-primary-light'}>{collection.name}</span>
            <span className={'text-md text-secondary'}>{truncateAddress(collectionAddress)}</span>
          </div>
          <div className={'flex flex-col items-center space-y-2'}>
            <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
            <span className={'text-md text-secondary'}>items</span>
          </div>
          <div className={'flex flex-col items-center space-y-2'}>
            <span className={'text-xg text-primary-light'}>{collection.ownerCnt}</span>
            <span className={'text-md text-secondary'}>owners</span>
          </div>
          <div className={'flex flex-col items-center space-y-2'}>
            <span className={'text-xg text-primary-light'}>{royalty}%</span>
            <span className={'text-md text-secondary'}>creator&nbsp;fee</span>
          </div>
          <div className={'flex flex-col items-center space-y-2'}>
            <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
            <span className={'text-md text-secondary'}>7d&nbsp;vol</span>
          </div>
          <div className={'flex flex-col space-y-2'}>
            <GradientButton width={67} height={26} title={'follow'} />
            <span className={'text-md text-primary-light'}>1.65k followers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
