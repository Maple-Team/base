/**
 * 进度管理类
 */
export interface Progress<T> {
  progress: number
  executing: Task<T>[]
  executed: Task<T>[]
  waitExecute: Task<T>[]
}
/**
 * 任务实体
 */
export interface Task<T> {
  task: T
  no: string
}
/**
 * 事件回调
 */
export type EventCB<R> = (e: Error | null, result: R) => void
