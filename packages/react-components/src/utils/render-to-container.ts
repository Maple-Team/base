import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { resolveContainer } from './get-container'
import { canUseDom } from './can-use-dom'

export type GetContainer = HTMLElement | (() => HTMLElement) | null

/**
 * react元素是否需要挂载到容器上
 * 在react组件内部使用
 * @param getContainer
 * @param node
 * @returns
 */
export function renderToContainer(getContainer: GetContainer, node: ReactElement) {
  if (getContainer && canUseDom) {
    const container = resolveContainer(getContainer)
    /** 在React中，createPortal的作用是将子组件渲染到父组件DOM树之外的另一个DOM节点上。
     * 这个方法通常用于创建一些需要脱离正常的DOM层级结构的UI组件，比如模态框、弹出式菜单等。
     * 通过createPortal，我们可以将这些UI组件渲染到DOM树的其他位置，而不会受到父组件的层级结构限制。
     * 这样可以更灵活地控制UI组件的位置和层级关系。 */
    return createPortal(node, container)
  }
  return node
}
