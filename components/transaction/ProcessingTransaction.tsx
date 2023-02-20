import React from "react";
import { PendingTxType } from "../../contexts/contract";
import { getBlockExplorer, getChainNameFromId } from "../../utils/constants";
import { ChainIcon } from "../common/ChainIcon";

type ProcessingTransactionProps = {
  txInfo: PendingTxType;
};

const ProcessingTransaction = ({ txInfo }: ProcessingTransactionProps): JSX.Element => {
  const onViewExplorer = () => {
    if (txInfo && txInfo.lzPath) {
      window.open(txInfo.lzPath);
    } else if (txInfo && txInfo.txHash && txInfo.senderChainId) {
      const explorer = getBlockExplorer(txInfo.senderChainId);
      if (explorer) {
        window.open(`${explorer}/tx/${txInfo.txHash}`, "_blank");
      }
    }
  };

  const txDone = txInfo.type === "gaslessMint" ? !!txInfo.txHash : txInfo.txHash && txInfo.destTxHash;
  const renderContent = (txInfo: PendingTxType) => {
    return (
      <div className='flex items-center justify-between px-3'>
        <span className='bg-repost-gradient bg-clip-text text-transparent w-[35px] truncate text-[14px] leading-[18px] font-bold'>
          {txInfo.type === "bridge" && "xfer:"}
          {txInfo.type === "buy" && "buy:"}
          {txInfo.type === "accept" && "sell:"}
          {txInfo.type === "gaslessMint" && "mint:"}
        </span>
        {txInfo.lzPath ? (
          <ChainIcon chainName='layerzero' onClick={onViewExplorer} />
        ) : (
          <ChainIcon chainName={getChainNameFromId(txInfo.senderChainId)} onClick={onViewExplorer} />
        )}
        <span className='text-md text-primary-light ml-1 w-[120px] truncate'>{txInfo?.itemName}</span>
        {txDone ? <img src='/images/tx_check.svg' alt='tx check' /> : <span className='w-[16px] h-[16px]' />}
      </div>
    );
  };

  return (
    <>
      <div className={"rounded-lg w-full h-[40px] md:order-2 mr-[70px] flex flex-col justify-center py-2"}>
        {txInfo.type === "bridge" && renderContent(txInfo)}
        {txInfo.type === "buy" && renderContent(txInfo)}
        {txInfo.type === "accept" && renderContent(txInfo)}
        {txInfo.type === "gaslessMint" && renderContent(txInfo)}
      </div>
    </>
  );
};

export default ProcessingTransaction;
