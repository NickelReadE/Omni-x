import {FavoriteItemType} from '../../types/collections'
import {TextBody} from '../common/Basic'

export const FavoriteItemHeader = () => {
  return (
    <div className={'grid grid-cols-7 gap-5'}>
      <div className={'col-span-2'}></div>
      <span className={'text-primary-light'}>list price</span>
      <span className={'text-primary-light'}>last sale</span>
      <span className={'text-primary-light'}>highest bid</span>
      <span className={'text-primary-light'}>sales</span>
      <span className={'text-primary-light'}>likes</span>
    </div>
  )
}

export const FavoriteItem = ({ item }: { item: FavoriteItemType }) => {
  return (
    <div className={'grid grid-cols-7 gap-5 items-center'}>
      <div className={'col-span-2 bg-[#202020] rounded-lg h-[64px] flex items-center space-x-3 px-2'}>
        <img src={item.image} alt={'image'} className={'rounded-[4px] h-[48px]'}/>
        <div className={'flex flex-col justify-between'}>
          <TextBody className={'text-secondary'}>{item.name}</TextBody>
          <TextBody className={'text-primary-light'}>#{item.token_id}</TextBody>
        </div>
      </div>
      <span className={'text-primary-light'}>{item.price}</span>
      <span className={'text-primary-light'}>{item.last_sale_price}</span>
      <span className={'text-primary-light'}>{item.highest_bid}</span>
      <span className={'text-primary-light'}>{item.sale_count}</span>
      <span className={'text-primary-light'}>{item.likes}</span>
    </div>
  )
}
