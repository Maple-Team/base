const TaskQueue = require('../')

const taskQueue = new TaskQueue({
  async taskCommand() {
    return Promise.resolve()
  },
  autoStart: false,
  wait: true,
  interval: 100,
})

taskQueue.addQueue('1')
taskQueue.addQueue('2')
taskQueue.addQueue('3')
taskQueue.start()
taskQueue.addQueue('4')
taskQueue.addQueue('5')
taskQueue.addQueue('6')

const taskQueue2 = new TaskQueue({
  async taskCommand() {
    return Promise.resolve()
  },
  autoStart: false,
  wait: true,
  interval: 100,
})

taskQueue2.addQueue('21')
taskQueue2.addQueue('22')
taskQueue2.addQueue('23')
taskQueue2.start()
taskQueue2.addQueue('24')
taskQueue2.addQueue('25')
taskQueue2.addQueue('26')
