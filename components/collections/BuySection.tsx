import React from 'react'
import CustomSelect from './CustomSelect'
import useWallet from '../../hooks/useWallet'
import { getValidCurrencies } from '../../utils/constants'

interface IBuySectionProps {
  price: number,
  currency: string,
}

const BuySection: React.FC<IBuySectionProps> = ({
  price,
  currency
}) => {
  const { chainId } = useWallet()
  const validCurrencies = getValidCurrencies(chainId || 0)
  const selectedCurrency = validCurrencies.find(v => v.text == currency) || validCurrencies[0]
  
  return (
    <div>
      <p className="text-[#6C757D] text-[18px] font-semibold">Sale Price</p>
      <div className="flex justify-start items-center mt-5">
        <CustomSelect optionData={validCurrencies} value={selectedCurrency} />
        <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" disabled={true}/>
      </div>
      <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px] mt-10">*sale funds are recieved on the blockchain the NFT is currently hosted on</p>
    </div>
  )
}

export default BuySection
