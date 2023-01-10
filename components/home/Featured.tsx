import {TextH3, TextSH2} from '../basic'

const FeaturedCard = () => {
  return (
    <div className={'relative bg-[#00807D] rounded-[12px] aspect-[3/2] h-[300px]'}>
      <div className={'flex items-center justify-center bg-frame-gradient rounded-[12px] w-full h-full'}>
        <img src={'/images/home/featuredImage.png'} alt={'featured'} />
      </div>
      <div className={'flex justify-between items-center absolute bottom-0 left-0 w-full h-[60px] px-4'}>
        <TextH3 className={'text-white'}>Kanpai Pandas</TextH3>
        <TextSH2 className={'text-white'}>$1.2k - $14.9k</TextSH2>
      </div>
    </div>
  )
}

export const HomeFeatured = () => {
  return (
    <div className={'flex items-center justify-between space-x-10 mt-8'}>
      <FeaturedCard />
      <FeaturedCard />
      <FeaturedCard />
    </div>
  )
}