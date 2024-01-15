import type { ReactElement } from 'react'
import { unmount as reactUnmount, render } from './render'

/**
 * 额外的动态挂载一个react element到dom树上
 * @param el
 * @returns 移除dom上的元素节点的函数
 */
export const renderToBody = (el: ReactElement) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  function unmount() {
    const unmountResult = reactUnmount(container)
    if (unmountResult && container.parentNode) container.parentNode?.removeChild(container)
  }
  render(el, container)
  return unmount
}
