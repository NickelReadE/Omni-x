import {NextPage} from 'next'
import {useEffect, useState} from 'react'
import {AnalyticsCard} from '../../components/stats/DataCard'
import {AnalyticsWeeklyVolume} from '../../components/stats/WeeklyVolume'
import {TextH3} from '../../components/basic'
import {StatsUserLeaderboard} from '../../components/stats/UserLeaderboard'
import {LeaderboardData} from '../../types/stats'
import {statsService} from '../../services/statsService'

const mockData = [
  { chainId: 5, value: 10000 },
  { chainId: 97, value: 9000 },
  { chainId: 80001, value: 6000 },
  { chainId: 43113, value: 4000 },
  { chainId: 420, value: 3000 },
  { chainId: 421613, value: 2000 },
  { chainId: 4002, value: 1000 },
]

const Stats: NextPage = () => {
  const [tab, setTab] = useState(0)
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([])

  useEffect(() => {
    (async () => {
      const _data = await statsService.getUserLeaderboard()
      setLeaderboard(_data.data)
    })()
  }, [])

  return (
    <div className={'pt-8'}>
      <div className={'flex justify-center space-x-6'}>
        <div className={`${tab === 0 ? 'bg-primary-gradient' : 'bg-[#202020]'} rounded-full py-2 px-4 cursor-pointer`} onClick={() => setTab(0)}>
          <TextH3 className={`${tab === 0 ? 'text-primary' : 'text-secondary'} font-medium`}>Omni X Protocol</TextH3>
        </div>
        <div className={`${tab === 1 ? 'bg-primary-gradient' : 'bg-[#202020]'} rounded-full py-2 px-4 cursor-pointer`} onClick={() => setTab(1)}>
          <TextH3 className={`${tab === 1 ? 'text-primary' : 'text-secondary'} font-medium`}>NFT Collections</TextH3>
        </div>
        <div className={`${tab === 2 ? 'bg-primary-gradient' : 'bg-[#202020]'} rounded-full py-2 px-4 cursor-pointer`} onClick={() => setTab(2)}>
          <TextH3 className={`${tab === 2 ? 'text-primary' : 'text-secondary'} font-medium`}>User Leaderboard</TextH3>
        </div>
      </div>

      {
        tab === 0 &&
          <div className={'flex flex-col md:px-6 xl:px-[150px] mt-7'}>
            <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12'}>
              <AnalyticsCard header={'Total Volume'} amount={'8000'} chainData={mockData} />
              <AnalyticsCard header={'Total Tx'} amount={'3000'} chainData={mockData} />
              <AnalyticsCard header={'Total NFTs Bridged'} amount={'20000'} chainData={mockData} />
              <AnalyticsCard header={'Omni X Revenue'} amount={'120000'} chainData={mockData} />
            </div>

            <AnalyticsWeeklyVolume />
          </div>
      }
      {
        tab === 2 &&
          <StatsUserLeaderboard leaderboard={leaderboard} />
      }
    </div>
  )
}

export default Stats
