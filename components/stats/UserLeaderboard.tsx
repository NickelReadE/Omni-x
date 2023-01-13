import {TextBodyemphasis, TextH2, TextH3} from '../basic'
import {ChainSelection} from '../common/ChainSelection'
import {useState} from 'react'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'

export const StatsUserLeaderboard = () => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS)

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId])
  }

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS)
  }

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId))
  }

  return (
    <div className={'mt-8 md:px-6 xl:px-[150px]'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center space-x-8'}>
          <TextH2 className={'text-primary-light'}>User Leaderboard</TextH2>
          <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId}
            removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds}
            setChainId={(chainId) => setSelectedChainIds([chainId])}/>
        </div>

        <div className={'bg-[#202020] rounded-[8px] h-[38px] flex items-center'}>
          <div className={'flex bg-[#303030] rounded-tl-[8px] rounded-bl-[8px] items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'bg-clip-text text-transparent bg-primary-gradient'}>24hr</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>7d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>30d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>90d</TextBodyemphasis>
          </div>
          <div className={'flex items-center justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>1yr</TextBodyemphasis>
          </div>
          <div className={'flex items-center rounded-tr-[8px] rounded-br-[8px] justify-center py-2 px-4'}>
            <TextBodyemphasis className={'text-secondary'}>all</TextBodyemphasis>
          </div>
        </div>
      </div>

      <div className={'grid grid-cols-6 gap-4 w-full mt-8'}>
        <div className={'col-span-2 flex items-center space-x-2'}>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-secondary'}>volume</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-secondary'}>rank change</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>points</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>total points</TextBodyemphasis>
        </div>
      </div>

      <div className={'grid grid-cols-6 gap-4 w-full mt-8'}>
        <div className={'col-span-2 flex items-center space-x-2'}>
          <span className={'text-secondary text-[15px] leading-[18px] mr-2'}>1</span>
          <img src={'/images/default_user.png'} alt={'user'} />
          <TextH3 className={'text-primary-light'}>0xd34f5er5b...</TextH3>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-secondary'}>$24.83mm</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center justify-center'}>
          <TextBodyemphasis className={'text-secondary'}>-</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>101,545</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>900,992</TextBodyemphasis>
        </div>
      </div>
      <div className={'grid grid-cols-6 gap-4 w-full mt-8'}>
        <div className={'col-span-2 flex items-center space-x-2'}>
          <span className={'text-secondary text-[15px] leading-[18px] mr-2'}>1</span>
          <img src={'/images/default_user.png'} alt={'user'} />
          <TextH3 className={'text-primary-light'}>0xd34f5er5b...</TextH3>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-secondary'}>$24.83mm</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center justify-center'}>
          <TextBodyemphasis className={'text-primary-light'}>-</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>101,545</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>900,992</TextBodyemphasis>
        </div>
      </div>
      <div className={'grid grid-cols-6 gap-4 w-full mt-8'}>
        <div className={'col-span-2 flex items-center space-x-2'}>
          <span className={'text-secondary text-[15px] leading-[18px] mr-2'}>1</span>
          <img src={'/images/default_user.png'} alt={'user'} />
          <TextH3 className={'text-primary-light'}>0xd34f5er5b...</TextH3>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-secondary'}>$24.83mm</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center justify-center'}>
          <TextBodyemphasis className={'text-primary-light'}>-</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>101,545</TextBodyemphasis>
        </div>
        <div className={'col-span-1 flex items-center'}>
          <TextBodyemphasis className={'text-primary-light'}>900,992</TextBodyemphasis>
        </div>
      </div>

      {/* Pagination */}
      <div className={'flex justify-center mt-10'}>
        <div className={'px-4 h-[38px] bg-[#202020] rounded-[20px]'}>

        </div>
      </div>
    </div>
  )
}
