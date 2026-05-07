export interface BaseList<T> {
  pagination: {
    total: number
    current: number
    pageSize: number
  }
  records: T[]
}

export interface BaseResponse<T = unknown> {
  status: number
  message: string
  data: T
  errors?: string[]
  timestamp?: number
  [key: string]: unknown
}

export type BaseParams<T> = Partial<T> & {
  current?: number
  pageSize?: number
}
