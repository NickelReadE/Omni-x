import React from 'react'
import TransactionStatusSection from './TransactionStatusSection'
import SectionHeader from './SectionHeader'

interface ICompleteSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean,
  title: string,
  description: string,
  txHash?: string,
  sectionNo: number
}

const CompleteSection: React.FC<ICompleteSectionProps> = ({
  processing,
  active,
  completed,
  title,
  description,
  sectionNo,
  txHash
}) => {
  return (
    <div className="section-container mt-[16px]">
      <SectionHeader sectionNo={sectionNo} sectionTitle={title} active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="section-content">
          <p className="section-description">
            {description}
          </p>

          <TransactionStatusSection processing={processing} txHash={txHash} isTx={false}/>
        </div>
      )}
    </div>
  )
}

export default CompleteSection
