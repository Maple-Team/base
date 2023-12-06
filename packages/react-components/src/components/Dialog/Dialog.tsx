import type { FC, ReactNode } from 'react'
import React from 'react'
import { CenterPopup, type CenterPopupProps } from '../popup/center-popup'
import { mergeProps } from '@/utils/help'

export type Action = AnyToFix
// mask公共组件
// 居中容器组件
// 其他的一些dom工具方法

export type DialogProps = Pick<
  CenterPopupProps,
  | 'afterClose'
  | 'afterShow'
  | 'bodyClassName'
  | 'bodyStyle'
  | 'destroyOnClose'
  | 'disableBodyScroll'
  | 'forceRender'
  | 'getContainer'
  | 'maskClassName'
  | 'maskStyle'
  | 'stopPropagation'
  | 'visible'
> & {
  title?: ReactNode
  content?: ReactNode
  // actions?: (Action | Action[])[]
  // onAction?: (action: Action, index: number) => void | Promise<void>
  onClose?: () => void
  // closeOnAction?: boolean
  closeOnMaskClick?: boolean
}

const defaultProps = {
  actions: [] as Action[],
  closeOnAction: false,
  closeOnMaskClick: false,
  getContainer: null,
}

export const Dialog: FC<DialogProps> = (p) => {
  const props = mergeProps(defaultProps, p)
  const element = (
    <div>
      {props.title ?? <div>占位标题</div>}
      {props.content ?? <div>占位内容</div>}
      {/* // TODO 按钮 */}
    </div>
  )

  return (
    <CenterPopup
      onMaskClick={
        props.closeOnMaskClick
          ? () => {
              props.onClose?.()
            }
          : undefined
      }
      visible={props.visible}
      getContainer={props.getContainer}
      maskStyle={props.maskStyle}
      maskClassName={props.maskClassName}
      destroyOnClose={props.destroyOnClose}
      forceRender={props.forceRender}
    >
      {element}
    </CenterPopup>
  )
}
