import type { Redis } from 'ioredis'
import type { Task } from './type'

class TaskPublisher<T> {
  redisClient: Redis
  channel: string
  constructor(client: Redis, channel: string) {
    this.redisClient = client
    this.channel = channel
  }

  publishTask(task: Task<T>) {
    this.redisClient.publish(this.channel, JSON.stringify(task)).catch(console.error)
  }
}

// 创建任务发布者和执行者
export const taskPublisher = (redisClient: Redis, channel = 'task_channel') => {
  return new TaskPublisher(redisClient, channel)
}
