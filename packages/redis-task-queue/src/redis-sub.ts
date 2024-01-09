// 任务发布者
// 创建 Redis 客户端
import type { Redis } from 'ioredis'
import type { Task } from './type'

type TaskCommand<T, R> = (task: Task<T>) => Promise<R>
// 任务执行者
class TaskExecutor<T, R> {
  redisClient: Redis
  channel: string
  private taskCommand: TaskCommand<T, R>
  constructor(client: Redis, channel: string, taskCommand: TaskCommand<T, R>) {
    this.redisClient = client
    this.channel = channel
    this.taskCommand = taskCommand
  }

  start() {
    // 订阅任务频道
    this.redisClient.subscribe(this.channel).catch(console.error)

    // 监听消息
    this.redisClient.on('message', (channel, message) => {
      if (channel === this.channel) this.executeTask(JSON.parse(message))
    })
  }

  executeTask(task: Task<T>) {
    this.taskCommand(task).catch(console.log)
  }
}

// TODO 来不及执行的
process.on('SIGINT', () => {
  process.exit()
})

// 创建任务发布者和执行者
export const taskExecutor = <T, R>(redisClient: Redis, channel = 'task_channel', taskCommand: TaskCommand<T, R>) => {
  return new TaskExecutor(redisClient, channel, taskCommand)
}

// TODO 进度输出
// TODO 日志输出

// 发布任务
// taskPublisher.publishTask({
//   /* your task data */
// })

// // 启动任务执行者
// taskExecutor.start()
