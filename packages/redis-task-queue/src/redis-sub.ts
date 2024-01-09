import type { Callback, Redis, RedisKey } from 'ioredis'
import { uuid } from '@liutsing/utils'
import type { Option as TaskQueueOption } from './task-queue'
import TaskQueue from './task-queue'
import type { Task } from './type'
import { getRedisClient } from './helper'

type TaskCommand<T, R> = (task: Task<T>) => Promise<R>
type SubscribeCB = (e: Error | undefined | null, count: number) => void
interface Option<T, R> extends TaskQueueOption<T, R> {
  channels?: string[]
  subscribeCB?: SubscribeCB
  redisKey?: string
}
const redis = getRedisClient({ db: 3 })
// 任务执行者
class TaskExecutor<T, R> {
  private taskQueue
  private redisClient: Redis
  private channels: string[] = []
  private subscribeCB: Callback<unknown> = (err, count) => {
    if (err) console.error('Failed to subscribe: %s', err.message)
    else console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`)
  }

  redisKey: RedisKey = 'TaskExecutorRedisKey'

  constructor(client: Redis, option: Option<T, R>) {
    this.redisClient = client
    const { channels, subscribeCB, redisKey, ...rest } = option
    Object.assign(this, { channels, subscribeCB, redisKey })
    this.taskQueue = new TaskQueue<T, R>({ ...rest })
    this.start().catch(console.error)
  }

  private async start() {
    // 订阅任务频道
    this.redisClient.subscribe(...this.channels, this.subscribeCB).catch(console.error)

    // 监听消息
    this.redisClient.on('message', (channel, message) => {
      if (this.channels.includes(channel)) {
        const task = JSON.parse(message) as unknown as T
        this.taskQueue.addTask(task)
      }
    })

    const tasks = (await redis.smembers(this.redisKey))
      .map((item) => {
        try {
          return {
            no: uuid(),
            task: JSON.parse(item) as unknown as T,
          }
        } catch (error) {
          return null
        }
      })
      .filter(Boolean) as Task<T>[]

    this.taskQueue.updateQueue(tasks)
    this.taskQueue.start()
  }

  unSubscribe(cb: Callback<unknown>) {
    this.redisClient.punsubscribe(cb).catch(console.error)
  }

  /**
   * 程序退出时
   */
  async onExit() {
    const { waitExecute, executing } = this.taskQueue.info()
    const tasks = [...waitExecute, ...executing].map(({ task }) => JSON.stringify(task))
    if (!this.redisKey) return
    if (!tasks.length) return
    await redis.sadd(this.redisKey, ...tasks)
    redis.disconnect()
  }
}

// 创建任务发布者和执行者
export const taskExecutor = <T, R>(
  redisClient: Redis,
  channel = 'task_channel',
  taskCommand: TaskCommand<T, R>,
  redisKey: string
) => {
  return new TaskExecutor(redisClient, { channels: [channel], taskCommand, redisKey })
}

// TODO 进度输出
// TODO 日志输出
