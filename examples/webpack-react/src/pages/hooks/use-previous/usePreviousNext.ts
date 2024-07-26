import { useEffect, useRef } from 'react'

function usePrevious<T>(state: T, deps: React.DependencyList): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref.current
}

export default usePrevious
