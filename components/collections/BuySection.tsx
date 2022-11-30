import React from 'react'
import CustomSelect from './CustomSelect'
import { getAllCurrencies } from '../../utils/constants'

interface IBuySectionProps {
  price: number,
  srcCurrency?: string,
  currency?: string,
}

const BuySection: React.FC<IBuySectionProps> = ({
  price,
  srcCurrency,
  currency
}) => {
  const validCurrencies = getAllCurrencies()
  const oldCurrency = validCurrencies?.find(v => v.text == srcCurrency) || {}
  const selectedCurrency = validCurrencies?.find(v => v.text == currency) || oldCurrency
  
  return (
    <div>
      <p className="text-[#6C757D] text-[18px] font-semibold">Sale Price</p>
      <div className="flex justify-start items-center mt-5">
        <CustomSelect optionData={validCurrencies} value={selectedCurrency} />
        <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" disabled={true}/>
      </div>
      {currency ? (
        <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px] mt-10">*sale funds are recieved on the blockchain the NFT is currently hosted on</p>
      ) : (
        <p className="text-warning text-[14px] font-light italic leading-6 w-[435px] mt-10">the chosen currency is not supported on the current chain</p>
      )}
    </div>
  )
}

export default BuySection
