import React from 'react'
import Link from 'next/link'
import { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

import { IPropsSlider } from '../interface/interface'
import { Divider } from '@material-ui/core'

const Slider = (props: IPropsSlider) => {
  return (
    <>
      <div className="mt-10 pl-12 pr-20 mb-20">
        <div className="relative w-full mt-20 pr-4 pt-12 ">
          <div
            className={`py-6 text-2xl font-bold underline mb-12 z-10 absolute top-1 ${
              props.title === '' ? 'mt-10' : ''
            }`}
          >
            {props.title}
          </div>
          
          <div className="py-4 mt-5">           
            <div className="w-full grid grid-cols-4 gap-12">
              {props.cards.map((item, index) => (
                <div key={index} >
                  {item}
                </div>
              ))}
            </div>  
                       
          </div>
        </div>
      </div>
    </>
  )
}

export default Slider
