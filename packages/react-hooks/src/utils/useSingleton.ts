import { useRef } from 'react'

/**
 * 以在函数体内直接执行
 * @param fn
 * @returns
 */
export const useSingleton = (fn: Fn) => {
  const ref = useRef<boolean>(false)
  if (ref?.current) return
  fn?.()
  ref.current = true
}
