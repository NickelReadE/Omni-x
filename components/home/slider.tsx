import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton } from './carouselButtons'
import HomeIntro from './intro'
import useData from '../../hooks/useData'

export default function HomeSlider() {
  const { collections } = useData()
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
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
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])
    
  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            <div className="embla__slide flex justify-center">
              <div className="embla__slide__inner flex justify-center relative">
                <HomeIntro />
              </div>
            </div>
            {collections.map((collection, index) => (
              <div className="embla__slide flex justify-center" key={index}>
                <div className="embla__slide__inner aspect-[3/1] flex justify-center relative">
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