import { useRef } from 'react'

/**
 * 获取初始化时的值
 * @param check
 * @returns
 */
export function useInitialized(check?: boolean) {
  const initializedRef = useRef(check)
  if (check) initializedRef.current = true

  return !!initializedRef.current
}
