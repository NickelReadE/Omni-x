/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, ReactNode, useCallback} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type {NextPage} from 'next'
import CollectionCard from '../../components/home/CollectionCard'
import useData from '../../hooks/useData'
import Image from 'next/image'
import Loading from '../../public/images/loading_f.gif'
import Link from 'next/link'

const Collections: NextPage = () => {
  const [omniSlides, setOmniSlides] = useState<Array<ReactNode>>([])
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel()
  const { collections } = useData()

  useEffect(() => {
    const slides: Array<ReactNode> = []
    if (collections.length > 0) {
      collections.map((item: any) => {
        slides.push(
          <CollectionCard collection={item} />
        )
      })
    }
    setOmniSlides(slides)
  }, [collections])

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on('select', onSelect)
    embla.reInit()
    setScrollSnaps(embla.scrollSnapList())
    if (collections.length > 0) {
      setTimeout(() => {
        embla.reInit()
        setScrollSnaps(embla.scrollSnapList())
      }, 1000)
    }
  }, [embla, setScrollSnaps, onSelect, collections])

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
                  collections.map((item, index: number) => {
                    return (
                      <div className="embla__slide" key={index}>
                        <div className="embla__slide__inner">
                          <Link href={`/collections/${item.col_url}`}>
                            <a>
                              <img
                                src={item.banner_image}
                                alt="banner - 4"
                                className={'rounded-[10px]'}
                              />
                            </a>
                          </Link>
                        </div>
                      </div>
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
