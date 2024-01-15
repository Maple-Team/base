import type { ReactElement } from 'react'
import * as ReactDOM from 'react-dom'
import type { Root } from 'react-dom/client'
import { PREFIX_CLS } from '@/constant'

// 移植自rc-util: https://github.com/react-component/util/blob/master/src/React/render.ts

type CreateRoot = (container: ContainerType) => Root

// Let compiler not to search module usage 同时保证当前浏览器环境下只有一个reactDOM实例
const fullClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean
  }
  createRoot?: CreateRoot
}
/**
 * reactDOM暴露的几个方法
 */
const { version, render: reactRender, unmountComponentAtNode } = fullClone
// react18的创建根节点的方法
let createRoot: CreateRoot
try {
  const mainVersion = Number((version || '').split('.')[0])
  if (mainVersion >= 18 && fullClone.createRoot) createRoot = fullClone.createRoot
} catch (e) {
  // Do nothing;
}
/**
 * 打开或关闭warning
 * @param skip
 */
function toggleWarning(skip: boolean) {
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = fullClone

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  )
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip
}

const MARK = `__${PREFIX_CLS}_root__`

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}
/**
 * 老版本遗留的渲染
 * 使用遗留的reactRender方法
 * @param node
 * @param container
 */
function legacyRender(node: ReactElement, container: ContainerType) {
  reactRender(node, container)
}
/**
 * concurrent模式渲染
 * 使用react18的createRoot方法，同时并缓存根节点
 * @param node
 * @param container
 */
function concurrentRender(node: ReactElement, container: ContainerType) {
  toggleWarning(true)
  const root = container[MARK] || createRoot(container)
  toggleWarning(false)
  root.render(node)
  container[MARK] = root
}
/**
 * 暴露出统一的render方法
 * @param node 要render的react组件
 * @param container 挂载的dom容器
 * @returns
 */
export function render(node: ReactElement, container: ContainerType) {
  // 根据当前环境下的变量判断
  if (createRoot as unknown) {
    concurrentRender(node, container)
    return
  }
  legacyRender(node, container)
}

// ========================== Unmount =========================
/**
 * 从DOM容器上卸载组件-遗留的方式
 * @param container DOM容器
 * @returns
 */
function legacyUnmount(container: ContainerType) {
  return unmountComponentAtNode(container)
}

/**
 * 从DOM容器上卸载组件-concurrent模式
 * @param container DOM容器
 * @returns
 */
async function concurrentUnmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()
    delete container[MARK]
  })
}
/**
 * 暴露出统一的unmount方法
 * @param container DOM容器
 * @returns
 */
export function unmount(container: ContainerType) {
  if (createRoot as unknown) return concurrentUnmount(container)

  return legacyUnmount(container)
}
