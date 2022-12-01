import {CHAIN_COLORS, CHAIN_NAMES} from '../../utils/constants'

export type AnalyticsData = {
    chainId: number,
    value: number,
}

interface IAnalyticsCardProps {
    header: string,
    amount: string,
    chainData: AnalyticsData[]
}

export const AnalyticsCard = ({ header, amount, chainData }: IAnalyticsCardProps) => {
  return (
    <div className={'flex flex-col p-6 rounded-lg bg-[#202020]'}>
      <div className={'text-primary-light font-medium text-md'}>
        {header}
      </div>
      <div className={'text-primary-light font-medium text-xxxl'}>
        {amount}
      </div>
      {
        chainData.map((data: AnalyticsData, index) => {
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
  )
}