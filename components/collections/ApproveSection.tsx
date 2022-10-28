import React from 'react'
import SectionHeader from './SectionHeader'
import TransactionStatusSection from './TransactionStatusSection'

interface IApproveSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean,
  txHash?: string,
  sectionNo: number,
  title: string,
  descriptions: string[]
}

const ApproveSection: React.FC<IApproveSectionProps> = ({
  processing,
  active,
  completed,
  txHash,
  sectionNo,
  title,
  descriptions
}) => {
  return (
    <div className="section-container">
      <SectionHeader sectionNo={sectionNo} title={title} active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="section-content">
          {descriptions.map((desc, idx) => (
            <p className="section-description" key={idx}>
              {desc}
            </p>
          ))}
          <TransactionStatusSection processing={processing} txHash={txHash} isTx={true}/>
        </div>
      )}
    </div>
  )
}

export default ApproveSection
