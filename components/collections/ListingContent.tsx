import React from 'react'
import { ListingStep, SaleType } from '../../types/enum'
import ListingSection from './ListingSection'
import ListingFeeSection from './ListingFeeSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import CompleteSection from './CompleteSection'

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
        {(listingStep === ListingStep.StepListing || listingStep === ListingStep.StepCheckNetwork) ? (
          <ListingSection
            sellType={sellType}
            priceLabel={'Sale Price'}
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
              sectionNo={1}
              title="Approve Collection"
              descriptions={[
                'Please confirm the transaction in your wallet.',
                'This confirmation allows you to sell or buy both this NFT and any future NFT from this collection.'
              ]}
            />
            <CompleteSection 
              processing={processing}
              active={listingStep == ListingStep.StepConfirm}
              completed={listingStep > ListingStep.StepConfirm}
              sectionNo={2}
              title="Complete Listing"
              description="Please confirm this second transaction in your wallet to complete the listing."
            />

            {listingStep === ListingStep.StepDone && (
              <CongratsSection failed={false} succeedMessage={'your NFT was successfully listed'}/>
            )}
            {listingStep === ListingStep.StepFail && (
              <CongratsSection failed={true} failedMessage={'you were failed to list this NFT'}/>
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
          {(listingStep === ListingStep.StepDone || listingStep === ListingStep.StepFail) ? (
            <button
              className='bg-[#B444F9] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onListing}
              disabled={processing}>
              close
            </button>
          ) : (
            <button
              className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onListing}
              disabled={processing}>
              list
            </button>
          )}
        </div>

        {(listingStep === ListingStep.StepListing || listingStep === ListingStep.StepCheckNetwork) && (
          <ListingFeeSection/>
        )}
      </div>
    </>
  )
}

export default ListingContent
