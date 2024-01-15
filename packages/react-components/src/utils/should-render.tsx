/* eslint-disable react/no-unused-prop-types */
import type { FC, ReactElement } from 'react'
import { useInitialized } from './use-initialized'

export interface ShouldRenderProps {
  active: boolean
  forceRender?: boolean
  destroyOnClose?: boolean
  children: ReactElement
}

export const useShouldRender = (active: boolean, forceRender?: boolean, destroyOnClose?: boolean) => {
  const initialized = useInitialized(active)
  if (forceRender) return true
  if (active) return true
  if (!initialized) return false
  return !destroyOnClose
}
/**
 * 控制弹窗组件是否可渲染
 * @param p
 * @returns
 */
export const ShouldRender: FC<ShouldRenderProps> = (p) => {
  const { active, forceRender, destroyOnClose } = p
  const shouldRender = useShouldRender(active, forceRender, destroyOnClose)
  return shouldRender ? p.children : null
}
