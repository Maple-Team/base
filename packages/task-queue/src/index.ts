import type { EventEmitter } from 'events'
import events from 'events'
import { sleep, uuid } from '@liutsing/utils'
import type { EventCB, ITaskQueue, Option, Task } from './type'

const defaultOption: Option<AnyToFix, AnyToFix> = {
  interval: 1000,
  autoStart: true,
  wait: false,
  ignoreError: true,
  queue: [],
  executing: [],
  executed: [],
  taskCommand: undefined,
  max: 0,
  eventEmitter: new events.EventEmitter(),
}
/**
 * 任务队列
 *
 * 类似job的概念
 *
 * 微任务/宏任务思想
 *
 * TODO 优先级？
 */
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
    if (this.wait) this.syncRun()
    else this.asyncRun()
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
    this.eventEmitter?.on('success', event)
  }

  removeSubscribe(event: EventCB<R>) {
    this.eventEmitter?.off('success', event)
  }

  on(eventName: string, handler: (...args: AnyToFix[]) => void) {
    this.eventEmitter?.on(eventName, handler)
  }

  off(eventName: string, handler: (...args: AnyToFix[]) => void) {
    this.eventEmitter?.off(eventName, handler)
  }

  info() {
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
  private syncRun() {
    this.timeoutId = setTimeout(() => {
      const cb = async () => {
        if (this.queue.length === 0) {
          this.executed = []
          this.executing = []
          await sleep(5 * 1000)
          // 延迟退出?
          this.eventEmitter?.emit('completed', null)
          return
        }
        const job = this.queue.shift()
        if (!job) return
        this.executing.push(job)
        this.taskCommand?.(job)
          .then((res) => {
            // 抛出事件
            this.eventEmitter?.emit('success', null, res)
            // 更新已完成的任务队列
            this.executed.push(job)
            // 删除正在执行的队列中的这个已完成的任务
            this.removeTask(job)
            // 下一个任务
            if (!this.stopSign) this.syncRun()
          })
          .catch((e: Error) => {
            console.error(e)
            // 抛出事件
            this.eventEmitter?.emit('success', e)
            // 更新已完成的任务队列
            this.executed.push(job)
            // 删除正在执行的队列中的这个已完成的任务
            this.removeTask(job)
            if (!this.ignoreError) {
              // 退出程序
              this.stop()
              return
            }
            // 下一个任务
            !this.stopSign && this.syncRun()
          })
      }
      cb().catch(console.error)
    }, this.interval)
  }

  /**
   * 异步执行任务
   */
  private asyncRun(): void {
    // 利用定时器执行下一个任务
    this.intervalId = setInterval(() => {
      if (this.queue.length === 0) {
        this.executed = []
        this.executing = []
        this.stop()
        this.eventEmitter?.emit('completed', null)
        return
      }
      const task = this.queue.shift()
      if (!task) return
      this.executing.push(task)
      this.taskCommand?.(task)
        .then((res) => {
          this.eventEmitter?.emit('success', null, res)
          this.executed.push(task)
          this.removeTask(task)
        })
        .catch((e: Error) => {
          this.eventEmitter?.emit('success', e)
          this.executed.push(task)
          this.removeTask(task)
          if (!this.ignoreError) this.stop()
        })
    }, this.interval)
  }
}
