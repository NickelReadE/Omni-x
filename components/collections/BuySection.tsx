import React, {useMemo} from 'react'
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

  const aboutPrice = useMemo(() => {
    return price
  }, [price])

  return (
    <div>
      <p className="text-primary-light text-xg font-semibold">Price</p>
      <div className="flex justify-start items-center mt-5">
        <img src={`/images/${selectedCurrency.icon}`} alt={'currency'} width={20} height={20} />
        <span className={'text-primary-light text-lg mx-2'}>{price}</span>
        <span className={'text-secondary text-lg ml-2'}>
          ~{aboutPrice}
        </span>
      </div>
      <p className="text-primary-light text-md w-[435px] mt-6">service fee: 1.50%<br />
            creator fee: 5.00%</p>
    </div>
  )
}

export default BuySection
