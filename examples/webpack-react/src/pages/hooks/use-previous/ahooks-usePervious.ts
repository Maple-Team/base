import { useEffect, useRef } from 'react'

export type compareFunction<T> = (prev: T | undefined, next: T) => boolean

function usePrevious<T>(state: T, compare?: compareFunction<T>): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    const needUpdate = typeof compare === 'function' ? compare(ref.current, state) : true
    console.log('needUpdate', needUpdate)
    if (needUpdate) ref.current = state
  })

  return ref.current
}

export default usePrevious
