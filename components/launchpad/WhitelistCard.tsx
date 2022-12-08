import React from 'react'
import {chainInfos} from '../../utils/constants'
import {ChainIds} from '../../types/enum'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import useWallet from '../../hooks/useWallet'
import {GreyButton} from '../common/buttons/GreyButton'

interface IWhitelistCardProps {
    title: string,
    price: number,
    mintNum: number,
    mintStatus: string,
    mint?: () => void
}

export const WhitelistCard = ({ title, price, mintNum, mintStatus, mint }: IWhitelistCardProps) => {
  const { chainId } = useWallet()

  return (
    <div className={'flex flex-col mt-4'}>
      <div className={`rounded-[8px] p-[1px] ${mintStatus === 'live' ? 'bg-primary-gradient' : 'bg-secondary'} min-w-[350px] w-full`}>
        <div className={'flex flex-col py-2 px-3 rounded-[8px] bg-primary'}>
          <div className={'flex justify-between'}>
            <div className={'text-secondary text-xl text-shadow-sm2'}>{title}</div>
            <div className={`text-xl text-shadow-sm2 ${mintStatus === 'live' ? 'bg-clip-text text-transparent bg-primary-gradient' : (mintStatus === 'public' ? 'text-dark-red' : 'text-secondary')} font-medium`}>
              {mintStatus === 'public' ? '13hr 25m' : mintStatus}
            </div>
          </div>
          <div className={'flex justify-between mt-2'}>
            <div className={'flex items-center'}>
              <span className={`${mintStatus === 'live' ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'} font-bold text-xxxl text-shadow-sm2 mr-4`}>
                {(price * mintNum).toFixed(2)}
              </span>
              {
                chainId &&
                <img
                  alt={'networkIcon'}
                  src={chainInfos[chainId].logo || chainInfos[ChainIds.ETHEREUM].logo}
                  className="'w-8 h-8"
                />
              }
            </div>
            {
              mintStatus === 'live' 
                ?
                <PrimaryButton text={'mint'} className={'px-6'} onClick={mint}/>
                :
                <GreyButton text={'mint'} className={'px-6 h-[32px]'} />
            }
          </div>
          <div
            className={'mt-2 text-primary-light font-medium text-[14px] leading-[18px] text-shadow-sm2'}>
            {
              mintStatus === 'public' ? '5 per wallet' : '2,000 max - 1 per wallet'
            }
          </div>
        </div>
      </div>
    </div>
  )
}