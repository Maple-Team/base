import { useEffect } from 'react'
type Fn = (e?: Event) => void

export const useScroll = (fn: Fn, container?: HTMLElement) => {
  const _container = container || window
  useEffect(() => {
    _container.addEventListener('scroll', (e) => {
      fn?.(e)
    })
    return () => {
      _container.removeEventListener('scroll', () => {
        fn?.()
      })
    }
  }, [])
}
