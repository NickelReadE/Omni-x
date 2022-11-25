import React from 'react'
import { BuyStep } from '../../types/enum'
import ListingFeeSection from './ListingFeeSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import BuySection from './BuySection'
import ConfirmSection from './ConfirmSection'
import CompleteSection from './CompleteSection'

interface IBuyContentProps {
  buyStep: BuyStep,
  processing: boolean,
  approveTx?: string,
  tradingTx?: string,
  price: number,
  srcCurrency?: string,
  currency?: string,
  nftImage: string,
  nftTitle: string,
  onBuy?: () => void
}

const BuyContent: React.FC<IBuyContentProps> = ({
  buyStep,
  processing,
  approveTx,
  tradingTx,
  price,
  srcCurrency,
  currency,
  nftImage,
  nftTitle,
  onBuy
}) => {
  return (
    <>
      <div className='flex justify-between'>
        {buyStep === BuyStep.StepBuy ? (
          <div>
            <BuySection
              price={price}
              srcCurrency={srcCurrency}
              currency={currency}
            />

            <ListingFeeSection/>
          </div>
        ) : (
          <div>
            <ApproveSection 
              processing={processing}
              active={buyStep == BuyStep.StepApprove}
              completed={buyStep > BuyStep.StepApprove}
              txHash={approveTx}
              sectionNo={1}
              title="Approve Token"
              descriptions={[
                'Please confirm the transaction in your wallet to process the trade.'
              ]}
            />
            <ConfirmSection 
              processing={processing}
              active={buyStep == BuyStep.StepConfirm}
              completed={buyStep > BuyStep.StepConfirm}
              txHash={tradingTx}
              sectionNo={2}
              title={'Complete Purchase'}
              description={'Please confirm this second transaction in your wallet to complete the purchase.'}
            />
            <CompleteSection 
              processing={processing}
              active={buyStep == BuyStep.StepComplete}
              completed={buyStep > BuyStep.StepComplete}
              txHash={tradingTx}
              sectionNo={3}
              title="Finalize"
              description="Please wait for a while to finalize the purchase."
            />

            {buyStep === BuyStep.StepDone && (
              <CongratsSection failed={false} succeedMessage={'you successfully bought this NFT'}/>
            )}
            {buyStep === BuyStep.StepFail && (
              <CongratsSection failed={true} failedMessage={'you failed to purchase this NFT'}/>
            )}
          </div>
        )}
        
        <div>
          <img alt={'nftImage'} className='rounded-[8px] max-w-[250px]' src={nftImage} />
          <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-20 flex items-end">
        <div className="col-span-1">
          {(buyStep === BuyStep.StepDone || buyStep === BuyStep.StepFail) ? (
            <button
              className='bg-[#B444F9] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onBuy}
              disabled={processing}>
              close
            </button>
          ) : (
            <button
              className='bg-[#38B000] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onBuy}
              disabled={processing || !currency || !price}>
              buy
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default BuyContent
