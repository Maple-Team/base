const { uuid } = require('@liutsing/utils')
const { getRedisClient, taskExecutor, taskPublisher } = require('../')

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const redisClient = getRedisClient()
  const channel = 'task_demo'
  const publisher = taskPublisher(redisClient, channel)
  const executor = taskExecutor(redisClient, channel, console.log)
  setTimeout(() => {
    publisher.publishTask({
      no: uuid(),
      task: '123',
    })
  }, 1000)
  executor.executeTask()
})()
