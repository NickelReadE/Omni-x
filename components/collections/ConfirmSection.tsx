import React from 'react'
import TransactionStatusSection from './TransactionStatusSection'
import SectionHeader from './SectionHeader'

interface IConfirmSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean,
  txHash?: string,
  sectionNo: number
}

const ConfirmSection: React.FC<IConfirmSectionProps> = ({
  processing,
  active,
  completed,
  txHash,
  sectionNo
}) => {
  return (
    <div className="section-container mt-[16px]">
      <SectionHeader sectionNo={sectionNo} sectionTitle="Confirm Purchase" active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="section-content">
          <p className="section-description">
            Please confirm this second transaction in your wallet to confirm the purchase.
          </p>

          <TransactionStatusSection processing={processing} txHash={txHash} isTx={true}/>
        </div>
      )}
    </div>
  )
}

export default ConfirmSection
