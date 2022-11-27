import React from 'react'
import { AcceptStep } from '../../types/enum'
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
  nftTokenId: string,
  collectionName: string,
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
  nftTokenId,
  collectionName,
  onAccept
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
        {(acceptStep === AcceptStep.StepAccept || acceptStep === AcceptStep.StepCheckNetwork) ? (
          <div>
            <BuySection
              price={price}
              currency={currency}
            />
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
              title={'Complete Sale'}
              description={'Please confirm this second transaction in your wallet to complete the sale.'}
            />
            <CompleteSection 
              processing={processing}
              active={acceptStep == AcceptStep.StepComplete}
              completed={acceptStep > AcceptStep.StepComplete}
              txHash={tradingTx}
              sectionNo={3}
              title="Finalize"
              description="Please wait for a while to finalize the sale."
            />

            {acceptStep === AcceptStep.StepDone && (
              <CongratsSection failed={false} succeedMessage={'you successfully sold this NFT'}/>
            )}
            {acceptStep === AcceptStep.StepFail && (
              <CongratsSection failed={true} failedMessage={'you failed to sell this NFT'}/>
            )}
          </div>
        )}
      </div>

      <div className="mt-20 flex justify-center">
        {(acceptStep === AcceptStep.StepDone || acceptStep === AcceptStep.StepFail) ? (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onAccept}
            disabled={processing}>
            close
          </button>
        ) : (
          <button
            className='bg-primary-gradient rounded-full text-black w-[95px] px-4 py-1.5 font-medium'
            onClick={onAccept}
            disabled={processing}>
            accept
          </button>
        )}
      </div>
    </>
  )
}

export default AcceptContent
