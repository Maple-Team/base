import React, { useState, useEffect, useRef, useCallback } from 'react'

const Scrollbar = ({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  const contentRef = useRef<HTMLDivElement>(null)
  // track轨道
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  // thumb button
  const scrollThumbRef = useRef<HTMLDivElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  // need to calculate to update
  const [thumbHeight, setThumbHeight] = useState(20)
  // need to calculate to update
  const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(null)
  const [initialScrollTop, setInitialScrollTop] = useState<number>(0)
  // status draging or not
  const [isDragging, setIsDragging] = useState(false)

  /**
   * update thumb height
   * @param ref
   * @param trackSize
   */
  function handleResize(ref: HTMLDivElement, trackSize: number) {
    const { clientHeight, scrollHeight } = ref
    // at least 20, calculate the ratio of clientHeight / scrollHeight
    setThumbHeight(Math.max((clientHeight / scrollHeight) * trackSize, 20))
  }

  /**
   * browser compatiable
   * @param direction
   */
  function handleScrollButton(direction: 'up' | 'down') {
    const { current } = contentRef
    if (current) {
      const scrollAmount = direction === 'down' ? 200 : -200
      current.scrollBy({ top: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const { current: trackCurrent } = scrollTrackRef
      const { current: contentCurrent } = contentRef
      if (trackCurrent && contentCurrent) {
        const { clientY } = e
        const target = e.target as HTMLDivElement
        const rect = target.getBoundingClientRect()
        const trackTop = rect.top
        const thumbOffset = -(thumbHeight / 2)
        const clickRatio = (clientY - trackTop + thumbOffset) / trackCurrent.clientHeight
        const scrollAmount = Math.floor(clickRatio * contentCurrent.scrollHeight)
        contentCurrent.scrollTo({
          top: scrollAmount,
          behavior: 'smooth',
        })
      }
    },
    [thumbHeight]
  )

  const handleThumbPosition = useCallback(() => {
    if (!contentRef.current || !scrollTrackRef.current || !scrollThumbRef.current) {
      return
    }
    const { scrollTop: contentTop, scrollHeight: contentHeight } = contentRef.current
    const { clientHeight: trackHeight } = scrollTrackRef.current
    let newTop = (+contentTop / +contentHeight) * trackHeight
    newTop = Math.min(newTop, trackHeight - thumbHeight)
    const thumb = scrollThumbRef.current
    thumb.style.top = `${newTop}px`
  }, [])

  const handleThumbMousedown = useCallback(
    (e: { preventDefault: () => void; stopPropagation: () => void; clientY: React.SetStateAction<number | null> }) => {
      e.preventDefault()
      e.stopPropagation()
      setScrollStartPosition(e.clientY)
      if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop)
      setIsDragging(true)
    },
    []
  )

  const handleThumbMouseup = useCallback(
    (e: { preventDefault: () => void; stopPropagation: () => void }) => {
      e.preventDefault()
      e.stopPropagation()
      if (isDragging) {
        setIsDragging(false)
      }
    },
    [isDragging]
  )

  const handleThumbMousemove = useCallback(
    (e: { preventDefault: () => void; stopPropagation: () => void; clientY: number }) => {
      e.preventDefault()
      e.stopPropagation()
      if (isDragging) {
        if (contentRef.current) {
          const { scrollHeight: contentScrollHeight, offsetHeight: contentOffsetHeight } = contentRef.current

          const deltaY = (e.clientY - (scrollStartPosition || 0)) * (contentOffsetHeight / thumbHeight)
          const newScrollTop = Math.min(initialScrollTop + deltaY, contentScrollHeight - contentOffsetHeight)
          contentRef.current.scrollTop = newScrollTop
        }
      }
    },
    [isDragging, scrollStartPosition, thumbHeight]
  )

  // If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  useEffect(() => {
    if (contentRef.current && scrollTrackRef.current) {
      const ref = contentRef.current
      const { clientHeight: trackSize } = scrollTrackRef.current
      observer.current = new ResizeObserver(() => {
        handleResize(ref, trackSize)
      })
      observer.current.observe(ref)
      ref.addEventListener('scroll', handleThumbPosition)
      return () => {
        observer.current?.unobserve(ref)
        ref.removeEventListener('scroll', handleThumbPosition)
      }
    }
  }, [])

  // Listen for mouse events to handle scrolling by dragging the thumb
  useEffect(() => {
    document.addEventListener('mousemove', handleThumbMousemove)
    document.addEventListener('mouseup', handleThumbMouseup)
    document.addEventListener('mouseleave', handleThumbMouseup)
    return () => {
      document.removeEventListener('mousemove', handleThumbMousemove)
      document.removeEventListener('mouseup', handleThumbMouseup)
      document.removeEventListener('mouseleave', handleThumbMouseup)
    }
  }, [handleThumbMousemove, handleThumbMouseup])

  return (
    <div className="custom-scrollbars__container">
      <div
        className="custom-scrollbars__content"
        ref={contentRef}
        {...props}
      >
        {children}
      </div>
      <div className="custom-scrollbars__scrollbar">
        <button
          className="custom-scrollbars__button"
          onClick={() => handleScrollButton('up')}
        >
          ⇑
        </button>
        <div className="custom-scrollbars__track-and-thumb">
          <div
            className="custom-scrollbars__track"
            ref={scrollTrackRef}
            onClick={handleTrackClick}
            style={{ cursor: isDragging ? 'grabbing' : 'default' }}
          />
          <div
            className="custom-scrollbars__thumb"
            ref={scrollThumbRef}
            onMouseDown={handleThumbMousedown}
            style={{
              height: `${thumbHeight}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          />
        </div>
        <button
          className="custom-scrollbars__button"
          onClick={() => handleScrollButton('down')}
        >
          ⇓
        </button>
      </div>
    </div>
  )
}

export default Scrollbar
