import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

export type ModalType = 'modal1'

export type State = {
  [key in ModalType]?: boolean
} & {
  /**
   * 定义一个hiding状态用于处理对话框关闭动画
   */
  hiding: Record<string, boolean>
}
interface PayloadActionArgs {
  modalId: string
  args?: boolean
  force?: boolean
}
const initialState: State = { hiding: {} }

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    show: (state, action: PayloadAction<PayloadActionArgs>) => {
      const { modalId, args } = action.payload
      return {
        ...state,
        [modalId]: args || true,
        hiding: {
          ...state.hiding,
          [modalId]: false,
        },
      }
    },
    hide: (state, action: PayloadAction<PayloadActionArgs>) => {
      const { modalId, force } = action.payload
      return force
        ? {
            ...state,
            [modalId]: false,
            hiding: {
              ...state.hiding,
              [modalId]: false,
            },
          }
        : {
            ...state,
            [modalId]: false,
            hiding: {
              ...state.hiding,
              [modalId]: true,
            },
          }
    },
  },
})

export const { show, hide } = modalSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectModal = (state: RootState) => state.modal

export default modalSlice.reducer
