import {NextPage} from 'next'
import Image from 'next/image'
import {TextBodyemphasis, TextH2} from '../../../components/basic'
import {PrimaryButton} from '../../../components/common/buttons/PrimaryButton'

const Tag = ({active, label}: {active: boolean, label: string}) => {
  return (
    <div className={'py-1 px-2 bg-[#202020] border-[0.5px] border-secondary rounded-[4px]'}>
      <TextBodyemphasis className={`${active ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-primary-light'} leading-[16px]`}>{label}</TextBodyemphasis>
    </div>
  )
}

const CollectionEdit: NextPage = () => {
  return (
    <div className={'flex justify-center'}>
      <div className={'flex flex-col space-y-8 w-[450px]'}>
        <TextH2 className={'font-bold text-primary-light'}>edit collection</TextH2>

        <div className={'flex flex-col space-y-2'}>
          <TextBodyemphasis className={'text-primary-light'}>collection name</TextBodyemphasis>
          <input className={'h-[36px] bg-[#202020] border border-[0.5px] border-secondary rounded-[4px] w-full'} />
        </div>

        <div className={'flex space-x-8'}>
          <div className={'flex flex-1 flex-col space-y-2'}>
            <TextBodyemphasis className={'text-primary-light'}>logo image</TextBodyemphasis>
            <TextBodyemphasis className={'text-secondary'}>320 x 320 recommended</TextBodyemphasis>
            <Image src={'/images/default_collection.png'} alt={'user'} width={200} height={200} />
          </div>
          <div className={'flex flex-1 flex-col space-y-2'}>
            <TextBodyemphasis className={'text-primary-light'}>logo image</TextBodyemphasis>
            <TextBodyemphasis className={'text-secondary'}>320 x 320 recommended</TextBodyemphasis>
            <Image src={'/images/default_collection.png'} alt={'user'} width={200} height={200} />
          </div>
        </div>

        <div className={'flex flex-col space-y-2'}>
          <TextBodyemphasis className={'text-primary-light'}>collection description</TextBodyemphasis>
          <TextBodyemphasis className={'text-secondary'}>1000 characters max</TextBodyemphasis>
          <textarea className={'h-[150px] bg-[#202020] border border-[0.5px] border-secondary rounded-[4px] w-full'} />
        </div>

        <div className={'flex flex-col space-y-2'}>
          <TextBodyemphasis className={'text-primary-light'}>descriptive tags</TextBodyemphasis>

          <div className={'flex flex-wrap gap-2'}>
            <Tag label={'art'} active={false} />
            <Tag label={'gaming'} active={true} />
            <Tag label={'sports'} active={false} />
            <Tag label={'music'} active={false} />
            <Tag label={'video'} active={false} />
            <Tag label={'metaverse'} active={false} />
            <Tag label={'utilities'} active={false} />
            <Tag label={'domain names'} active={false} />
          </div>

          <div className={'flex flex-wrap gap-2 mt-4'}>
            <Tag label={'art'} active={false} />
            <Tag label={'gaming'} active={true} />
            <Tag label={'sports'} active={false} />
            <Tag label={'music'} active={false} />
            <Tag label={'video'} active={false} />
            <Tag label={'metaverse'} active={false} />
            <Tag label={'utilities'} active={false} />
            <Tag label={'domain names'} active={false} />
          </div>
        </div>

        <div className={'flex flex-col space-y-2'}>
          <div className={'flex items-center justify-between space-x-2'}>
            <Image src={'/images/icons/twitter.svg'} width={24} height={24} alt={'social icon'} />
            <PrimaryButton text={'Connect'} />
          </div>
          <div className={'flex items-center justify-between space-x-2'}>
            <Image src={'/images/icons/instagram.svg'} width={24} height={24} alt={'social icon'} />
            <PrimaryButton text={'Connect'} />
          </div>
          <div className={'flex items-center justify-between space-x-2'}>
            <Image src={'/images/icons/discord.svg'} width={24} height={24} alt={'social icon'} />
            <PrimaryButton text={'Connect'} />
          </div>
          <div className={'flex items-center justify-between space-x-2'}>
            <Image src={'/images/icons/website.svg'} width={24} height={24} alt={'social icon'} />
            <input className={'h-[36px] bg-[#202020] border border-[0.5px] border-secondary rounded-[4px] w-full'} />
          </div>
        </div>

        <div className={'flex flex-col space-y-2'}>
          <TextBodyemphasis className={'text-primary-light'}>creator fess</TextBodyemphasis>
          <TextBodyemphasis className={'text-secondary'}>you will need to confirm the transaction several times so that royalties from all supported chains are distributed to the address input below</TextBodyemphasis>
          <div className={'flex items-center justify-between space-x-4'}>
            <input className={'h-[36px] bg-[#202020] py-2 px-3 border border-[0.5px] border-secondary rounded-[4px] w-full'} placeholder={'0x'} />
            <input className={'h-[36px] bg-[#202020] py-2 px-3 border border-[0.5px] border-secondary rounded-[4px] w-[70px]'} placeholder={'0.00%'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionEdit
