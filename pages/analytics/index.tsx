import {NextPage} from 'next'
import {AnalyticsCard} from '../../components/analytics/DataCard'
import {AnalyticsWeeklyVolume} from '../../components/analytics/WeeklyVolume'
import {AnalyticsTopCollections} from '../../components/analytics/TopCollections'

const mockData = [
  { chainId: 5, value: 10000 },
  { chainId: 97, value: 9000 },
  { chainId: 80001, value: 6000 },
  { chainId: 43113, value: 4000 },
  { chainId: 420, value: 3000 },
  { chainId: 421613, value: 2000 },
  { chainId: 4002, value: 1000 },
]

const Analytics: NextPage = () => {
    
  return (
    <div className={'pt-[52px]'}>
      <div className={'flex flex-col md:px-6 xl:px-[150px]'}>
        <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12'}>
          <AnalyticsCard header={'Total Volume'} amount={'8000'} chainData={mockData} />
          <AnalyticsCard header={'Total Tx'} amount={'3000'} chainData={mockData} />
          <AnalyticsCard header={'Total NFTs Bridged'} amount={'20000'} chainData={mockData} />
          <AnalyticsCard header={'Omni X Revenue'} amount={'120000'} chainData={mockData} />
        </div>

        <AnalyticsWeeklyVolume />
        <AnalyticsTopCollections />
      </div>
    </div>
  )
}

export default Analytics
