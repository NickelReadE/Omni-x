import React, {useMemo, useState} from 'react'
import {chainInfos, isSupportGelato} from '../../utils/constants'
import {ChainIds} from '../../types/enum'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import useWallet from '../../hooks/useWallet'
import {GreyButton} from '../common/buttons/GreyButton'

interface IWhitelistCardProps {
    title: string,
    price: number,
    maxLimit: number,
    limitPerWallet: number,
    startTimestamp: number,
    endTimestamp: number,
    isMinting: boolean,
    gasless: boolean,
    mint: (quantity: number) => void
}

export const WhitelistCard = ({ title, price, maxLimit, limitPerWallet, startTimestamp, endTimestamp, isMinting, gasless, mint }: IWhitelistCardProps) => {
  const { chainId } = useWallet()
  const [quantity, setQuantity] = useState(1)

  const active = useMemo(() => {
    const now = new Date().getTime() / 1000
    return now >= startTimestamp && now <= endTimestamp
  }, [startTimestamp, endTimestamp])

  const comingSoon = useMemo(() => {
    const now = new Date().getTime() / 1000
    return now < startTimestamp
  }, [startTimestamp])

  return (
    <div className={'flex flex-col mt-4'}>
      <div className={`rounded-[8px] p-[1px] ${active ? 'bg-primary-gradient' : 'bg-secondary'} min-w-[350px] w-full`}>
        <div className={'flex flex-col py-2 px-3 rounded-[8px] bg-primary'}>
          <div className={'flex justify-between'}>
            <div className={'text-secondary text-xl text-shadow-sm2'}>{title}</div>
            <div className={`text-xl text-shadow-sm2 ${active ? (comingSoon ? 'text-dark-red' : 'bg-clip-text text-transparent bg-primary-gradient') : 'text-secondary'} font-medium`}>
              {active ? 'live' : 'ENDED'}
            </div>
          </div>
          <div className={'flex justify-between items-center mt-2'}>
            <div className={'flex flex-col'}>
              <div className={'flex items-center'}>
                <span className={`${active ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'} font-bold text-xxxl text-shadow-sm2 mr-4`}>
                  {(price * quantity).toFixed(2)}
                </span>
                {
                  !gasless && chainId &&
                <img
                  alt={'networkIcon'}
                  src={chainInfos[chainId].logo || chainInfos[ChainIds.ETHEREUM].logo}
                  className="'w-8 h-8"
                />
                }
                {
                  gasless &&
                    <img src={'/images/currency/usdc.svg'} alt={'currency'} className={'w-7 h-7'} />
                }
              </div>
              {
                limitPerWallet > 1 &&
                <div className={'flex items-center w-full justify-between'}>
                  <span className={'bg-chain-80001 rounded-full w-6 h-6 flex items-center justify-center text-primary-light text-xxl cursor-pointer'} onClick={() => {
                    if (quantity > 1) setQuantity(quantity - 1)}
                  }>-</span>
                  <span className={'text-primary-light text-xg1'}>{quantity}</span>
                  <span className={'bg-chain-80001 rounded-full w-6 h-6 flex items-center justify-center text-primary-light text-xxl cursor-pointer'} onClick={() => {
                    if (quantity < limitPerWallet) setQuantity(quantity + 1)}
                  }>+</span>
                </div>
              }
            </div>
            {
              active
                ?
                <PrimaryButton text={(gasless && chainId && isSupportGelato(chainId)) ? 'gasless mint' : 'mint'} className={'px-6'} loading={isMinting} parentClassName={'h-[32px]'} onClick={() => mint(quantity)}/>
                :
                <GreyButton text={'mint'} className={'px-6 h-[32px]'} disabled={true} />
            }
          </div>
          <div
            className={'mt-2 text-primary-light font-medium text-[14px] leading-[18px] text-shadow-sm2'}>
            {
              `${maxLimit > 0 ? `${maxLimit.toLocaleString()} max - ` : ''}${limitPerWallet} per wallet`
            }
          </div>
        </div>
      </div>
    </div>
  )
}
