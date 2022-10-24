import React from 'react'
import { AcceptStep } from '../../types/enum'
import ListingFeeSection from './ListingFeeSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import BuySection from './BuySection'
import ConfirmSection from './ConfirmSection'
import CompleteSection from './CompleteSection'

interface IAcceptContentProps {
  acceptStep: AcceptStep,
  processing: boolean,
  approveTx?: string,
  tradingTx?: string,
  price: number,
  currency: string,
  nftImage: string,
  nftTitle: string,
  onAccept?: () => void
}

const AcceptContent: React.FC<IAcceptContentProps> = ({
  acceptStep,
  processing,
  approveTx,
  tradingTx,
  price,
  currency,
  nftImage,
  nftTitle,
  onAccept
}) => {
  return (
    <>
      <div className='flex justify-between'>
        {acceptStep === AcceptStep.StepAccept ? (
          <div>
            <BuySection
              price={price}
              currency={currency}
            />

            <ListingFeeSection/>
          </div>
        ) : (
          <div>
            <ApproveSection 
              processing={processing}
              active={acceptStep == AcceptStep.StepApprove}
              completed={acceptStep > AcceptStep.StepApprove}
              txHash={approveTx}
              sectionNo={1}
              title="Approve Collection"
              descriptions={[
                'Please confirm the transaction in your wallet.',
                'This confirmation allows you to sell or buy both this NFT and any future NFT from this collection.'
              ]}
            />
            <ConfirmSection 
              processing={processing}
              active={acceptStep == AcceptStep.StepConfirm}
              completed={acceptStep > AcceptStep.StepConfirm}
              txHash={tradingTx}
              sectionNo={2}
              title={'Complete Sell'}
              description={'Please confirm this second transaction in your wallet to complete the sell.'}
            />
            <CompleteSection 
              processing={processing}
              active={acceptStep == AcceptStep.StepComplete}
              completed={acceptStep > AcceptStep.StepComplete}
              txHash={tradingTx}
              sectionNo={3}
              title="Finalize"
              description="Please wait for a while to finalize the sell."
            />

            {acceptStep === AcceptStep.StepDone && (
              <CongratsSection failed={false} succeedMessage={'you successfully sold this NFT'}/>
            )}
            {acceptStep === AcceptStep.StepFail && (
              <CongratsSection failed={true} failedMessage={'you were failed to sell this NFT'}/>
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
          {(acceptStep === AcceptStep.StepDone || acceptStep === AcceptStep.StepFail) ? (
            <button
              className='bg-[#B444F9] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onAccept}
              disabled={processing}>
              close
            </button>
          ) : (
            <button
              className='bg-[#38B000] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onAccept}
              disabled={processing}>
              accept
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default AcceptContent
