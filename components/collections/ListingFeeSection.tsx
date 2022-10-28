import React from 'react'

const ListingFeeSection: React.FC = () => {
  return (
    <div className="col-span-3">
      <div className='flex justify-end'>
        <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>service fee:</p>
        <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>1.50% *</p>
      </div>
      <div className='flex justify-end'>
        <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>creator fee:</p>
        <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>2.00%</p>
      </div>
      <div className='flex justify-end'>
        <p className='text-[12px] mt-1.5 text-[#ADB5BD] font-light italic text-right'>*purchases using $OMNI reduce buyer’s<br/>platform tax from 2% to 1.5%</p>
      </div>
    </div>
  )
}

export default ListingFeeSection
