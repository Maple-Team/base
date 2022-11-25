import { throttle } from '../helper'
import { useEffect } from 'react'

export const useScroll = (fn: Fn, container?: HTMLElement) => {
  const _container = container || window
  useEffect(() => {
    _container.addEventListener(
      'scroll',
      throttle((e) => {
        fn?.(e)
      })
    )
    return () => {
      _container.removeEventListener('scroll', () => {
        fn?.()
      })
    }
  }, [])
}
