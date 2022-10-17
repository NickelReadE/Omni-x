import React from 'react'
import TransactionStatusSection from './TransactionStatusSection'
import SectionHeader from './SectionHeader'

interface IConfirmListingSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean
}

const ConfirmListingSection: React.FC<IConfirmListingSectionProps> = ({
  processing,
  active,
  completed
}) => {
  return (
    <div className="section-container mt-[16px]">
      <SectionHeader sectionNo={2} sectionTitle="Complete Listing" active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="section-content">
          <p className="section-description">
            Please confirm this second transaction in your wallet to complete the listing.
          </p>

          <TransactionStatusSection processing={processing}/>
        </div>
      )}
    </div>
  )
}

export default ConfirmListingSection
