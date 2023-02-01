import {useMemo, useState} from 'react'
import {TextBodyemphasis, TextH2, TextH3} from '../common/Basic'
import {LeaderboardData} from '../../types/stats'
import {truncateAddress} from '../../utils/utils'
import {formatDollarAmount} from '../../utils/numbers'
import Pagination from '../common/Pagination'
import Link from 'next/link'

const S3_BUCKET_URL = process.env.S3_BUCKET_URL || ''

export const StatsUserLeaderboard = ({ leaderboard }: { leaderboard: LeaderboardData[] }) => {
  const [dayRange, setDayRange] = useState(1)
  const [page, setPage] = useState(1)

  const mappedLeaderboard = useMemo(() => {
    const dayRangeMap: any = {
      0: 'rank_in_all',
      1: 'rank_in_24h',
      7: 'rank_in_7d',
      30: 'rank_in_30d',
      90: 'rank_in_90d',
      365: 'rank_in_1yr',
    }
    return leaderboard.map((item: any) => {
      let avatar = '/images/default_avatar.png'
      if (item.avatar && item.avatar.startsWith('https://')) {
        avatar = item.avatar
      } else if (item.avatar && item.avatar.startsWith('ipfs')) {
        avatar = `https://ipfs.io/${item.avatar}`
      } else if (item.avatar && item.avatar.startsWith('upload')) {
        avatar = S3_BUCKET_URL + item.avatar
      }
      return {
        ...item,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rank: item[dayRangeMap[dayRange]],
        avatar: avatar,
      }
    })
  }, [leaderboard, dayRange])

  return (
    <div className={'mt-8 md:px-6 xl:px-[150px]'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center space-x-8'}>
          <TextH2 className={'text-primary-light'}>User Leaderboard</TextH2>
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
              <Link href={`/user/${user.address}`}>
                <div className={'col-span-2 flex items-center space-x-2 cursor-pointer'}>
                  <span className={'text-secondary text-[15px] leading-[18px] mr-2'}>{index + 1}</span>
                  <img src={user.avatar || '/images/default_avatar.png'} alt={'user'} width={36} height={36} className={'rounded-full h-9 w-9'} />
                  <TextH3 className={'text-primary-light'}>{truncateAddress(user.address)}</TextH3>
                </div>
              </Link>
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
