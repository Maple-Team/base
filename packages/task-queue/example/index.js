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
