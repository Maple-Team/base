import { useEffect, useRef } from 'react'

/**
 * 获取最新的值，解决闭包引用问题
 * @param arg
 * @returns
 */
export const useLatest = <T>(arg: T) => {
  const ref = useRef<T>(arg)
  ref.current = arg
  // useEffect(() => {
  //   ref.current = arg
  // }, [arg])

  return ref
}
