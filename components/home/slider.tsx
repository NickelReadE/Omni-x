import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton } from './carouselButtons'

const slides = [
  { image: '/images/home/slide_1.png' },
  { image: '/images/home/slide_1.png' },
  { image: '/images/home/slide_1.png' },
]

export default function HomeSlider() {
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
            {slides.map((item, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__inner flex justify-center relative">
                  <img
                    className="embla__slide__img"
                    src={item.image}
                    alt={'banner - ' + index}
                  />
                  <div className='absolute bottom-4'>
                    <button className='px-[16px] py-[4px] bg-border-gradient rounded-full flex items-center justify-center border-[1px] border-solid border-transparent' style={{backgroundOrigin: 'padding-box, border-box', backgroundClip: 'padding-box, border-box'}}>
                      <span className='bg-primary-gradient bg-clip-text text-transparent'>learn more</span>
                    </button>
                  </div>
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