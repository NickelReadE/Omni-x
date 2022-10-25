/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, ReactNode, useCallback} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type {NextPage} from 'next'
import CollectionCard from '../../components/CollectionCard'
import useData from '../../hooks/useData'
import Image from 'next/image'
import Loading from '../../public/images/loading_f.gif'
import Link from 'next/link'

const Collections: NextPage = () => {
  const [omniSlides, setOmniSlides] = useState<Array<ReactNode>>([])
  const [currentSlides, setCurrentSlides] = useState<any>([])
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  // const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  // const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel()
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

  useEffect(() => {
    const new_slides:Array<ReactNode> = []
    new_slides.push(<Link href={'/collections/kanpai_pandas'}><a><img src='https://i.seadn.io/gae/DCeuchHOQhwg6mEumI2BhKViz81s0CZYXUXd3tK5lL76cWwDBrNM46NDd3z_5lRrsaPGqub1AMKOi9jqvhxvuQJLc1KVXPFFtvVN6g?auto=format&w=1920' alt="banner - 4" className={'banner-slider'} /></a></Link>)
    new_slides.push(<Link href={'/collections/gregs_eth'}><a><img src='https://i.seadn.io/gcs/files/a80f86bc5cc3ab9984161ca01aa04b6c.png?auto=format&w=1920' alt="banner - 5" className={'banner-slider'} /></a></Link>)
    setCurrentSlides(new_slides)
  }, [])

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
    // setPrevBtnEnabled(embla.canScrollPrev())
    // setNextBtnEnabled(embla.canScrollNext())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])

  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
    embla
  ])

  return (
    <>
      <div className="pt-[90px]">
        <div className="flex items-center justify-center">
          <div className="embla">
            <div className="embla__viewport" ref={viewportRef}>
              <div className="embla__container">
                {
                  currentSlides.map((item: any, index: number) => {
                    return (
                      <div key={index} className="embla__slide">{item}</div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`embla__dot ${index === selectedIndex ? 'is-selected' : ''}`}
              type="button"
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
        <div className="mt-10 pl-12 pr-20 mb-20">
          <div className="relative w-full mt-20 pr-4 pt-12 ">
            <div className={'py-6 text-2xl font-bold underline mb-12 z-10 absolute top-1'}>
              Beta Collections
            </div>

            <div className="py-4 mt-5">
              <div className="w-full flex flex-wrap justify-center gap-12">
                {
                  omniSlides.length === 0 &&
                  <Image src={Loading} alt='Loading...' width='80px' height='80px'/>
                }
                {
                  omniSlides.map((item, index) => (
                    <div className='w-[340px]' key={index} >
                      {item}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Collections
