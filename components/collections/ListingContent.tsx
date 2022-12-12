import React from 'react'
import { ListingStep, SaleType } from '../../types/enum'
import ListingSection from './ListingSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import CompleteSection from './CompleteSection'

interface IListingContentProps {
  sellType: SaleType,
  listingStep: ListingStep,
  processing: boolean,
  approveTx?: string,
  nftChainId: number,
  price: number,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
  onChangePeriod: (e: any) => void,
  nftImage: string,
  nftTitle: string,
  nftTokenId: string,
  collectionName: string,
  onListing?: () => void
}

const ListingContent: React.FC<IListingContentProps> = ({
  sellType,
  listingStep,
  processing,
  approveTx,
  nftChainId,
  price,
  onChangePrice,
  currency,
  onChangeCurrency,
  period,
  onChangePeriod,
  nftImage,
  nftTokenId,
  collectionName,
  onListing
}) => {
  return (
    <>
      <div className='flex flex-col justify-between'>
        <div className={'flex justify-center'}>
          <div className={'flex flex-col'}>
            <div className={'bg-primary-gradient p-[1px] rounded'}>
              <img alt={'nftImage'} className='bg-primary rounded' width={190} height={190} src={nftImage} />
            </div>
            <p className={'text-primary-light mt-3'}>#{nftTokenId}</p>
            <p className='text-secondary font-medium'>{collectionName}</p>
          </div>
        </div>
        <div className={'mt-4'}>
          {(listingStep === ListingStep.StepListing || listingStep === ListingStep.StepCheckNetwork) ? (
            <ListingSection
              sellType={sellType}
              priceLabel={'Price'}
              nftChainId={nftChainId}
              price={price}
              onChangePrice={onChangePrice}
              currency={currency}
              onChangeCurrency={onChangeCurrency}
              period={period}
              onChangePeriod={onChangePeriod}
              showDescription={true}
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
                <CongratsSection failed={true} failedMessage={'you failed to list this NFT'}/>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        {(listingStep === ListingStep.StepDone || listingStep === ListingStep.StepFail) ? (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onListing}
            disabled={processing}>
            close
          </button>
        ) : (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onListing}
            disabled={processing}>
            list
          </button>
        )}
      </div>
    </>
  )
}

export default ListingContent
