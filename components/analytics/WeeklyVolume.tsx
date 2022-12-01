import {CHAIN_COLORS, CHAIN_NAMES} from '../../utils/constants'
import {AnalyticsData} from './DataCard'

const mockData = [
  { chainId: 5, value: 10000 },
  { chainId: 97, value: 9000 },
  { chainId: 80001, value: 6000 },
  { chainId: 43113, value: 4000 },
  { chainId: 420, value: 3000 },
  { chainId: 421613, value: 2000 },
  { chainId: 4002, value: 1000 },
]
export const AnalyticsWeeklyVolume = () => {
  return (
    <div className={'bg-[#202020] p-6 mt-[30px] rounded-lg'}>
      <div className={'flex items-center justify-between'}>
        <div className={'text-primary-light font-medium text-md'}>
            Weekly Volume
        </div>
        <div className={'text-primary-light font-medium text-md'}>
            Sep 12-19
        </div>
      </div>
      <div className={'flex justify-between mt-2'}>
        <div>Chart data</div>
        <div className={'ml-6'}>
          {
            mockData.map((data: AnalyticsData, index) => {
              return (
                <div key={index} className={'flex items-center justify-between'}>
                  <div className={'flex items-center'}>
                    <div className={`w-2 h-2 ${CHAIN_COLORS[data.chainId]} `} />
                    <div className={'ml-2 text-md font-medium text-secondary'}>
                      {CHAIN_NAMES[data.chainId]}
                    </div>
                  </div>
                  <div className={'text-md font-medium text-primary-light'}>
                    {data.value}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}