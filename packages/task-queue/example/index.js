const { sleep } = require('@liutsing/utils')
const TaskQueue = require('../')

// eslint-disable-next-line import/newline-after-import
;(async () => {
  /**
   * @type {import('../').default}
   */
  const taskQueue = new TaskQueue({
    async taskCommand() {
      await sleep(1 * 1000)
      return Promise.resolve()
    },
    autoStart: false,
    wait: true,
    interval: 1000,
  })

  taskQueue.addTask('1')
  taskQueue.addTask('2')
  taskQueue.addTask('3')
  console.log(new Date())

  taskQueue.start()
  await sleep(1 * 1000)

  taskQueue.addTask('4')
  taskQueue.addTask('5')
  taskQueue.addTask('6')
  // 判断此时是否还有需要执行的任务
  if (taskQueue.info().waitExecute !== 0) taskQueue.start()

  console.log(new Date())

  // const taskQueue2 = new TaskQueue({
  //   async taskCommand() {
  //     return Promise.resolve()
  //   },
  //   autoStart: false,
  //   wait: true,
  //   interval: 100,
  // })

  // taskQueue2.addQueue('21')
  // taskQueue2.addQueue('22')
  // taskQueue2.addQueue('23')

  // taskQueue2.addQueue('24')
  // taskQueue2.addQueue('25')
  // taskQueue2.addQueue('26')
  // taskQueue2.start()
})()
