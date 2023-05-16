import { useEffect, useRef } from 'react'

export const useLatest = <T>(arg: T) => {
  const ref = useRef<T>(arg)

  useEffect(() => {
    ref.current = arg
  }, [arg])

  return ref
}
