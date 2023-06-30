/// <reference types="@liutsing/types-utils/global" />

declare interface BaseResponse<T> {
  status: number
  message: string
  data: T
}
