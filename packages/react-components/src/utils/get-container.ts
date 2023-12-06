export type GetContainer = () => HTMLElement

/**
 * popup组件的挂载节点
 * 根据传入的条件获取容器，默认容器是document.body
 * @param getContainer
 * @returns
 */
export function resolveContainer(getContainer: HTMLElement | GetContainer | null | undefined) {
  const container = typeof getContainer === 'function' ? getContainer() : getContainer
  return container || document.body
}
