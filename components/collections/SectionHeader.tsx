import React from 'react'
import Image from 'next/image'
import SpinLoader from './SpinLoader'
import classNames from '../../helpers/classNames'
import PngCheck from '../../public/images/check.png'

interface ISectionHeaderProps {
  sectionNo: number,
  sectionTitle: string,
  processing: boolean,
  active: boolean,
  completed: boolean
}

const SectionHeader: React.FC<ISectionHeaderProps> = ({
  sectionNo,
  sectionTitle,
  processing,
  active,
  completed
}) => {
  return (
    <div className={classNames('section-header', active ? 'active' : '')}>
      <p className="section-no">{sectionNo}</p>
      <p className="section-title">{sectionTitle}</p>
      {completed && (
        <Image src={PngCheck} alt="completed" width={18} height={18}/>
      )}
      {!completed && active && processing && (
        <SpinLoader />
      )}
    </div>
  )
}

export default SectionHeader
