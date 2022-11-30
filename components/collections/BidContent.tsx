/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import { BidStep } from '../../types/enum'
import ListingSection from './ListingSection'
import ListingFeeSection from './ListingFeeSection'
import ApproveSection from './ApproveSection'
import CongratsSection from './CongratsSection'
import CompleteSection from './CompleteSection'
import useWallet from '../../hooks/useWallet'
import { CollectionType } from '../../hooks/useCollection'

interface IBidContentProps {
  bidStep: BidStep,
  processing: boolean,
  approveTx?: string,
  price: number,
  collectionInfo?: CollectionType,
  isCollectionBid: boolean,
  onChangePrice: (e: any) => void,
  currency: any,
  onChangeCurrency: (e: any) => void,
  period: any,
  onChangePeriod: (e: any) => void,
  nftImage: string,
  nftTitle: string,
  onBid?: () => void,
  onBuyFloor?: (nft: any) => void,
}

const BidContent: React.FC<IBidContentProps> = ({
  bidStep,
  processing,
  approveTx,
  price,
  collectionInfo,
  isCollectionBid,
  onChangePrice,
  currency,
  onChangeCurrency,
  period,
  onChangePeriod,
  nftImage,
  nftTitle,
  onBid,
  onBuyFloor
}) => {
  const { chainId } = useWallet()
  const [ floorNft, setFloorNft ] = useState<any>(null)

  const updateFloorNft = (c?: string) => {
    if (isCollectionBid && collectionInfo && c) {
      const nft = (collectionInfo.floorNft as any)[c.toLowerCase()]
      if (nft && nft.order_data) {
        setFloorNft(nft)
      }
      else {
        setFloorNft(null)
      }
    }
  }
  const onChangeCurrencyFloor = (v: any) => {
    if (onChangeCurrency) onChangeCurrency(v)
    updateFloorNft(v?.text)
  }

  useEffect(() => {
    updateFloorNft(currency.text)
  }, [])

  return (
    <>
      <div className='flex justify-between'>
        {bidStep === BidStep.StepBid ? (
          <ListingSection
            nftChainId={chainId || 0}
            priceLabel={'Bid Price'}
            price={price}
            onChangePrice={onChangePrice}
            currency={currency}
            onChangeCurrency={onChangeCurrencyFloor}
            period={period}
            onChangePeriod={onChangePeriod}
            floorNft={floorNft}
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
        
        <div>
          <img alt={'nftImage'} className='rounded-[8px] max-w-[250px]' src={floorNft ? floorNft.image : nftImage} />
          <p className='mt-2 text-center text-[#6C757D] font-medium'>{floorNft ? floorNft.name : nftTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-20 flex items-end">
        <div className="col-span-1 flex">
          {(bidStep === BidStep.StepDone || bidStep === BidStep.StepFail) ? (
            <button
              className='bg-[#B444F9] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onBid}
              disabled={processing}>
              close
            </button>
          ) : (
            <button
              className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]'
              onClick={onBid}
              disabled={processing}>
              bid
            </button>
          )}

          {isCollectionBid && !!floorNft && onBuyFloor && (
            <button
              className='bg-[#38B000] rounded text-[#fff] w-[95px] h-[35px] ml-1'
              onClick={() => onBuyFloor(floorNft)}>
              buy floor
            </button>
          )}
        </div>

        {bidStep === BidStep.StepBid && (
          <ListingFeeSection/>
        )}
      </div>
    </>
  )
}

export default BidContent
