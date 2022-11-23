import { useEffect } from 'react'

/**
 *
 * @param fn
 */
export const useUnmount = (fn: Fn) => {
  useEffect(() => () => fn?.(), [])
}
