/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, ReactNode} from 'react'
import type {NextPage} from 'next'
import Slider from '../../components/Slider'
import CollectionCard from '../../components/CollectionCard'
import useData from '../../hooks/useData'

const Collections: NextPage = () => {
  const [omniSlides, setOmniSlides] = useState<Array<ReactNode>>([])
  const { collections } = useData()

  useEffect(() => {
    const slides: Array<ReactNode> = []
    if (collections.length > 0) {
      collections.map((item: any) => {
        slides.push(
          <CollectionCard collection={item} card={null}/>
        )
      })
    }
    setOmniSlides(slides)
  }, [collections])

  return (
    <>
      <div className="pt-10">
        <Slider title="Beta Collections" cards={omniSlides}/>
      </div>
    </>
  )
}

export default Collections
