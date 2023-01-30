import Image from 'next/image'
import React from 'react'
import LoadingImage from '../../public/images/loading_f.gif'

const Loading = () => {
  return (
    <div>
      <Image src={LoadingImage} alt="Loading..." width="80px" height="80px"/>
    </div>
  )
}

export default Loading
