'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRef, useState } from 'react'

import { parsePostImageUrls } from '@/lib/post-images'

type PostImageSliderProps = {
  alt: string
  imageUrl?: string
}

export default function PostImageSlider ({ alt, imageUrl }: PostImageSliderProps) {
  const urls = parsePostImageUrls(imageUrl)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  })
  const [activeIndex, setActiveIndex] = useState(0)

  if (urls.length === 0) return null

  function updateActiveIndex () {
    const element = scrollRef.current
    if (element == null || urls.length === 0) return

    const nextIndex = Math.round(element.scrollLeft / element.clientWidth)
    setActiveIndex(Math.min(urls.length - 1, Math.max(0, nextIndex)))
  }

  function scrollToIndex (index: number) {
    const element = scrollRef.current
    if (element == null) return

    element.scrollTo({
      left: element.clientWidth * index,
      behavior: 'smooth',
    })
  }

  function handlePointerDown (event: React.PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current
    if (element == null) return

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    }
    element.setPointerCapture(event.pointerId)
  }

  function handlePointerMove (event: React.PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current
    if (element == null || !dragState.current.isDragging) return

    element.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.startX)
  }

  function handlePointerEnd (event: React.PointerEvent<HTMLDivElement>) {
    const element = scrollRef.current
    if (element == null) return

    dragState.current.isDragging = false
    element.releasePointerCapture(event.pointerId)
    updateActiveIndex()
  }

  return (
    <div className='relative z-20 mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-100'>
      <div
        ref={scrollRef}
        className='flex aspect-[16/9] snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onScroll={updateActiveIndex}
      >
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className='h-full w-full shrink-0 snap-center'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={urls.length === 1 ? alt : `${alt} ${index + 1}`}
              className='h-full w-full select-none object-cover'
              draggable={false}
              loading='lazy'
            />
          </div>
        ))}
      </div>

      {urls.length > 1
        ? (
          <>
            <button
              type='button'
              aria-label='이전 이미지'
              className='absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white md:inline-flex'
              onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            >
              <ChevronLeftIcon className='h-5 w-5' />
            </button>
            <button
              type='button'
              aria-label='다음 이미지'
              className='absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white md:inline-flex'
              onClick={() => scrollToIndex(Math.min(urls.length - 1, activeIndex + 1))}
            >
              <ChevronRightIcon className='h-5 w-5' />
            </button>
            <div className='absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1'>
              {urls.map((url, index) => (
                <button
                  key={`${url}-dot-${index}`}
                  type='button'
                  aria-label={`${index + 1}번 이미지로 이동`}
                  className={`h-1.5 rounded-full transition-all ${activeIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
          </>
          )
        : null}
    </div>
  )
}
