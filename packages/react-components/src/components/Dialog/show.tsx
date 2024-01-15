import React from 'react'
import { Dialog, type DialogProps } from './Dialog'
import { renderImperatively } from '@/utils'

export type DialogShowProps = Omit<DialogProps, 'visible' | 'forceRender' | 'destroyOnClose'>

export const show = (props: DialogProps) => {
  const handler = renderImperatively(<Dialog {...props} />)
  return handler
}
