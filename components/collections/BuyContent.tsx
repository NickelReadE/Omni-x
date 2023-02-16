import React, {useState} from 'react'
import { BuyStep } from '../../types/enum'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import BuySection from './BuySection'
import ConfirmSection from './ConfirmSection'
import CompleteSection from './CompleteSection'
import {SecondaryButton} from '../common/buttons/SecondaryButton'
import LazyLoad from 'react-lazyload'

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
  nftTokenId: string,
  collectionName: string,
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
  nftTokenId,
  collectionName,
  onBuy
}) => {
  const [imageError, setImageError] = useState(false)

  return (
    <>
      <div className='flex flex-col justify-between'>
        <div className={'flex justify-center mb-5'}>
          <div className={'flex flex-col'}>
            <div className={'bg-primary-gradient p-[1px] rounded'}>
              <LazyLoad placeholder={<img src={'/images/omni-logo-mint-cropped.jpg'} alt="nft-image"/>}>
                <img
                  className='bg-primary rounded'
                  src={imageError ? '/images/omni-logo-mint-cropped.jpg' : nftImage}
                  alt="nft-image"
                  width={190}
                  height={190}
                  onError={() => { setImageError(true) }}
                  data-src={nftImage}
                />
              </LazyLoad>
            </div>
            <p className={'text-primary-light mt-3'}>#{nftTokenId}</p>
            <p className='text-secondary font-medium'>{collectionName}</p>
          </div>
        </div>
        {buyStep === BuyStep.StepBuy ? (
          <div>
            <BuySection
              price={price}
              srcCurrency={srcCurrency}
              currency={currency}
            />
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
      </div>

      <div className="mt-5 flex justify-center">
        {(buyStep === BuyStep.StepDone || buyStep === BuyStep.StepFail) ? (
          <SecondaryButton text={'close'} onClick={onBuy} disabled={processing}/>
        ) : (
          <SecondaryButton text={'confirm'} onClick={onBuy} disabled={processing || !currency || !price} />
        )}
      </div>
    </>
  )
}

export default BuyContent
