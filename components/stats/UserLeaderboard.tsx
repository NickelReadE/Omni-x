import {useMemo, useState} from 'react'
import {TextBodyemphasis, TextH2, TextH3} from '../basic'
import {ChainSelection} from '../common/ChainSelection'
import {LeaderboardData} from '../../types/stats'
import {SUPPORTED_CHAIN_IDS} from '../../utils/constants'
import {truncateAddress} from '../../utils/utils'
import {formatDollarAmount} from '../../utils/numbers'
import Pagination from '../Pagination'

export const StatsUserLeaderboard = ({ leaderboard }: { leaderboard: LeaderboardData[] }) => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS)
  const [dayRange, setDayRange] = useState(1)
  const [page, setPage] = useState(1)

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId])
  }

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS)
  }

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId))
  }

  const mappedLeaderboard = useMemo(() => {
    const dayRangeMap: any = {
      0: 'rank_in_all',
      1: 'rank_in_24h',
      7: 'rank_in_7d',
      30: 'rank_in_30d',
      90: 'rank_in_90d',
      365: 'rank_in_1yr',
    }
    return leaderboard.map((item: any) => ({
      ...item,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rank: item[dayRangeMap[dayRange]],
    }))
  }, [leaderboard, dayRange])

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
          <div className={`${dayRange === 1 ? 'bg-[#303030]' : ''} flex rounded-tl-[8px] rounded-bl-[8px] items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(1)}>
            <TextBodyemphasis className={`${dayRange === 1 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>24hr</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 7 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(7)}>
            <TextBodyemphasis className={`${dayRange === 7 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>7d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 30 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(30)}>
            <TextBodyemphasis className={`${dayRange === 30 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>30d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 90 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(90)}>
            <TextBodyemphasis className={`${dayRange === 90 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>90d</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 365 ? 'bg-[#303030]' : ''} flex items-center justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(365)}>
            <TextBodyemphasis className={`${dayRange === 365 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>1yr</TextBodyemphasis>
          </div>
          <div className={`${dayRange === 0 ? 'bg-[#303030]' : ''} flex items-center rounded-tr-[8px] rounded-br-[8px] justify-center py-2 px-4 cursor-pointer`} onClick={() => setDayRange(0)}>
            <TextBodyemphasis className={`${dayRange === 0 ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'}`}>all</TextBodyemphasis>
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

      {
        mappedLeaderboard.map((user, index) => {
          return (
            <div key={index} className={'grid grid-cols-6 gap-4 w-full mt-8'}>
              <div className={'col-span-2 flex items-center space-x-2'}>
                <span className={'text-secondary text-[15px] leading-[18px] mr-2'}>{index + 1}</span>
                <img src={'/images/default_user.png'} alt={'user'} />
                <TextH3 className={'text-primary-light'}>{truncateAddress(user.address)}</TextH3>
              </div>
              <div className={'col-span-1 flex items-center'}>
                <TextBodyemphasis className={'text-secondary'}>{formatDollarAmount(user.volume)}</TextBodyemphasis>
              </div>
              <div className={'col-span-1 flex items-center justify-center'}>
                <TextBodyemphasis className={'text-secondary'}>{user.rank === 0 ? '-' : user.rank}</TextBodyemphasis>
              </div>
              <div className={'col-span-1 flex items-center'}>
                <TextBodyemphasis className={'text-primary-light'}>{user.points}</TextBodyemphasis>
              </div>
              <div className={'col-span-1 flex items-center'}>
                <TextBodyemphasis className={'text-primary-light'}>{user.total_points}</TextBodyemphasis>
              </div>
            </div>
          )
        })
      }

      {/* Pagination */}
      <div className={'flex justify-center mt-10'}>
        <Pagination
          totalItems={100}
          itemsPerPage={10}
          currentPage={page}
          setCurrentPage={(page) => setPage(page)}
        />
      </div>
    </div>
  )
}
