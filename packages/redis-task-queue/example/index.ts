import { uuid } from '@liutsing/utils'
import Redis from 'ioredis'
import { taskExecutor, taskPublisher } from '../'

// eslint-disable-next-line import/newline-after-import
;(() => {
  const channel = 'task_demo'
  const publisher = taskPublisher(new Redis(), channel)
  const executor = taskExecutor(
    new Redis(6379, {
      db: 3,
    }),
    channel,
    // eslint-disable-next-line @typescript-eslint/require-await
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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on('SIGINT', async () => {
    await executor.onExit()
    process.exit(0)
  })
})()
