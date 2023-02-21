import React from "react";
import useWallet from "../../hooks/useWallet";
import { CHAIN_TYPE } from "../../types/enum";
import { CHAIN_IDS, getBlockExplorer } from "../../utils/constants";

interface ITransactionStatusSectionProps {
  processing: boolean;
  txHash?: string;
  isTx: boolean;
}

const TransactionStatusSection: React.FC<ITransactionStatusSectionProps> = ({ processing, txHash, isTx }) => {
  const { chainId } = useWallet();
  const explorer = getBlockExplorer(chainId || CHAIN_IDS[CHAIN_TYPE.GOERLI]);
  const txHashLink = txHash && `${explorer}/tx/${txHash}`;

  return (
    <div className='text-[12px] leading-[16px] text-[#A0B3CC] mt-4'>
      {isTx && (
        <>
          <div className='tx-status-row flex items-center'>
            <p className='text-primary-light text-[14px] leading-[17px]'>transaction status:</p>
            <p className='text-primary-light text-[14px] leading-[17px] ml-3'>{processing ? "confirming..." : "done"}</p>
          </div>

          <div className='tx-status-row flex items-center'>
            <p className='text-primary-light text-[14px] leading-[17px]'>transaction record:</p>
            <a
              className='text-primary-light text-[14px] leading-[17px] ml-3 tx-hash-ellipsis'
              href={txHashLink}
              target='_blank'
              rel='noreferrer'
            >
              {txHash || ""}
            </a>
          </div>
        </>
      )}

      {!isTx && (
        <>
          <div className='tx-status-row flex items-center'>
            <p className='text-primary-light text-[14px] leading-[17px]'>action status:</p>
            <p className='text-primary-light text-[14px] leading-[17px] ml-3'>{processing ? "waiting..." : "done"}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionStatusSection;
