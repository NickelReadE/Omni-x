/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { IOrder } from '../../interface/interface'
import { ContractName, formatCurrency, getCurrencyNameAddress, validateCurrencyName } from '../../utils/constants'
import { BuyStep } from '../../types/enum'
import BuyContent from './BuyContent'
import useWallet from '../../hooks/useWallet'
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

export interface IConfirmBuyProps {
  nftImage: string,
  nftTitle: string,
  nftTokenId: string,
  collectionName: string,
  order?: IOrder,
  instantBuy?: boolean,
  tradingInput: TradingInput,
  onBuyApprove?: (order?: IOrder) => Promise<any>,
  onBuyConfirm?: (order?: IOrder) => Promise<any>,
  onBuyComplete?: (order?: IOrder) => void
  onBuyDone?: () => void
  handleBuyDlgClose: () => void,
}

const ConfirmBuy: React.FC<IConfirmBuyProps> = ({
  nftImage,
  nftTitle,
  nftTokenId,
  collectionName,
  order,
  instantBuy,
  tradingInput,
  handleBuyDlgClose,
}) => {
  const classes = useStyles()
  const [buyStep, setStep] = useState<BuyStep>(instantBuy ? BuyStep.StepApprove : BuyStep.StepBuy)
  const [processing, setProcessing] = useState(false)
  const [approveTx, setApproveTx] = useState('')
  const [tradingTx, setTradingTx] = useState('')
  const { chainId } = useWallet()
  const { onBuyApprove, onBuyConfirm, onBuyComplete, onBuyDone } = useTrading(tradingInput)

  const onBuy = () => {
    if (buyStep === BuyStep.StepBuy) {
      setProcessing(true)
      setStep(BuyStep.StepApprove)
    }
    else if (buyStep === BuyStep.StepApprove) {
      setStep(BuyStep.StepConfirm)
    }
    else if (buyStep === BuyStep.StepDone || buyStep === BuyStep.StepFail) {
      onClose()
    }
  }

  const doLogic = async () => {
    if (buyStep === BuyStep.StepApprove && onBuyApprove) {
      setProcessing(true)

      const txs = await onBuyApprove(order)

      if (!txs) {
        setStep(BuyStep.StepFail)
      }

      if (txs.length > 0) {
        setApproveTx(txs[0].hash)
        await Promise.all(txs.map((tx: any) => tx.wait()))
      }

      setStep(BuyStep.StepConfirm)
    } else if (buyStep === BuyStep.StepConfirm && onBuyConfirm) {
      const tx = await onBuyConfirm(order)
      
      if (tx) {
        setTradingTx(tx.hash)
        await tx.wait()

        setStep(BuyStep.StepComplete)
      }
    } else if (buyStep === BuyStep.StepComplete && onBuyComplete) {
      await onBuyComplete(order)

      setStep(BuyStep.StepDone)
      setProcessing(false)
    }
  }

  const onClose = () => {
    if (buyStep === BuyStep.StepDone && onBuyDone) onBuyDone()
    handleBuyDlgClose()
    setStep(BuyStep.StepBuy)
  }

  useEffect(() => {
    if (buyStep === BuyStep.StepBuy) return

    doLogic().catch((e) => {
      console.log('error', e)
      setProcessing(false)
      setStep(BuyStep.StepFail)
    })
  }, [buyStep, order, setStep])

  const currencyName = getCurrencyNameAddress(order?.currencyAddress) as ContractName
  const newCurrencyName = validateCurrencyName(currencyName, chainId || 0)
  const formattedPrice = formatCurrency(order?.price || 0, order?.chain_id || 0, getCurrencyNameAddress(order?.currencyAddress))

  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={'py-6 px-10 m-0'}>
        <div className="mt-5">
          <div className="text-primary-light text-xg2 font-bold">purchase confirmation</div>
        </div>
      </DialogTitle>
      <DialogContent className={classes.rootContent}>
        <BuyContent
          price={formattedPrice ? Number(formattedPrice) : 0}
          srcCurrency={currencyName}
          currency={newCurrencyName}
          onBuy={onBuy}
          nftImage={nftImage}
          nftTitle={nftTitle}
          nftTokenId={nftTokenId}
          collectionName={collectionName}
          buyStep={buyStep}
          processing={processing}
          approveTx={approveTx}
          tradingTx={tradingTx}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBuy
