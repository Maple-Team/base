const { uuid } = require('@liutsing/utils')
const Redis = require('ioredis')
const { taskExecutor, taskPublisher } = require('../')

// eslint-disable-next-line import/newline-after-import
;(async () => {
  const channel = 'task_demo'
  const publisher = taskPublisher(new Redis(), channel)
  const executor = taskExecutor(
    new Redis(6379, {
      db: 3,
    }),
    channel,
    async (t) => {
      console.log(t)
    },
    'demo'
  )

  setInterval(() => {
    publisher.publishTask({
      no: uuid(),
      task: new Date().toDateString(),
    })
  }, 2000)

  process.on('SIGINT', async () => {
    await executor.onExit()
    process.exit(0)
  })
})()
