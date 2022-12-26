/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { CURRENCY_OMNI, PERIOD_LIST } from '../../utils/constants'
import { ListingStep, SaleType } from '../../types/enum'
import ListingContent from './ListingContent'
import { useSwitchedNetwork } from '../../hooks/useSwitchedNetwork'
import useTrading, { TradingInput } from '../../hooks/useTrading'

const useStyles = makeStyles(() =>
  createStyles({
    rootContent: {
      padding: '16px 40px 32px 40px'
    },
    dlgWidth: {
      maxWidth: 500,
      width: '800px',
      background: 'rgba(22, 22, 22, 0.9)',
      boxShadow: '0px 0px 250px #000000',
      backdropFilter: 'blur(10px)',
      borderRadius: 8
    }
  }),
)

export interface IConfirmSellProps {
  nftImage: string,
  nftTitle: string,
  nftTokenId: string,
  collectionName: string,
  tradingInput: TradingInput,
  handleSellDlgClose: () => void,
}

const ConfirmSell: React.FC<IConfirmSellProps> = ({
  nftImage,
  nftTitle,
  nftTokenId,
  collectionName,
  tradingInput,
  handleSellDlgClose,
}) => {
  const classes = useStyles()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sellType, setSellType] = useState<SaleType>(SaleType.FIXED)
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCY_OMNI)
  const [period, setPeriod] = useState(PERIOD_LIST[2])
  const [listingStep, setStep] = useState<ListingStep>(ListingStep.StepListing)
  const [processing, setProcessing] = useState(false)
  const [approveTx, setApproveTx] = useState('')
  const { onListingApprove, onListingConfirm, onListingDone } = useTrading(tradingInput)

  useSwitchedNetwork(() => {
    if (listingStep === ListingStep.StepCheckNetwork) {
      setStep(ListingStep.StepApprove)
    }
  })

  const onChangePrice = (e: any) => {
    setPrice(e.target.value)
  }

  const onChangeCurrency = (value: any) => {
    setCurrency(value)
  }

  const onChangePeriod = (value: any) => {
    setPeriod(value)
  }

  const onListing = () => {
    if (listingStep === ListingStep.StepListing) {
      setProcessing(true)
      setStep(ListingStep.StepCheckNetwork)
    } else if (listingStep === ListingStep.StepApprove) {
      setStep(ListingStep.StepConfirm)
    } else if (listingStep === ListingStep.StepDone || listingStep === ListingStep.StepFail) {
      onClose()
    }
  }

  const doLogic = async () => {
    const isAuction = sellType != SaleType.FIXED

    if (listingStep === ListingStep.StepCheckNetwork && onListingApprove) {
      await onListingApprove(true)
      setStep(ListingStep.StepApprove)
    }
    else if (listingStep === ListingStep.StepApprove && onListingApprove) {
      const tx = await onListingApprove(false)

      if (tx) {
        setApproveTx(tx.hash)
        await tx.wait()
      }

      setStep(ListingStep.StepConfirm)
    }
    else if (listingStep === ListingStep.StepConfirm && onListingConfirm) {
      await onListingConfirm({
        currencyName: currency.text,
        price,
        period: period.period,
        isAuction
      })

      setProcessing(false)
      setStep(ListingStep.StepDone)
    }
  }

  const onClose = () => {
    if (listingStep === ListingStep.StepDone && onListingDone) onListingDone()
    handleSellDlgClose()
    setStep(ListingStep.StepListing)
  }

  useEffect(() => {
    if (listingStep === ListingStep.StepListing) return

    doLogic().catch((e: Error) => {
      console.log('error', e)
      if (e.message !== 'Network changed') {
        if (listingStep === ListingStep.StepCheckNetwork) {
          setProcessing(false)
          setStep(ListingStep.StepListing)
        }
        else {
          setProcessing(false)
          setStep(ListingStep.StepFail)
        }
      }
      else {
        // will be hooked by useSwitchedNetwork
      }
    })
  }, [listingStep])

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={'py-6 px-10 m-0'}>
        <div className="mt-5">
          <div className="text-primary-light text-xg2 font-bold">list item for sale</div>
          {/*<div className="flex justify-end">
            <button className={`w-[132px] px-5 py-2 text-[#ADB5BD] font-['Roboto Mono'] font-semibold text-lg rounded-lg border-2 border-[#ADB5BD] ${sellType==SaleType.FIXED?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`} onClick={() => setSellType(SaleType.FIXED)}>fixed price</button>
            <button className={`w-[132px] px-5 py-2 text-[#6C757D] font-['Roboto Mono'] font-semibold text-lg rounded-lg border-2 border-[#ADB5BD] relative -left-2.5 ${sellType==SaleType.AUCTION?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`} onClick={() => setSellType(SaleType.FIXED)}>auction</button>
          </div>*/}
        </div>
      </DialogTitle>
      <DialogContent className={classes.rootContent}>
        <ListingContent
          price={price}
          onChangePrice={onChangePrice}
          currency={currency}
          onChangeCurrency={onChangeCurrency}
          period={period}
          onChangePeriod={onChangePeriod}
          onListing={onListing}
          nftImage={nftImage}
          nftTitle={nftTitle}
          nftTokenId={nftTokenId}
          collectionName={collectionName}
          nftChainId={tradingInput.selectedNFTItem?.chain_id || 0}
          sellType={sellType}
          listingStep={listingStep}
          processing={processing}
          approveTx={approveTx}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmSell
