import { useState } from 'react'
import { useIsomorphicLayoutEffect } from 'ahooks'

/**
 * 待组件渲染后再更新可见性状态
 * @param outerVisible
 * @returns
 */
export function useInnerVisible(outerVisible: boolean) {
  const [innerVisible, setInnerVisible] = useState(outerVisible)
  useIsomorphicLayoutEffect(() => {
    setInnerVisible(outerVisible)
  }, [outerVisible])
  return innerVisible
}
