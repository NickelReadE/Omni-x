import React, { useState, Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import LazyLoad from 'react-lazyload'

import { getCollections, selectCollections } from '../../redux/reducers/collectionsReducer'

import pfp from '../../public/images/pfp.png'
import photography from '../../public/images/photography.png'
import gaming from '../../public/images/gaming.png'
import metaverse from '../../public/images/metaverse.png'
import sports from '../../public/images/sports.png'
import generative from '../../public/images/generative.png'
import utility from '../../public/images/utility.png'
import domains from '../../public/images/domains.png'
import fashion from '../../public/images/fashion.png'


import ImageList from '../../components/ImageList'
import Slider from '../../components/Slider'
import CollectionCard from '../../components/CollectionCard'


const serviceSlides: Array<React.ReactNode> = []
serviceSlides.push(<Image src={pfp} alt="image - 25" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={photography} alt="image - 26" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={metaverse} alt="image - 27" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={gaming} alt="image - 28" layout='responsive' width={230} height={263}/>)
serviceSlides.push(<Image src={sports} alt="image - 29" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={generative} alt="image - 26" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={utility} alt="image - 27" layout='responsive' width={230} height={263} />)
serviceSlides.push(<Image src={domains} alt="image - 28" layout='responsive' width={230} height={263}/>)
serviceSlides.push(<Image src={fashion} alt="image - 29" layout='responsive' width={230} height={263} />)

const Collections: NextPage = () => {
  const [omniSlides, setOmniSlides] = useState<Array<React.ReactNode>>([])
  const [imageError, setImageError] = useState(false)

  const dispatch = useDispatch()
  const collections = useSelector(selectCollections)

  useEffect(() => {
    dispatch(getCollections() as any)
  }, [])

  useEffect(() => {
    const slides: Array<React.ReactNode> = []

    collections && collections.map((item: any) => {
      slides.push(
                   
        <CollectionCard collection={item}/>
         
      )
    })
    setOmniSlides(slides)
  }, [collections])
  return (
    <>
      <div className='pt-10'>
        <Slider title="Beta Collections" cards={omniSlides} />
        {/* <Slider title="Trending Collection" images={omniSlides} /> */}
        {/* <ImageList title="" images={serviceSlides} /> */}
        
      </div>
    </>
  )
}

export default Collections
