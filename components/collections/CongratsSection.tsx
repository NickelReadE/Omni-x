import React from 'react'

interface ICongratsSectionProps {
  failed: boolean,
  succeedMessage?: string,
  failedMessage?: string
}

const CongratsSection: React.FC<ICongratsSectionProps> = ({
  failed,
  succeedMessage,
  failedMessage,
}) => {
  return failed ? (
    <div className="congrats-section failed">
      <p className="congrats-title">Oops!</p>
      <p className="congrats-description">{failedMessage}</p>
    </div>
  ) : (
    <div className="congrats-section">
      <p className="congrats-title">Congrats!</p>
      <p className="congrats-description">{succeedMessage}</p>
    </div>
  )
}

export default CongratsSection
