/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { IListingData } from '../../interface/interface'
import { CURRENCIES_LIST, PERIOD_LIST } from '../../utils/constants'
import { ListingStep, SaleType } from '../../types/enum'
import ListingContent from './ListingContent'

const useStyles = makeStyles(() =>
  createStyles({
    rootTitle: {
      margin: 0,
      padding: '24px 40px'
    },
    rootContent: {
      padding: '16px 40px 32px 40px'
    },
    dlgWidth: {
      maxWidth: '800px',
      width: '800px',
    }
  }),
)

interface IConfirmSellProps {
  handleSellDlgClose: () => void,
  openSellDlg: boolean,
  nftImage: string,
  nftTitle: string,
  onListingApprove?: (isAuction: boolean) => Promise<any>,
  onListingConfirm?: (listingData: IListingData) => Promise<any>,
  onListingDone?: () => void
}

const ConfirmSell: React.FC<IConfirmSellProps> = ({
  handleSellDlgClose,
  openSellDlg,
  nftImage,
  nftTitle,
  onListingApprove,
  onListingConfirm,
  onListingDone,
}) => {
  const classes = useStyles()
  const [sellType, setSellType] = useState<SaleType>(SaleType.FIXED)
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCIES_LIST[0])
  const [period, setPeriod] = useState(PERIOD_LIST[2])
  const [listingStep, setStep] = useState<ListingStep>(ListingStep.StepListing)
  const [processing, setProcessing] = useState(false)
  const [approveTx, setApproveTx] = useState('')

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
      setStep(ListingStep.StepApprove)
      setProcessing(true)
    }
    else if (listingStep === ListingStep.StepApprove) {
      setStep(ListingStep.StepConfirm)
    }
    else if (listingStep === ListingStep.StepDone || listingStep === ListingStep.StepFail) {
      setStep(ListingStep.StepListing)
      handleSellDlgClose()
      if (onListingDone) onListingDone()
    }
  }

  const doLogic = async () => {
    const isAuction = sellType != SaleType.FIXED

    if (listingStep === ListingStep.StepApprove && onListingApprove) {
      const tx = await onListingApprove(isAuction)
      
      setProcessing(true)

      if (tx === undefined) {
        throw new Error('tx is not approved')
      }
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

  useEffect(() => {
    if (listingStep === ListingStep.StepListing) return

    doLogic().catch((e) => {
      console.log('error', e)
      setProcessing(false)
      setStep(ListingStep.StepFail)
    })
  }, [listingStep, currency, period, setStep])

  return (
    <Dialog open={openSellDlg} onClose={handleSellDlgClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.rootTitle}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">list item for sale</div>
          <div className="flex justify-end">
            <button className={`w-[132px] px-5 py-2 text-[#ADB5BD] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] ${sellType==SaleType.FIXED?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`} onClick={() => setSellType(SaleType.FIXED)}>fixed price</button>
            <button className={`w-[132px] px-5 py-2 text-[#6C757D] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] relative -left-2.5 ${sellType==SaleType.AUCTION?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`}onClick={() => setSellType(SaleType.FIXED)}>auction</button>
          </div>
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
