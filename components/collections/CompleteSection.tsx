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
    <div className="mt-[16px]">
      <SectionHeader sectionNo={sectionNo} title={title} active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="mt-4 mb-4 ml-6 max-w-[450px]">
          <p className="text-secondary text-md">
            {description}
          </p>

          <TransactionStatusSection processing={processing} txHash={txHash} isTx={false}/>
        </div>
      )}
    </div>
  )
}

export default CompleteSection
