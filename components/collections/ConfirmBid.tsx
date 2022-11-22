/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import BidContent from './BidContent'
import { IBidData } from '../../interface/interface'
import { CURRENCY_OMNI, PERIOD_LIST } from '../../utils/constants'
import { BidStep } from '../../types/enum'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: 0,
      padding: '24px 40px'
    },
    rootContent: {
      padding: '16px 40px 32px 40px'
    },
    dlgWidth: {
      maxWidth: '800px',
      width: '800px'
    }
  }),
)

interface IConfirmBidProps {
  handleBidDlgClose: () => void,
  openBidDlg: boolean,
  nftImage: string,
  nftTitle: string,
  onBidApprove?: (bidData: IBidData) => Promise<any>,
  onBidConfirm?: (bidData: IBidData) => Promise<void>,
  onBidDone?: () => void
}

const ConfirmBid: React.FC<IConfirmBidProps> = ({
  handleBidDlgClose,
  openBidDlg,
  nftImage,
  nftTitle,
  onBidApprove,
  onBidConfirm,
  onBidDone,
}) => {
  const classes = useStyles()
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCY_OMNI)
  const [period, setPeriod] = useState(PERIOD_LIST[2])
  const [bidStep, setStep] = useState<BidStep>(BidStep.StepBid)
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

  const onBid = () => {
    if (bidStep === BidStep.StepBid) {
      setProcessing(true)
      setStep(BidStep.StepApprove)
    }
    else if (bidStep === BidStep.StepApprove) {
      setStep(BidStep.StepConfirm)
    }
    else if (bidStep === BidStep.StepDone || bidStep === BidStep.StepFail) {
      onClose()
    }
  }

  const doLogic = async () => {
    if (bidStep === BidStep.StepApprove && onBidApprove) {
      const txs = await onBidApprove({
        currencyName: currency.text,
        price
      })
      
      setProcessing(true)

      if (txs.length > 0) {
        setApproveTx(txs[0].hash)
        await Promise.all(txs.map((tx: any) => tx.wait()))
      }

      setStep(BidStep.StepConfirm)
    }
    else if (bidStep === BidStep.StepConfirm && onBidConfirm) {
      await onBidConfirm({
        currencyName: currency.text,
        price
      })

      setProcessing(false)
      setStep(BidStep.StepDone)
    }
  }

  const onClose = () => {
    if (bidStep === BidStep.StepDone && onBidDone) onBidDone()
    handleBidDlgClose()
    setStep(BidStep.StepBid)
  }

  useEffect(() => {
    if (bidStep === BidStep.StepBid) return

    doLogic().catch((e) => {
      console.log('error', e)
      setProcessing(false)
      setStep(BidStep.StepFail)
    })
  }, [bidStep])

  return (
    <Dialog open={openBidDlg} onClose={onClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.root}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">place bid</div>
        </div>
      </DialogTitle>
      <DialogContent className={classes.rootContent}>
        <BidContent
          price={price}
          onChangePrice={onChangePrice}
          currency={currency}
          onChangeCurrency={onChangeCurrency}
          period={period}
          onChangePeriod={onChangePeriod}
          onBid={onBid}
          nftImage={nftImage}
          nftTitle={nftTitle}
          bidStep={bidStep}
          processing={processing}
          approveTx={approveTx}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBid
