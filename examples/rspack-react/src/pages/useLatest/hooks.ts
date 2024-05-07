import { useEffect, useRef } from 'react'

const useLatest = (fn: (...args: unknown[]) => void) => {
  const ref = useRef(fn)
  // ref.current = fn
  return ref
}

export const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn)
  console.log('useUnmount')
  useEffect(
    () => () => {
      console.log('useUnmount clear')
      fnRef.current()
    },
    [fnRef]
  )
}
