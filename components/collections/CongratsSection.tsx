import React from "react";

interface ICongratsSectionProps {
  failed: boolean;
  succeedMessage?: string;
  failedMessage?: string;
}

const CongratsSection: React.FC<ICongratsSectionProps> = ({ failed, succeedMessage, failedMessage }) => {
  return failed ? (
    <div className='mt-6 failed'>
      <p className='bg-primary-gradient bg-clip-text text-transparent font-bold text-xg1 '>Oops!</p>
      <p className='text-lg text-primary-light font-medium mt-2'>{failedMessage}</p>
    </div>
  ) : (
    <div className='mt-6'>
      <p className='bg-primary-gradient bg-clip-text text-transparent font-bold text-xg1 '>Congrats!</p>
      <p className='text-lg text-primary-light font-medium mt-2'>{succeedMessage}</p>
    </div>
  );
};

export default CongratsSection;
