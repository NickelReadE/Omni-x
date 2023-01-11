import React, {useMemo, useState} from 'react'
import {chainInfos, isSupportGelato} from '../../utils/constants'
import {ChainIds} from '../../types/enum'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import useWallet from '../../hooks/useWallet'
import {GreyButton} from '../common/buttons/GreyButton'
import {TextBodyemphasis, TextH2, TextSubtext} from '../basic'

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
            <TextBodyemphasis className={'text-secondary text-shadow-sm2'}>{title}</TextBodyemphasis>
            <div className={`text-xl text-shadow-sm2 ${active ? (comingSoon ? 'text-dark-red' : 'bg-clip-text text-transparent bg-primary-gradient') : 'text-secondary'} font-medium`}>
              {active ? 'live' : 'ended'}
            </div>
          </div>
          <div className={'flex justify-between items-center mt-2'}>
            <div className={'flex flex-col'}>
              <div className={'flex items-center'}>
                <TextH2 className={`${active ? 'bg-clip-text text-transparent bg-primary-gradient' : 'text-secondary'} text-shadow-sm2 mr-4`}>
                  {(price * quantity).toFixed(2)}
                </TextH2>
                {
                  !gasless && chainId &&
                    <img
                      alt={'networkIcon'}
                      src={chainInfos[chainId].roundedLogo || chainInfos[ChainIds.ETHEREUM].roundedLogo}
                      className="'w-8 h-8"
                    />
                }
                {
                  gasless &&
                    <img src={'/images/currency/usdc.svg'} alt={'currency'} className={'w-7 h-7'} />
                }
              </div>
            </div>
            {
              limitPerWallet > 1 &&
              <div className={'flex items-center justify-between bg-[#303030] rounded-[50px] space-x-2'}>
                <img src={'/images/icons/minus_circle.svg'} alt={'minus'} className={'w-8 h-8 cursor-pointer'} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
                <span className={'text-primary-light text-xg1 font-bold'}>{quantity}</span>
                <img src={'/images/icons/plus_circle.svg'} alt={'minus'} className={'w-8 h-8 cursor-pointer'} onClick={() => setQuantity(Math.min(limitPerWallet, quantity + 1))} />
              </div>
            }
            {
              active
                ?
                <PrimaryButton text={(gasless && chainId && isSupportGelato(chainId)) ? 'gasless mint' : 'mint'} className={'px-6'} loading={isMinting} parentClassName={'h-[32px]'} onClick={() => mint(quantity)}/>
                :
                <GreyButton text={'mint'} className={'px-6 h-[32px]'} disabled={true} />
            }
          </div>
          <TextSubtext className={'mt-2 text-primary-light text-shadow-sm2'}>
            {
              `${maxLimit > 0 ? `${maxLimit.toLocaleString()} max - ` : ''}${limitPerWallet} per wallet`
            }
          </TextSubtext>
        </div>
      </div>
    </div>
  )
}
