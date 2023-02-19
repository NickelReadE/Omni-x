/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { IOrder } from "../../interface/interface";
import { ContractName, formatCurrency, getCurrencyNameAddress, validateCurrencyName } from "../../utils/constants";
import { AcceptStep } from "../../types/enum";
import useWallet from "../../hooks/useWallet";
import AcceptContent from "./AcceptContent";
import { useSwitchedNetwork } from "../../hooks/useSwitchedNetwork";
import useTrading, { TradingInput } from "../../hooks/useTrading";

const useStyles = makeStyles(() =>
  createStyles({
    rootContent: {
      padding: "16px 40px 32px 40px"
    },
    dlgWidth: {
      maxWidth: 500,
      width: "800px",
      background: "rgba(22, 22, 22, 0.9)",
      boxShadow: "0px 0px 250px #000000",
      backdropFilter: "blur(10px)",
      borderRadius: 8
    }
  })
);

export interface IConfirmAcceptProps {
  nftImage: string;
  nftTitle: string;
  nftTokenId: string;
  collectionName: string;
  bidOrder?: IOrder;
  tradingInput: TradingInput;
  handleAcceptDlgClose: () => void;
}

const ConfirmAccept: React.FC<IConfirmAcceptProps> = ({
  nftImage,
  nftTitle,
  nftTokenId,
  collectionName,
  bidOrder,
  tradingInput,
  handleAcceptDlgClose
}) => {
  const classes = useStyles();
  const [acceptStep, setStep] = useState<AcceptStep>(AcceptStep.StepAccept);
  const [processing, setProcessing] = useState(false);
  const [approveTx, setApproveTx] = useState("");
  const [tradingTx, setTradingTx] = useState("");
  const { chainId } = useWallet();
  const { onAcceptApprove, onAcceptConfirm, onAcceptComplete, onAcceptDone } = useTrading(tradingInput);

  useSwitchedNetwork(() => {
    if (acceptStep === AcceptStep.StepCheckNetwork) {
      setStep(AcceptStep.StepApprove);
    }
  });

  const onAccept = () => {
    if (acceptStep === AcceptStep.StepAccept) {
      setProcessing(true);
      setStep(AcceptStep.StepCheckNetwork);
    } else if (acceptStep === AcceptStep.StepApprove) {
      setStep(AcceptStep.StepConfirm);
    } else if (acceptStep === AcceptStep.StepDone || acceptStep === AcceptStep.StepFail) {
      onClose();
    }
  };

  const doLogic = async () => {
    if (!bidOrder) throw new Error("Invalid bid");

    if (acceptStep === AcceptStep.StepCheckNetwork && onAcceptApprove) {
      await onAcceptApprove(true);
      setStep(AcceptStep.StepApprove);
    } else if (acceptStep === AcceptStep.StepApprove && onAcceptApprove) {
      const tx = await onAcceptApprove(false);

      if (tx) {
        setApproveTx(tx.hash);
        await tx.wait();
      }

      setStep(AcceptStep.StepConfirm);
    } else if (acceptStep === AcceptStep.StepConfirm && onAcceptConfirm) {
      const tx = await onAcceptConfirm(bidOrder, tradingInput.tokenId || "0");

      if (tx) {
        setTradingTx(tx.hash);
        await tx.wait();

        setStep(AcceptStep.StepComplete);
      }
    } else if (acceptStep === AcceptStep.StepComplete && onAcceptComplete) {
      await onAcceptComplete(bidOrder);

      setStep(AcceptStep.StepDone);
      setProcessing(false);
    }
  };

  const onClose = () => {
    if (acceptStep === AcceptStep.StepDone && onAcceptDone) onAcceptDone();
    handleAcceptDlgClose();
    setStep(AcceptStep.StepAccept);
  };

  useEffect(() => {
    if (acceptStep === AcceptStep.StepAccept) return;

    doLogic().catch((e: Error) => {
      console.log("error", e);
      if (e.message !== "Network changed") {
        if (acceptStep === AcceptStep.StepCheckNetwork) {
          setProcessing(false);
          setStep(AcceptStep.StepAccept);
        } else {
          setProcessing(false);
          setStep(AcceptStep.StepFail);
        }
      } else {
        // will be hooked by useSwitchedNetwork
      }
    });
  }, [acceptStep, bidOrder, setStep]);

  const currencyName = getCurrencyNameAddress(bidOrder?.currency) as ContractName;
  const newCurrencyName = validateCurrencyName(currencyName, chainId || 0);
  const formattedPrice = formatCurrency(bidOrder?.price || 0, bidOrder?.chain_id || 0, getCurrencyNameAddress(bidOrder?.currency));
  return (
    <Dialog open={true} onClose={onClose} aria-labelledby='form-dialog-title' classes={{ paper: classes.dlgWidth }}>
      <DialogTitle id='form-dialog-title' className={"py-6 px-10 m-0"}>
        <div className='mt-5'>
          <div className='text-primary-light text-xg2 font-bold'>accept bid</div>
        </div>
      </DialogTitle>
      <DialogContent className={classes.rootContent}>
        <AcceptContent
          price={formattedPrice ? Number(formattedPrice) : 0}
          currency={newCurrencyName || ""}
          onAccept={onAccept}
          nftImage={nftImage}
          nftTitle={nftTitle}
          nftTokenId={nftTokenId}
          collectionName={collectionName}
          acceptStep={acceptStep}
          processing={processing}
          approveTx={approveTx}
          tradingTx={tradingTx}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmAccept;
