export default function LearnMorePartners () {
  return (
    <div className="flex justify-center py-[150px]">
      <div className={'flex flex-col'}>
        <div className="flex justify-center w-full space-x-2">
          <span className={'text-xl2 text-primary-light'}>a special thanks to those that got us here</span>
        </div>
        <div className="flex flex-col w-full mt-12 px-10">
          <div className={'flex justify-between w-full h-[70px]'}>
            <img src={'/images/learn-more/partners/sneaky.png'} alt={'sneaky'} />
            <img src={'/images/learn-more/partners/kanpai_pandas.png'} alt={'kanpai pandas'} />
            <img src={'/images/learn-more/partners/pif.png'} alt={'pif'} />
          </div>
          <div className={'flex justify-between w-full mt-8 h-[70px]'}>
            <img src={'/images/learn-more/partners/pontem.png'} alt={'sneaky'} />
            <img src={'/images/learn-more/partners/galxe.png'} alt={'kanpai pandas'} />
          </div>
          <div className={'flex justify-between w-full mt-8 h-[70px]'}>
            <img src={'/images/learn-more/partners/layerzero.png'} alt={'sneaky'} />
            <img src={'/images/learn-more/partners/polygonstudios.png'} alt={'kanpai pandas'} />
          </div>
        </div>
      </div>
    </div>
  )
}