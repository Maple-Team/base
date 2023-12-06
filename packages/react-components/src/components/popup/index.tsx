import type { FC, PropsWithChildren } from 'react'
import React, { useState } from 'react'
import classNames from 'classnames'
import { useIsomorphicLayoutEffect } from 'ahooks'
import { type PopupBaseProps, defaultPopupBaseProps } from './popup-base-props'
import { Mask } from './mask'
import { PREFIX_CLS } from '@/constant'
import { ShouldRender } from '@/utils/should-render'
import { mergeProps } from '@/utils/help'
import { renderToContainer } from '@/utils/render-to-container'

const classPrefix = `${PREFIX_CLS}-popup`

export type PopupProps = PopupBaseProps &
  PropsWithChildren<{
    position?: 'bottom' | 'top' | 'left' | 'right'
  }>

const defaultProps = {
  ...defaultPopupBaseProps,
  position: 'bottom',
}

export const Popup: FC<PopupProps> = (p) => {
  const props = mergeProps(defaultProps, p)
  const bodyCls = classNames(
    `${classPrefix}-body`,
    props.bodyClassName,
    `${classPrefix}-body-position-${props.position}`
  )
  const [active, setActive] = useState(props.visible)

  // 页面渲染完成后执行的副作用
  useIsomorphicLayoutEffect(() => {
    if (props.visible) setActive(true)
  }, [props.visible])

  const node = (
    <div className={classPrefix} onClick={props.onClick} style={{ display: active ? undefined : 'none' }}>
      {props.mask && <Mask />}
      <div className={bodyCls} style={{ ...props.bodyStyle }}>
        {/* 关闭按钮 */}
        {props.children}
      </div>
    </div>
  )

  return (
    <ShouldRender active={false} destroyOnClose={props.destroyOnClose} forceRender={props.forceRender}>
      {renderToContainer(props.getContainer!, node)}
    </ShouldRender>
  )
}
