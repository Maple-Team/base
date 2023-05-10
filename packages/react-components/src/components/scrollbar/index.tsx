/**
 * 滚动处理
 * reference:  @https://www.thisdot.co/blog/creating-custom-scrollbars-with-react
 * @Author: liutsing
 * @Date: 2023-03-10 Friday 15:50
 */
import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './style.module.less'

const prefix = 'custom-scrollbars'

type Direction = 'up' | 'down'
interface DirectionButtonPros {
  children?: ReactNode
  direction: Direction
  onClick?: (direction: Direction) => void
}

const DirectionButton = ({ onClick, direction, children }: DirectionButtonPros) => {
  const innerClick = useCallback(() => onClick?.(direction), [direction, onClick])

  return (
    <button className="custom-scrollbars__button" onClick={innerClick}>
      {children ?? direction === 'down' ? '⇓' : '⇑'}
    </button>
  )
}

export type ScrollbarProps = React.ComponentPropsWithoutRef<'div'> & {
  showDirectionButton?: boolean
  containerHeight: number
}

export const Scrollbar = ({ children, className, containerHeight, showDirectionButton, ...props }: ScrollbarProps) => {
  // content ele
  const contentRef = useRef<HTMLDivElement>(null)
  // track ele
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  // thumb ele
  const scrollThumbRef = useRef<HTMLDivElement>(null)
  // listener resize event
  const observer = useRef<ResizeObserver | null>(null)
  // need to calculate to update
  const [thumbHeight, setThumbHeight] = useState<number>(0)
  const [thumbTop, setThumbTop] = useState(0)
  // status draging or not
  const [isDragging, setIsDragging] = useState(false)

  /**
   * 滑块快捷键按下
   * TODO
   * browser compatible
   * @param direction
   */
  const onDirectionButtonClick = useCallback((direction: Direction) => {
    if (!contentRef.current) return
    const scrollAmount = direction === 'down' ? 200 : -200
    contentRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' })
  }, [])

  // If the content and the scrollbar track exist,
  // use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
  // 如果内容和滚动条轨道存在，则使用ResizeObserver来调整滑块的高度，并侦听滚动事件以移动滑块。
  useEffect(() => {
    /**
     * update thumb height
     * @param ref 容器元素
     * @param trackHeight 轨道高度
     */
    function handleResize(ref: HTMLDivElement, trackHeight: number) {
      const { clientHeight, scrollHeight } = ref
      // at least 20, calculate the ratio of clientHeight / scrollHeight
      setThumbHeight(Math.max((clientHeight / scrollHeight) * trackHeight, 20))
    }
    /**
     * 监听内容区域滚动  -> 触发滑块滚动到目的区域
     */
    function _onContentScrollChange() {
      if (!contentRef.current || !scrollTrackRef.current || !scrollThumbRef.current) return
      const { scrollTop: contentTop, scrollHeight: contentHeight } = contentRef.current
      const { clientHeight: trackHeight } = scrollTrackRef.current

      let top = (contentTop / contentHeight) * trackHeight
      top = Math.min(top, trackHeight - thumbHeight)
      console.log(top, 'change')
      setThumbTop(top)
    }
    if (!(contentRef.current && scrollTrackRef.current)) return

    const contentEle = contentRef.current
    const { clientHeight: trackHeight } = scrollTrackRef.current
    observer.current = new ResizeObserver(() => {
      handleResize(contentEle, trackHeight)
    })
    observer.current.observe(contentEle)
    // contentEle.addEventListener('scroll', onContentScrollChange)
    return () => {
      observer.current?.unobserve(contentEle)
      // contentEle.removeEventListener('scroll', onContentScrollChange)
    }
  }, [thumbHeight])

  const onPercentChange = useCallback(
    (clientY: number) => {
      if (!scrollTrackRef.current) return 0

      const clientHeight = scrollTrackRef.current.clientHeight
      const top = scrollTrackRef.current.getBoundingClientRect().top

      const percent = (clientY - top) / (clientHeight - thumbHeight)

      const p = Math.max(percent, 0)
      return Math.min(p, 1)
    },
    [thumbHeight]
  )
  /**
   * 鼠标移动
   */
  const onMousemove = useCallback(
    (e: globalThis.MouseEvent) => {
      const { current: trackEl } = scrollTrackRef
      if (!contentRef.current || !trackEl) return
      const percent = onPercentChange(e.clientY)
      const scrollAmount = Math.floor(percent * contentRef.current.scrollHeight)
      contentRef.current.scrollTo({
        top: scrollAmount,
        // behavior: 'smooth', // smooth触发多次滚动事件
      })
      const trackTop = trackEl.getBoundingClientRect().top
      // 处理滑块位置，滑块中间位置滑动到点击位置, [0, 轨道高度 - 滑块高度]
      let top = Math.min(e.clientY - trackTop - thumbHeight / 2, trackEl.clientHeight - thumbHeight)
      top = Math.max(top, 0)

      console.log({ scrollAmount, top })
      setThumbTop(top)
    },
    [onPercentChange, thumbHeight]
  )
  /**
   * 鼠标抬起
   */
  const onMouseup = useCallback(
    (e: globalThis.MouseEvent) => {
      setIsDragging(false)
      const { current: trackEl } = scrollTrackRef
      if (!contentRef.current || !trackEl) return
      console.log('onMouseup')
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
      const percent = onPercentChange(e.clientY)
      const scrollAmount = Math.floor(percent * contentRef.current.scrollHeight)
      contentRef.current.scrollTo({
        top: scrollAmount,
        // behavior: 'smooth', // smooth触发多次滚动事件
      })
      const trackTop = trackEl.getBoundingClientRect().top
      // 处理滑块位置，滑块中间位置滑动到点击位置, [0, 轨道高度 - 滑块高度]
      let top = Math.min(e.clientY - trackTop - thumbHeight / 2, trackEl.clientHeight - thumbHeight)
      top = Math.max(top, 0)

      console.log({ scrollAmount, top })
      setThumbTop(top)
    },
    [onMousemove, onPercentChange, thumbHeight]
  )

  useEffect(() => {
    const handler = () => {
      setIsDragging(true)
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)
    }
    const trackEl = scrollTrackRef.current
    trackEl?.addEventListener('mousedown', handler)

    return () => {
      trackEl?.removeEventListener('mousedown', handler)
    }
  }, [onMousemove, onMouseup])

  /**
   * 轨道点击事件
   * -> 内容移动到对应比例的区域
   * -> 滑块移动到鼠标位置
   */
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      console.log('handleTrackClick', e)
      const { current: trackEl } = scrollTrackRef
      const { current: contentEl } = contentRef
      const { current: thumbEl } = scrollThumbRef
      if (!(trackEl && contentEl && thumbEl)) return

      const trackTop = trackEl.getBoundingClientRect().top

      const percent = onPercentChange(e.clientY)
      console.log(percent, 'percent')
      const scrollAmount = Math.floor(percent * contentEl.scrollHeight)
      contentEl.scrollTo({
        top: scrollAmount,
        // behavior: 'smooth', // smooth触发多次滚动事件
      })

      // 处理滑块位置，滑块中间位置滑动到点击位置, [0, 轨道高度 - 滑块高度]
      let top = Math.min(e.clientY - trackTop - thumbHeight / 2, trackEl.clientHeight - thumbHeight)
      top = Math.max(top, 0)

      console.log({ scrollAmount, top })
      setThumbTop(top)
    },
    [onPercentChange, thumbHeight]
  )
  /**
   * 滑块可见性
   */
  const thumbVisible = useMemo(() => {
    if (!scrollTrackRef.current) return false
    return thumbHeight < scrollTrackRef.current.clientHeight
  }, [thumbHeight])

  console.log(thumbTop, 'thumbTop')
  return (
    <div className={`${styles[`${prefix}__container`]} ${className ?? ''}`} style={{ height: containerHeight }}>
      <div className={styles[`${prefix}__content`]} ref={contentRef} {...props}>
        {children}
      </div>
      <div className={styles[`${prefix}__scrollbar`]}>
        {showDirectionButton && <DirectionButton direction="up" onClick={onDirectionButtonClick} />}
        <div
          className={`${styles[`${prefix}__track-and-thumb`]}
          ${!thumbVisible ? 'opacity-0' : ''}`}
        >
          <div
            className={styles[`${prefix}__track`]}
            ref={scrollTrackRef}
            onClick={handleTrackClick}
            style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
          />
          <div
            className={styles[`${prefix}__thumb`]}
            ref={scrollThumbRef}
            style={{
              height: `${thumbHeight}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
              left: isDragging ? 0 : '50%',
              transform: isDragging ? `translate(0, ${thumbTop}px)` : `translate(-50%, ${thumbTop}px)`,
            }}
          />
        </div>
        {showDirectionButton && <DirectionButton direction="down" onClick={onDirectionButtonClick} />}
      </div>
    </div>
  )
}
