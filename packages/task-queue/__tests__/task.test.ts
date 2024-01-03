import TaskQueue from '../src'

jest.setTimeout(10 * 1000)
describe('task queue test cases', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })
  it('case 1', async () => {
    const TIMEOUT = 1000
    const cb = jest.fn(() => {
      console.log('Executing task...')
      return Promise.resolve('success')
    })
    const taskQueue = new TaskQueue<string, string>({
      taskCommand: cb,
      autoStart: false,
      wait: true,
      interval: TIMEOUT,
    })

    taskQueue.addQueue('Task 1')
    taskQueue.addQueue('Task 2')
    taskQueue.addQueue('Task 3')

    expect(taskQueue.info().waitExecute.length).toEqual(3)
    await taskQueue.start()

    expect(taskQueue.info().waitExecute.length).toEqual(0)
    expect(cb).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(3)
  })
  it('case 2', async () => {
    const TIMEOUT = 1000
    const cb = jest.fn(() => {
      console.log('Executing task...')
      return Promise.resolve('success')
    })
    const taskQueue = new TaskQueue<string, string>({
      taskCommand: cb,
      autoStart: true,
      wait: true,
      interval: TIMEOUT,
    })

    taskQueue.addQueue('Task 1')
    taskQueue.addQueue('Task 2')
    taskQueue.addQueue('Task 3')

    expect(taskQueue.info().waitExecute.length).toEqual(3)
    await taskQueue.start()

    expect(taskQueue.info().waitExecute.length).toEqual(0)
    expect(cb).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(3)
  })
})
