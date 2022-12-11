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

  // const aboutPrice = useMemo(() => {
  //   return price
  // }, [price])

  return (
    <div>
      <p className="text-primary-light text-xg font-semibold">Price</p>
      <div className="flex justify-start items-center mt-5">
        <CustomSelect optionData={validCurrencies} value={selectedCurrency} />
        <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F6F8FC] border-[2px] border-[#E9ECEF] rounded-lg" disabled={true}/>
        {/*<img src={`/images/${selectedCurrency.icon}`} alt={'currency'} width={20} height={20} />
        <span className={'text-primary-light text-lg mx-2'}>{price}</span>
        <span className={'text-secondary text-lg ml-2'}>
          ~{aboutPrice}
        </span>*/}
      </div>
      {
        currency ?
          <p className="text-primary-light text-md w-[435px] mt-6">
            service fee: 1.50%<br />
            creator fee: 5.00%
          </p>
          :
          <p className="text-warning text-[14px] font-light italic leading-6 w-[435px] mt-10">the chosen currency is not supported on the current chain</p>
      }
    </div>
  )
}

export default BuySection
