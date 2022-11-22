import { useRef, useEffect } from 'react'

type Fn = (args?: unknown) => void

export const useMount = (fn: Fn) => {
  useEffect(() => {
    fn?.()
  }, [])
}
export const useMount2 = (fn: Fn) => {
  const ref = useRef(fn)
  useEffect(() => {
    fn?.()
  }, [ref.current])
}

export const useSingleton = (fn: Fn) => {
  const ref = useRef<boolean>(false)
  if (ref?.current) return
  fn?.()
  ref.current = true
}
