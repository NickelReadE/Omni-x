import React from 'react'

interface ICongratsSectionProps {
  failed: boolean
}

const CongratsSection: React.FC<ICongratsSectionProps> = ({
  failed
}) => {
  return failed ? (
    <div className="congrats-section failed">
      <p className="congrats-title">Oops!</p>
      <p className="congrats-description">your NFT was failed to list</p>
    </div>
  ) : (
    <div className="congrats-section">
      <p className="congrats-title">Congrats!</p>
      <p className="congrats-description">your NFT was successfully listed</p>
    </div>
  )
}

export default CongratsSection
