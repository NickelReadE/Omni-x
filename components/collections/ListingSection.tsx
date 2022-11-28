/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import CustomSelect from './CustomSelect'
import Select from 'react-select'
import { getValidCurrencies, PERIOD_LIST } from '../../utils/constants'
import { SaleType } from '../../types/enum'

interface IListingSectionProps {
  sellType?: SaleType,
  priceLabel: string,
  nftChainId: number,
  price: number,
  floorNft?: any,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
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
  onChangePeriod,
  floorNft
}) => {
  const validCurrencies = getValidCurrencies(nftChainId)

  const floorMessage = floorNft ? `if you want to buy an nft with floor price, please click buy floor.` : undefined

  return (
    <div>
      <p className="text-[#6C757D] text-[18px] font-semibold">{priceLabel}</p>
      <div className="flex justify-start items-center mt-5">
        <CustomSelect optionData={validCurrencies} value={currency} onChange={onChangeCurrency} />
        <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" onChange={onChangePrice}/>
      </div>
      <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px] mt-10">*sale funds are recieved on the blockchain the NFT is currently hosted on</p>
      {!!floorMessage && (
        <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px]">{floorMessage}</p>
      )}
      <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Duration</p>
      <div className="flex justify-start items-center mt-5">
        <Select
          placeholder="Select"
          styles={{
            control: (styles:any) => ({ ...styles,
              borderRadius: '8px',
              backgroundColor: '#F6F8FC',
              border: '2px solid #E9ECEF',
              width: '170px'
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
