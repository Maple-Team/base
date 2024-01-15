/* eslint-disable react/no-unused-prop-types */
import type { CSSProperties, FC, ReactNode } from 'react'
import React, { useMemo } from 'react'
import { type PropagationEvent, mergeProps } from '@/utils/help'
import type { GetContainer } from '@/utils/get-container'
import { PREFIX_CLS } from '@/constant'
import { renderToContainer } from '@/utils/render-to-container'
import { ShouldRender } from '@/utils/should-render'
import './mask.less'

export interface ComponentProps<S extends string = never> {
  style?: CSSProperties & Partial<Record<S, string>>
  className?: string
}

export interface MaskProps extends ComponentProps {
  /**
   * mask是否可见
   */
  visible?: boolean
  /**
   * mask点击事件
   * @param event
   * @returns
   */
  onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  /**
   * mask是否在关闭后销毁dom
   */
  destroyOnClose?: boolean
  /**
   * 是否强制重复渲染
   */
  forceRender?: boolean
  /**
   * 是否禁止body滚动
   */
  disableBodyScroll?: boolean
  /**
   * 颜色值
   */
  color?: 'white' | 'black' | (string & {})
  /**
   * 透明度
   */
  opacity?: 'default' | 'thin' | 'thick' | number
  /**
   * 注入挂载容器
   */
  getContainer?: GetContainer
  /**
   * 完全展示后触发hooks
   * @returns
   */
  afterShow?: () => void
  /**
   * 完全关闭后触发hooks
   * @returns
   */
  afterClose?: () => void
  /**
   * 阻止冒泡的事件
   */
  stopPropagation?: PropagationEvent[]
  /**
   * 子组件
   */
  children?: ReactNode
}

const classPrefix = `${PREFIX_CLS}-mask`

const opacityRecord: Record<string, number> = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
}

const colorRecord: Record<string, string> = {
  black: '0, 0, 0',
  white: '255, 255, 255',
}

const defaultProps: MaskProps = {
  visible: true,
  destroyOnClose: false,
  forceRender: false,
  color: 'black',
  opacity: 'default',
  disableBodyScroll: true,
  getContainer: undefined,
  stopPropagation: ['click'],
}

export const Mask: FC<MaskProps> = (p) => {
  const props = mergeProps(defaultProps, p)
  const { children, visible, color, opacity, onMaskClick } = props

  /**
   * 根据传入的透明度和色值计算mask的背景颜色
   */
  const background = useMemo(() => {
    const opacityNum =
      typeof opacity === 'string'
        ? opacityRecord[opacity]
        : typeof opacity === 'number'
        ? opacity
        : opacityRecord.default
    const rgb = color ? colorRecord[color] : color
    return rgb ? `rgba(${rgb}, ${opacityNum})` : color
  }, [color, opacity])
  /**
   * mask的react元素
   */
  const node = (
    <div
      className={`${classPrefix}`}
      style={{ ...props.style, background, display: visible ? undefined : 'none' }}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) onMaskClick?.(e)
      }}
    >
      <div className={`${classPrefix}-content`}>{children}</div>
    </div>
  )

  return (
    <ShouldRender active={!!visible} forceRender={props.forceRender} destroyOnClose={props.destroyOnClose}>
      {renderToContainer(props.getContainer!, node)}
    </ShouldRender>
  )
}
