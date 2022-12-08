import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { DotButton } from './carouselButtons'
import HomeIntro from './intro'
import useData from '../../hooks/useData'

export default function HomeSlider() {
  const { collections } = useData()
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false, loop: true }, [Autoplay({ delay: 4000, playOnInit: true })])
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla, setSelectedIndex])

  const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [
    embla
  ])

  useEffect(() => {
    if (!embla) return
    if (collections.length > 0) {
      onSelect()
      embla.reInit({ skipSnaps: false, loop: true }, [Autoplay({ delay: 4000, playOnInit: true })])
      setScrollSnaps(embla.scrollSnapList())
      embla.on('select', onSelect)
    }
  }, [embla, setScrollSnaps, onSelect, collections])

  return (
    <>
      <div className="py-5 relative">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            <div className="embla__slide flex justify-center">
              <div className="embla__slide__inner rounded-[20px] flex justify-center relative">
                <HomeIntro />
              </div>
            </div>
            {collections.map((collection, index) => (
              <div className="embla__slide flex justify-center" key={index}>
                <div className="embla__slide__inner rounded-[20px] aspect-[3/1] flex justify-center relative">
                  <img
                    className="embla__slide__img"
                    src={collection.banner_image}
                    alt={'banner - ' + index}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </>
  )
}
