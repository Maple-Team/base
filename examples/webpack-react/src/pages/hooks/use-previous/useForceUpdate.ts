import { useCallback, useState } from 'react'

function useForceUpdate() {
  const [, setState] = useState(false)
  const forceUpdate = useCallback(() => {
    setState((state) => !state)
  }, [])
  return forceUpdate
}

export default useForceUpdate
