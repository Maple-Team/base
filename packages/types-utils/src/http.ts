export interface BaseList<T> {
  pagination: {
    total: number
    current: number
    pageSize: number
  }
  records: T[]
}

export interface BaseResponse<T> {
  status: number
  message: string
  data: T
}

export type BaseParams<T> = Partial<T> & {
  current?: number
  pageSize?: number
}
