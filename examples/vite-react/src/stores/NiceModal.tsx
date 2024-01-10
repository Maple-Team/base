import { useDispatch, useSelector } from 'react-redux'
import type { ElementType } from 'react'
import React, { useCallback } from 'react'
import type { ModalProps } from 'antd'
import { Modal } from 'antd'
import { hide, show } from './modalSlice'
import type { ModalType } from './modalSlice'
import type { RootState } from './store'

const modalCallbacks: {
  [key in ModalType]?: <T>(value: T) => void
} = {}
function showModal(modalId: string, args?: AnyToFix) {
  return {
    type: show,
    payload: {
      modalId,
      args,
    },
  }
}
function hideModal(modalId: string, force?: boolean) {
  return {
    type: hide,
    payload: {
      modalId,
      force,
    },
  }
}

/**
 * 控制modal行为的Hooks
 * @param modalId
 * @returns
 */
export const useNiceModal = <T,>(modalId: ModalType) => {
  const dispatch = useDispatch()
  const show = useCallback(
    (args?: ExtraModalProps<T>) => {
      return new Promise<T>((resolve) => {
        // @ts-expect-error: xx
        modalCallbacks[modalId] = resolve
        dispatch(showModal(modalId, args))
      })
    },
    [dispatch, modalId]
  )
  const resolve = useCallback(
    (value: T) => {
      if (modalCallbacks[modalId]) {
        modalCallbacks[modalId]!(value)
        delete modalCallbacks[modalId]
      }
    },
    [modalId]
  )
  const hide = useCallback(
    (force?: boolean) => {
      dispatch(hideModal(modalId, force))
      delete modalCallbacks[modalId]
    },
    [dispatch, modalId]
  )
  const args = useSelector((s: RootState) => s.modal[modalId])
  const hiding = useSelector((s: RootState) => s.modal.hiding[modalId])

  return { args, hiding, show, hide, visible: !!args, resolve }
}

/**
 * 封装了Antd Modal的Modal组件
 * @param param0
 * @returns
 */
export function NiceModal({ id, children, ...rest }: { id: ModalType } & ModalProps) {
  const modal = useNiceModal(id)
  return (
    <Modal
      onCancel={() => modal.hide()}
      onOk={() => modal.hide()}
      afterClose={() => modal.hide(true)}
      open={!modal.hiding}
      {...rest}
    >
      {children}
    </Modal>
  )
}
export interface ExtraModalProps<T> extends ModalProps {
  record?: T
}
/**
 * 渲染Modal的HOC组件
 *
 * @param modalId
 * @param Comp 要渲染展示的组件
 * @returns
 */

export const createNiceModal = <T,>(modalId: ModalType, Comp: ElementType<ExtraModalProps<T>>) => {
  return (props?: JSX.IntrinsicAttributes & ExtraModalProps<T>) => {
    const { visible, ...args } = useNiceModal(modalId)
    if (!visible) return null
    console.log(args, props)
    return <Comp {...props} />
  }
}

NiceModal.create = createNiceModal
NiceModal.useModal = useNiceModal

export default NiceModal
