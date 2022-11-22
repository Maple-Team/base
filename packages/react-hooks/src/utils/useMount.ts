import { useRef } from 'react'

type Fn = (args?: unknown) => void

export const useMount = (fn: Fn) => {
  // const ref = useRef<Fn>(fn)
  // useEffect(() => {
  //   fn()
  // }, [ref.current])
  const ref = useRef<boolean>(false)
  if (ref.current) return
  fn()
  ref.current = true
}

export const useSingleton = (fn: Fn) => {
  const ref = useRef<boolean>(false)
  if (ref?.current) return
  fn()
  ref.current = true
}
