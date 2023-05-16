import { useEffect } from 'react'
import { useLatest } from './useLatest'

/**
 *
 * @param fn
 */
export const useUnmount = (fn: Fn | undefined = undefined) => {
  // update the ref each render so if it change the newest callback will be invoked
  // 确保在组件卸载时调用的回调函数是最新的
  const fnRef = useLatest(fn)

  useEffect(
    () => () => {
      const res = fnRef.current?.()
      /* istanbul ignore next */
      if (res instanceof Promise) res.catch(console.error)
    },
    [fnRef]
  )

  // 对比的例子：
  // 这里调用的是组件挂载时传入的回调函数，而不是后面重新渲染时的新回调函数
  // 组件重新渲染时，依赖项数组为空，清除函数不会重新创建
  // useEffect(() => {
  //   return () => {
  //     fn?.();
  //   };
  // }, []);
}
