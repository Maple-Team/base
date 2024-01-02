import type { EventEmitter } from 'events'
import events from 'events'
import { uuid } from '@liutsing/utils'
import type { EventCB, ITaskQueue, Option, Task } from './type'

const defaultOption: Option<AnyToFix, AnyToFix> = {
  interval: 1000, // 时间间隔 在非初始化后修改，需要调用restart才会生效
  key: 'taskQueue',
  autoStart: true,
  wait: false, // 是否启用等待执行（上一个任务执行完毕，下一个才开始）  在非初始化后修改，需要调用restart才会生效
  ignoreError: true, // 是否忽略任务对队列中的错误
  queue: [],
  executing: [], // 所有任务执行完成后清除
  executed: [], // 所有任务执行完成后清除
  taskCommand: undefined,
  max: 0, // 队列最大长度 0为不限制
  eventEmitter: new events.EventEmitter(),
}

export default class TaskQueue<T, R> implements ITaskQueue<T, R> {
  private interval: undefined
  private autoStart: undefined
  /**
   * @type {boolean} 是否同步执行任务
   */
  private wait: undefined
  private ignoreError: undefined
  /** 待执行的任务 */
  private queue: Task<T>[] = []
  /** 正在执行的任务 */
  private executing: Task<T>[] = []
  /** 已执行的任务 */
  private executed: Task<T>[] = []
  /** 执行任务的方式 */
  private taskCommand: ((task: Task<T>) => Promise<R>) | undefined
  private max: undefined
  private eventEmitter: undefined | EventEmitter
  /** 停止标志位 */
  private stopSign: boolean | undefined
  private timeoutId: NodeJS.Timeout | undefined | null
  private intervalId: NodeJS.Timeout | undefined | null

  constructor(option?: Option<T, R>) {
    Object.assign(this, defaultOption, option)
  }

  /**
   * 手动启动任务，如果autoStart=true，在第一条任务添加进队列后，会自动运行
   */
  start() {
    this.stopSign = false
    // 取出queue里面的任务进行分异步/同步执行
    if (this.wait) this.syncMode()
    else this.asyncMode()
  }

  /**
   * 重启队列中的任务，并使用新的配置处理未执行任务
   */
  restart() {
    // 进行重启操作，重启后使用新的配置
    this.stop()
    this.start()
  }

  /**
   * 停止当前所有任务，直到start或者队列长度再次为0时
   */
  stop() {
    // 重置标志位
    this.stopSign = true
    // 清除定时器
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    // 清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  clear() {
    this.executed = []
    this.executing = []
    this.queue = []
  }

  subscribe(event: EventCB<R>) {
    this.eventEmitter?.on('success_event', event)
  }

  removeSubscribe(event: EventCB<R>) {
    this.eventEmitter?.off('success_event', event)
  }

  progress() {
    const executed = this.executed.length
    const queueLength = this.queue.length
    const executing = this.executing.length

    return {
      progress: executed / (executed + executing + queueLength),
      executed: this.executed || [],
      executing: this.executing || [],
      waitExecute: this.queue || [],
    }
  }

  addQueue(task: T) {
    const no = uuid()
    // 任务超长处理
    if (this.max && this.queue.length >= this.max) {
      // FIXME 加1是为了让队列在此次添加任务后，不会大于最大数量
      this.queue.splice(0, this.queue.length - this.max + 1)
      console.warn('task-queue-node Warning: task queue limit %s ', this.max)
    } else if (this.queue.length === 0 && this.autoStart) {
      this.queue.push({ task, no })
      this.start()
    } else {
      this.queue.push({ task, no })
    }
  }

  /**
   * 移除任务
   * @param task
   */
  private removeTask(task: Task<T>): void {
    for (let index = 0; index < this.executing.length; index++) {
      const executingTask = this.executing[index]
      if (executingTask && task.no === executingTask.no) this.executing.splice(index, 1)
    }
  }

  /**
   * 同步执行任务
   */
  private syncMode(): void {
    this.timeoutId = setTimeout(() => {
      if (this.queue.length === 0) {
        this.executed = []
        this.executing = []
        return
      }
      const task = this.queue.shift()
      if (!task) return
      this.executing.push(task)
      this.taskCommand?.(task)
        .then((res) => {
          // 抛出事件
          this.eventEmitter?.emit('success_event', null, res)
          // 更新已完成的任务队列
          this.executed.push(task)
          // 删除正在执行的队列中的这个已完成的任务
          this.removeTask(task)
          // 下一个任务
          !this.stopSign && this.syncMode()
        })
        .catch((e: Error) => {
          // 抛出事件
          this.eventEmitter?.emit('success_event', e)
          // 更新已完成的任务队列
          this.executed.push(task)
          // 删除正在执行的队列中的这个已完成的任务
          this.removeTask(task)
          if (!this.ignoreError) {
            // 退出程序
            this.stop()
            return
          }
          // 下一个任务
          !this.stopSign && this.syncMode()
        })
      //
    }, this.interval)
  }

  /**
   * 异步执行任务
   */
  private asyncMode(): void {
    // 利用定时器执行下一个任务
    this.intervalId = setInterval(() => {
      if (this.queue.length === 0) {
        this.executed = []
        this.executing = []
        // FIXME  如何确保执行完了呢?
        this.stop()
        return
      }
      const task = this.queue.shift()
      if (!task) return
      this.executing.push(task)
      this.taskCommand?.(task)
        .then((res) => {
          this.eventEmitter?.emit('success_event', null, res)
          this.executed.push(task)
          this.removeTask(task)
        })
        .catch((e: Error) => {
          this.eventEmitter?.emit('success_event', e)
          this.executed.push(task)
          this.removeTask(task)
          if (!this.ignoreError) this.stop()
        })
    }, this.interval)
  }
}
