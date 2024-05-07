import { useEffect, useRef } from 'react'

const useLatest = (fn: (...args: unknown[]) => void) => {
  const ref = useRef(fn)
  // method 1
  // NOTE ref.current = fn 处理回调函数中的闭包问题
  // method 2
  useEffect(() => {
    ref.current = fn
  }, [fn])

  return ref
}

export const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      // fnRef依赖值变更触发清除函数
      // 钩子hooks销毁
      console.log('useUnmount clear')
      fnRef.current()
    },
    [fnRef]
  )
}
