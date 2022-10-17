import React from 'react'
import { ListingStep, SaleType } from '../../types/enum'
import ListingSection from './ListingSection'
import ListingFeeSection from './ListingFeeSection'
import ApproveSection from './ApproveSection'
import ConfirmListingSection from './ConfirmListingSection'
import CongratsSection from './CongratsSection'

interface IListingContentProps {
  sellType: SaleType,
  listingStep: ListingStep,
  processing: boolean,
  approveTx?: string,
  price: number,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
  onChangePeriod: (e: any) => void,
  nftImage: string,
  nftTitle: string,
  onListing?: () => void
}

const ListingContent: React.FC<IListingContentProps> = ({
  sellType,
  listingStep,
  processing,
  approveTx,
  price,
  onChangePrice,
  currency,
  onChangeCurrency,
  period,
  onChangePeriod,
  nftImage,
  nftTitle,
  onListing
}) => {
  return (
    <>
      <div className='flex justify-between'>
        {listingStep === ListingStep.StepListing ? (
          <ListingSection
            sellType={sellType}
            price={price}
            onChangePrice={onChangePrice}
            currency={currency}
            onChangeCurrency={onChangeCurrency}
            period={period}
            onChangePeriod={onChangePeriod}
          />
        ) : (
          <div>
            <ApproveSection 
              processing={processing}
              active={listingStep == ListingStep.StepApprove}
              completed={listingStep > ListingStep.StepApprove}
              txHash={approveTx}
            />
            <ConfirmListingSection 
              processing={processing}
              active={listingStep == ListingStep.StepConfirm}
              completed={listingStep > ListingStep.StepConfirm}
            />

            {listingStep === ListingStep.StepDone && (
              <CongratsSection failed={false}/>
            )}
            {listingStep === ListingStep.StepFail && (
              <CongratsSection failed={true}/>
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
          <button
            className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]'
            onClick={onListing}
            disabled={processing}>
            {listingStep === ListingStep.StepDone || listingStep === ListingStep.StepFail ? 'close' : 'list'}
          </button>
        </div>

        {listingStep === ListingStep.StepListing && (
          <ListingFeeSection/>
        )}
      </div>
    </>
  )
}

export default ListingContent
