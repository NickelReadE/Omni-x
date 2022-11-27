/* eslint-disable react-hooks/exhaustive-deps */

import React, {useMemo} from 'react'
import CustomSelect from './CustomSelect'
import Select from 'react-select'
import { getValidCurrencies, PERIOD_LIST } from '../../utils/constants'
import { SaleType } from '../../types/enum'

interface IListingSectionProps {
  sellType?: SaleType,
  priceLabel: string,
  nftChainId: number,
  price: number,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
  showDescription: boolean,
  onChangePeriod: (e: any) => void
}

const ListingSection: React.FC<IListingSectionProps> = ({
  nftChainId,
  priceLabel,
  price,
  onChangePrice,
  currency,
  onChangeCurrency,
  period,
  showDescription = true,
  onChangePeriod,
}) => {
  const validCurrencies = getValidCurrencies(nftChainId)

  const aboutPrice = useMemo(() => {
    return price
  }, [price])
    
  return (
    <div>
      <p className="text-primary-light text-xg font-semibold">{priceLabel}</p>
      <div className="flex justify-start items-center mt-5">
        <CustomSelect optionData={validCurrencies} value={currency} onChange={onChangeCurrency} />
        <div className={'relative ml-4 bg-primary-gradient p-[1px] rounded-lg h-[40px] w-[110px]'}>
          <div className={'absolute top-[8px] left-1.5 h-full'}>
            <img src={`/images/${currency.icon}`} alt={'currency'} width={25} height={25} />
          </div>
          <input type="text" value={price} className="text-primary-light font-medium w-full h-full text-left pl-8 bg-primary rounded-lg" onChange={onChangePrice}/>
        </div>
        <span className={'text-secondary text-lg ml-4'}>
          ~{aboutPrice}
        </span>
      </div>
      <p className="text-primary-light text-md w-[435px] mt-6">service fee: 1.50%<br />
          creator fee: 5.00%</p>
      {
        showDescription &&
            <p className="text-secondary text-md font-light italic leading-6 w-[435px] mt-6">*sale funds are received on the blockchain the NFT is listed on, NOT on the blockchain of the buyer</p>
      }
      <p className="text-primary-light text-xg font-semibold mt-6">Duration</p>
      <div className="flex justify-start items-center mt-5">
        <Select
          placeholder="Select"
          styles={{
            indicatorSeparator: (styles:any) => ({ ...styles,
              display: 'none'
            }),
            option: (styles:any) => ({ ...styles,
              background: '#969696',
              color: '#F5F5F5',
            }),
            menu: (styles:any) => ({ ...styles,
              background: '#969696',
              color: '#F5F5F5',
            }),
            control: (styles:any) => ({ ...styles,
              borderRadius: '20px',
              backgroundColor: 'transparent',
              border: '1px solid #969696',
              width: '180px'
            }),
            singleValue: (styles:any) => ({ ...styles,
              color: '#F5F5F5',
            })
          }}
          options={PERIOD_LIST as any}
          isSearchable={ false }
          getOptionLabel={(e:any) => e?.text}
          getOptionValue={(e:any) => e?.value}
          value={period}
          onChange={onChangePeriod}
        />
        {/* <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg"/>
        <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span> */}
      </div>
    </div>
  )
}

export default ListingSection
