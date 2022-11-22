import { useRef, useEffect } from 'react'

type Fn = (args?: unknown) => void

export const useMount = (fn: Fn) => {
  useEffect(() => {
    fn?.()
  }, [])
}

export const useSingleton = (fn: Fn) => {
  const ref = useRef<boolean>(false)
  if (ref?.current) return
  fn?.()
  ref.current = true
}
