import type React from 'react'
import type { CSSProperties } from 'react'
import type { MaskProps } from './mask'
import type { GetContainer } from '@/utils/render-to-container'
import type { PropagationEvent } from '@/utils/help'

export interface PopupBaseProps {
  afterClose?: () => void
  afterShow?: () => void
  bodyClassName?: string
  bodyStyle?: CSSProperties
  closeOnMaskClick?: boolean
  destroyOnClose?: boolean
  disableBodyScroll?: boolean
  forceRender?: boolean
  getContainer?: GetContainer
  mask?: boolean
  maskClassName?: string
  maskStyle?: MaskProps['style']
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onClose?: () => void
  onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  showCloseButton?: boolean
  stopPropagation?: PropagationEvent[]
  visible?: boolean
}

export const defaultPopupBaseProps = {
  closeOnMaskClick: false,
  destroyOnClose: false,
  disableBodyScroll: true,
  forceRender: false,
  getContainer: () => document.body,
  mask: true,
  showCloseButton: false,
  stopPropagation: ['click'],
  visible: false,
}
