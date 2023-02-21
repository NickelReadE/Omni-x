import React from "react";
import SectionHeader from "./SectionHeader";
import TransactionStatusSection from "./TransactionStatusSection";

interface IApproveSectionProps {
  processing: boolean;
  active: boolean;
  completed: boolean;
  txHash?: string;
  sectionNo: number;
  title: string;
  descriptions: string[];
}

const ApproveSection: React.FC<IApproveSectionProps> = ({ processing, active, completed, txHash, sectionNo, title, descriptions }) => {
  return (
    <div className=''>
      <SectionHeader sectionNo={sectionNo} title={title} active={active} processing={processing} completed={completed} />

      {active && (
        <div className='mt-4 mb-4 ml-6 max-w-[450px]'>
          {descriptions.map((desc, idx) => (
            <p className={`text-secondary text-md ${idx !== 0 ? "pt-2" : "pt-0"}`} key={idx}>
              {desc}
            </p>
          ))}
          <TransactionStatusSection processing={processing} txHash={txHash} isTx={true} />
        </div>
      )}
    </div>
  );
};

export default ApproveSection;
