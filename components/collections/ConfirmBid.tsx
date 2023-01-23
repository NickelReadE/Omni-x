/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import BidContent from './BidContent'
import { CURRENCY_OMNI, PERIOD_LIST } from '../../utils/constants'
import { BidStep } from '../../types/enum'
import useTrading, { TradingInput } from '../../hooks/useTrading'
import { CollectionBidInput, useCollectionBid } from '../../hooks/useCollectionBid'
import {FullCollectionType} from '../../types/collections'

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
      maxWidth: 500,
      width: '800px',
      background: 'rgba(22, 22, 22, 0.9)',
      boxShadow: '0px 0px 250px #000000',
      backdropFilter: 'blur(10px)',
      borderRadius: 8
    }
  }),
)

export interface IConfirmBidProps {
  nftImage: string,
  nftTitle: string,
  nftTokenId: string,
  collectionName: string,
  tradingInput?: TradingInput,
  collectionBid?: CollectionBidInput,
  collectionInfo?: FullCollectionType,
  onBuyFloor?: (nft: any) => void,
  handleBidDlgClose: () => void,
}

const ConfirmBid: React.FC<IConfirmBidProps> = ({
  nftImage,
  nftTitle,
  nftTokenId,
  collectionName,
  tradingInput,
  collectionBid,
  collectionInfo,
  onBuyFloor,
  handleBidDlgClose,
}) => {
  const classes = useStyles()
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(CURRENCY_OMNI)
  const [period, setPeriod] = useState(PERIOD_LIST[2])
  const [bidStep, setStep] = useState<BidStep>(BidStep.StepBid)
  const [processing, setProcessing] = useState(false)
  const [approveTx, setApproveTx] = useState('')
  let onBidApprove: any = null, onBidConfirm: any = null, onBidDone: any = null
  let isCollectionBid = false
  const {
    onBidApprove: onTradingBidApprove,
    onBidConfirm: onTradingBidConfirm,
    onBidDone: onTradingBidDone
  } = useTrading(tradingInput)
  const {
    onCollectionBidApprove,
    onCollectionBidConfirm,
    onCollectionBidDone
  } = useCollectionBid(collectionBid)

  if (tradingInput) {
    onBidApprove = onTradingBidApprove
    onBidConfirm = onTradingBidConfirm
    onBidDone = onTradingBidDone
  }
  else if (collectionBid) {
    onBidApprove = onCollectionBidApprove
    onBidConfirm = onCollectionBidConfirm
    onBidDone = onCollectionBidDone
    isCollectionBid = true
  }

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
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={'py-6 px-10 m-0'}>
        <div className="mt-5">
          <div className="text-primary-light text-xg2 font-bold">{isCollectionBid ? 'make a collection bid' : 'place bid'}</div>
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
          nftTokenId={nftTokenId}
          collectionName={collectionName}
          bidStep={bidStep}
          processing={processing}
          approveTx={approveTx}
          isCollectionBid={isCollectionBid}
          collectionInfo={collectionInfo}
          onBuyFloor={onBuyFloor}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBid
