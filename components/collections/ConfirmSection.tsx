import React from 'react'
import TransactionStatusSection from './TransactionStatusSection'
import SectionHeader from './SectionHeader'

interface IConfirmSectionProps {
  processing: boolean,
  active: boolean,
  completed: boolean,
  txHash?: string,
  sectionNo: number,
  title: string,
  description: string
}

const ConfirmSection: React.FC<IConfirmSectionProps> = ({
  processing,
  active,
  completed,
  txHash,
  sectionNo,
  title,
  description
}) => {
  return (
    <div className="mt-[16px]">
      <SectionHeader sectionNo={sectionNo} title={title} active={active} processing={processing} completed={completed}/>

      {active && (
        <div className="mt-4 mb-4 ml-6 max-w-[450px]">
          <p className="text-secondary text-md">
            {description}
          </p>

          <TransactionStatusSection processing={processing} txHash={txHash} isTx={true}/>
        </div>
      )}
    </div>
  )
}

export default ConfirmSection
