import {FavoriteCollectionType} from '../../types/collections'
import {TextH3} from '../common/Basic'

export const FavoriteCollectionHeader = () => {
  return (
    <div className={'grid grid-cols-8 gap-5'}>
      <div className={'col-span-2'}></div>
      <span className={'text-primary-light'}>volume</span>
      <span className={'text-primary-light'}>% changes</span>
      <span className={'text-primary-light'}>floor</span>
      <span className={'text-primary-light'}>sales</span>
      <span className={'text-primary-light'}>unique owners</span>
      <span className={'text-primary-light'}>listed</span>
    </div>
  )
}

export const FavoriteCollection = ({ collection }: { collection: FavoriteCollectionType }) => {
  return (
    <div className={'grid grid-cols-8 gap-5 items-center'}>
      <div className={'col-span-2 bg-[#202020] rounded-lg h-[64px] flex items-center space-x-3 px-2'}>
        <img alt={'profile image'} src={collection.profile_image} className={'rounded-[4px] h-[48px]'}/>
        <TextH3 className={'text-primary-light'}>{collection.name}</TextH3>
      </div>
      <span className={'text-primary-light'}>{collection.total_volume}</span>
      <span className={'text-primary-light'}>0</span>
      <span className={'text-primary-light'}>{collection.floor_prices.stable}</span>
      <span className={'text-primary-light'}>{collection.sales_count || 0}</span>
      <span className={'text-primary-light'}>{collection.owners_count}</span>
      <span className={'text-primary-light'}>{collection.listed_count || 0}</span>
    </div>
  )
}
