import Image from 'next/image'
import {TextBody, TextBodyemphasis, TextH3, TextSubtext} from '../common/Basic'

export const CollectionPostCard = () => {
  return (
    <div className={'w-[450px] bg-[#202020] border-[0.1px] border-secondary rounded-[8px] py-3'}>
      <div className={'px-3 flex items-center justify-between'}>
        <div className={'flex items-center space-x-3'}>
          <Image src={'/images/home/collectionIcon.png'} alt={'collectionIcon'} width={46} height={46}/>
          <div className={'flex flex-col justify-around h-full'}>
            <div className={'flex items-center space-x-2'}>
              <TextBodyemphasis className={'text-primary-light'}>Kanpai Pandas</TextBodyemphasis>
              <TextSubtext className={'text-secondary'}>0xdefgh2...</TextSubtext>
            </div>
            <TextSubtext className={'text-secondary'}>posted 10.10.2022</TextSubtext>
          </div>
        </div>
        <Image src={'/images/icons/three_dots.svg'} alt={'three dots'} width={32} height={32}/>
      </div>

      <div className={'mt-4'}>
        <img src={'/images/home/featured_image.png'} alt={'featured_image'} />
      </div>

      <div className={'flex flex-col space-y-3 p-3'}>
        <TextH3 className={'text-primary-light'}>NFT NYC Kanpai Pandas Party</TextH3>
        <div className={'flex items-center'}>
          <Image src={'/images/icons/calendar_small.svg'} alt={'small icon'} width={18} height={18} />
          <TextBody className={'text-primary-light'}>Monday, April 14th</TextBody>
          <Image src={'/images/icons/clock.svg'} alt={'small icon'} className={'ml-6'} width={18} height={18} />
          <TextBody className={'text-primary-light'}>9:30pm - 12:30am</TextBody>
        </div>
        <TextBody className={'text-secondary'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.
        </TextBody>
        <TextSubtext className={'text-comment'}>https://partiful.com/e/9D3kOT9HgdWI4gChETpX</TextSubtext>
        <div className={'flex'}>
          <Image src={'/images/icons/map_pin.svg'} alt={'small icon'} width={18} height={18} />
          <TextBody className={'text-primary-light'}>191 Christie St</TextBody>
        </div>
        <div className={'flex items-center justify-between'}>
          <div className={'flex items-center space-x-3'}>
            <TextSubtext className={'text-like'}>24</TextSubtext>
            <TextSubtext className={'text-comment'}>12</TextSubtext>
          </div>
          <TextBody className={'bg-clip-text text-transparent bg-primary-gradient'}>add to calendar</TextBody>
        </div>
      </div>
    </div>
  )
}
