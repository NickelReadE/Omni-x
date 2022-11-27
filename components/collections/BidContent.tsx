import React from 'react'
import { BidStep } from '../../types/enum'
import ListingSection from './ListingSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import CompleteSection from './CompleteSection'
import useWallet from '../../hooks/useWallet'

interface IBidContentProps {
  bidStep: BidStep,
  processing: boolean,
  approveTx?: string,
  price: number,
  isCollectionBid: boolean,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
  onChangePeriod: (e: any) => void,
  nftImage: string,
  nftTitle: string,
  nftTokenId: string,
  collectionName: string,
  onBid?: () => void
}

const BidContent: React.FC<IBidContentProps> = ({
  bidStep,
  processing,
  approveTx,
  price,
  isCollectionBid,
  onChangePrice,
  currency,
  onChangeCurrency,
  period,
  onChangePeriod,
  nftImage,
  nftTokenId,
  collectionName,
  onBid
}) => {
  const { chainId } = useWallet()
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
          {bidStep === BidStep.StepBid ? (
            <ListingSection
              nftChainId={chainId || 0}
              priceLabel={'Price'}
              price={price}
              onChangePrice={onChangePrice}
              currency={currency}
              onChangeCurrency={onChangeCurrency}
              period={period}
              showDescription={false}
              onChangePeriod={onChangePeriod}
            />
          ) : (
            <div>
              <ApproveSection
                processing={processing}
                active={bidStep == BidStep.StepApprove}
                completed={bidStep > BidStep.StepApprove}
                txHash={approveTx}
                sectionNo={1}
                title="Approve Token"
                descriptions={[
                  'Please confirm the transaction in your wallet.',
                  'This confirmation allows you to sell or buy both this NFT and any future NFT from this collection.'
                ]}
              />
              <CompleteSection
                processing={processing}
                active={bidStep == BidStep.StepConfirm}
                completed={bidStep > BidStep.StepConfirm}
                sectionNo={2}
                title="Complete Bid"
                description="Please confirm this signature in your wallet to sign off on your bid."
              />

              {bidStep === BidStep.StepDone && (
                <CongratsSection failed={false} succeedMessage={isCollectionBid ? 'you successfully bid on this collection' : 'you successfully bid on this NFT'}/>
              )}
              {bidStep === BidStep.StepFail && (
                <CongratsSection failed={true} failedMessage={'you failed to place a bid'}/>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        {(bidStep === BidStep.StepDone || bidStep === BidStep.StepFail) ? (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onBid}
            disabled={processing}>
            close
          </button>
        ) : (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onBid}
            disabled={processing}>
            bid
          </button>
        )}
      </div>
    </>
  )
}

export default BidContent
