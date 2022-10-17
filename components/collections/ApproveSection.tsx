import React from 'react'
import SectionHeader from './SectionHeader'
import TransactionStatusSection from './TransactionStatusSection'

interface IApproveSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean,
  txHash?: string
}

const ApproveSection: React.FC<IApproveSectionProps> = ({
  processing,
  active,
  completed,
  txHash
}) => {
  return (
    <div className="section-container">
      <SectionHeader sectionNo={1} sectionTitle="Approve Collection" active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="section-content">
          <p className="section-description">
            Please confirm the transaction in your wallet.
          </p>
          <p className="section-description">
            This confirmation allows you to sell or buy both this NFT and any future NFT from this collection.
          </p>

          <TransactionStatusSection processing={processing} txHash={txHash}/>
        </div>
      )}
    </div>
  )
}

export default ApproveSection
