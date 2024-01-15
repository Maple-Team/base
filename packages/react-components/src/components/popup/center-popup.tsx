import { type FC, type PropsWithChildren, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'ahooks'
import React from 'react'
import classNames from 'classnames'
import { type PopupBaseProps, defaultPopupBaseProps } from './popup-base-props'
import { Mask } from './mask'
import { PREFIX_CLS } from '@/constant'
import { mergeProps } from '@/utils/help'
import { ShouldRender } from '@/utils/should-render'
import { renderToContainer } from '@/utils/render-to-container'
import { useInnerVisible } from '@/utils/use-inner-visible'

export type CenterPopupProps = PopupBaseProps &
  PropsWithChildren<{
    // These props currently are only used internally. They are not exported to users:
    role?: string
  }>

const classPrefix = `${PREFIX_CLS}-center-popup`

const defaultProps = {
  ...defaultPopupBaseProps,
  getContainer: null,
}

export const CenterPopup: FC<CenterPopupProps> = (p) => {
  const props = mergeProps(defaultProps, p)

  const [active, setActive] = useState(props.visible)
  useIsomorphicLayoutEffect(() => {
    if (props.visible) setActive(true)
  }, [props.visible])

  const maskVisible = useInnerVisible(active && props.visible)

  const bodyContent = (
    <div className={classNames(`${classPrefix}-body`, props.bodyClassName)} style={props.bodyStyle}>
      {props.children}
    </div>
  )
  const node = (
    <div className={classPrefix} style={{ display: active ? undefined : 'none' }}>
      {props.mask && (
        <Mask
          visible={maskVisible}
          forceRender={props.forceRender}
          destroyOnClose={props.destroyOnClose}
          onMaskClick={(e) => {
            props.onMaskClick?.(e)
            if (props.closeOnMaskClick) props.onClose?.()
          }}
          style={props.maskStyle}
          className={classNames(`${classPrefix}-mask`, props.maskClassName)}
          disableBodyScroll={false}
          stopPropagation={props.stopPropagation}
        />
      )}
      <div className={`${classPrefix}-wrap`} role={props.role}>
        {bodyContent}
      </div>
    </div>
  )

  return (
    <ShouldRender active={active} forceRender={props.forceRender} destroyOnClose={props.destroyOnClose}>
      {renderToContainer(props.getContainer, node)}
    </ShouldRender>
  )
}
