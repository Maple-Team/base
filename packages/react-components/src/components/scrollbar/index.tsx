/**
 * 滚动处理
 * reference:  @https://www.thisdot.co/blog/creating-custom-scrollbars-with-react
 * @Author: liutsing
 * @Date: 2023-03-10 Friday 15:50
 */
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react'

type Direction = 'up' | 'down'
interface DirectionButtonPros {
  children?: ReactNode
  direction: Direction
  onClick: (direction: Direction) => void
}

const DirectionButton = ({ onClick, direction, children }: DirectionButtonPros) => {
  const _onClick = useCallback(() => onClick(direction), [direction])

  return (
    <button
      className="custom-scrollbars__button"
      onClick={_onClick}
    >
      {children ?? direction === 'down' ? '⇓' : '⇑'}
    </button>
  )
}

export type ScrollbarProps = React.ComponentPropsWithoutRef<'div'> & {
  showDirectionButton?: boolean
}

export const Scrollbar = ({ children, showDirectionButton, ...props }: ScrollbarProps) => {
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
   * browser compatible
   * @param direction
   */
  const onDirectionButtonClick = useCallback((direction: Direction) => {
    const { current } = contentRef
    if (current) {
      const scrollAmount = direction === 'down' ? 200 : -200
      current.scrollBy({ top: scrollAmount, behavior: 'smooth' })
    }
  }, [])

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

  // If the content and the scrollbar track exist,
  // use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  // 如果内容和滚动条轨道存在，则使用ResizeObserver来调整滑块的高度，并侦听滚动事件以移动滑块。
  useEffect(() => {
    if (!(contentRef.current && scrollTrackRef.current)) {
      return
    }
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
  }, [])

  const handleThumbMousemove = useCallback(
    (e: MouseEvent) => {
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

  const handleThumbMousedown = useCallback((e: React.MouseEvent) => {
    setScrollStartPosition(e.clientY)
    if (contentRef.current) setInitialScrollTop(contentRef.current.scrollTop)
    setIsDragging(true)
  }, [])

  const handleThumbMouseup = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (isDragging) {
        setIsDragging(false)
      }
    },
    [isDragging]
  )
  // Listen for mouse events to handle scrolling by dragging the thumb
  // 拖动滑块时动态监听事件
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
        {showDirectionButton && (
          <DirectionButton
            direction="up"
            onClick={onDirectionButtonClick}
          />
        )}
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
        {showDirectionButton && (
          <DirectionButton
            direction="down"
            onClick={onDirectionButtonClick}
          />
        )}
      </div>
    </div>
  )
}
