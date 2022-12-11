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
        <div className="embla__viewport overflow-hidden w-full" ref={viewportRef}>
          <div className="flex select-none ml-[-10px]">
            <div className="relative min-w-[100%] flex justify-center">
              <div className="w-full relative overflow-hidden max-h-[333.33px] rounded-[20px] flex justify-center relative">
                <HomeIntro />
              </div>
            </div>
            {collections.map((collection, index) => (
              <div className="relative min-w-[100%] flex justify-center" key={index}>
                <div className="w-full relative overflow-hidden max-h-[333.33px] rounded-[20px] aspect-[3/1] flex justify-center relative">
                  <img
                    className="transform-center absolute block top-[50%] left-[50%] w-auto"
                    src={collection.banner_image}
                    alt={'banner - ' + index}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center list-none pt-[10px]">
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
