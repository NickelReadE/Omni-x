import {TextH3, TextSH2} from '../basic'
import {formatDollarAmount} from '../../utils/numbers'

type FeaturedCollection = {
    image: string,
    name: string,
    floorPrice: number,
    ceilPrice: number,
}

const FeaturedCard = ({ collection }: { collection: FeaturedCollection }) => {
  return (
    <div className={'relative bg-[#00807D] rounded-[12px] aspect-[3/2] h-[300px]'}>
      <div className={'flex items-center justify-center bg-frame-gradient rounded-[12px] w-full h-full'}>
        <img src={'/images/home/featuredImage.png'} alt={'featured'} />
      </div>
      <div className={'flex justify-between items-center absolute bottom-0 left-0 w-full h-[60px] px-4'}>
        <TextH3 className={'text-white'}>{collection.name}</TextH3>
        <TextSH2 className={'text-white'}>{formatDollarAmount(collection.floorPrice)} - {formatDollarAmount(collection.ceilPrice)}</TextSH2>
      </div>
    </div>
  )
}

export const HomeFeatured = () => {
  return (
    <div className={'flex items-center justify-between space-x-10 mt-8 overflow-auto'}>
      <FeaturedCard collection={{
        image: '/images/home/featuredImage.png',
        name: 'Kanpai Pandas',
        floorPrice: 1200,
        ceilPrice: 15000,
      }} />
      <FeaturedCard collection={{
        image: '/images/home/featuredImage.png',
        name: 'Kanpai Pandas',
        floorPrice: 1200,
        ceilPrice: 15000,
      }} />
      <FeaturedCard collection={{
        image: '/images/home/featuredImage.png',
        name: 'Kanpai Pandas',
        floorPrice: 1200,
        ceilPrice: 15000,
      }} />
    </div>
  )
}
