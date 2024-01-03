import TaskQueue from '../src'

jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')
jest.spyOn(global, 'setInterval')
describe('task queue test cases', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })
  it('case 1', () => {
    const callback = jest.fn()
    const taskQueue = new TaskQueue<string, string>({
      async taskCommand() {
        return Promise.resolve(callback())
      },
      autoStart: false,
      wait: true,
      interval: 100,
    })

    taskQueue.addQueue('1')
    taskQueue.addQueue('2')
    taskQueue.addQueue('3')
    taskQueue.start()

    expect(taskQueue.info().waitExecute.length).toEqual(3)
    expect(taskQueue.info().executed.length).toEqual(0)
    expect(taskQueue.info().executing.length).toEqual(0)
    jest.advanceTimersByTime(1000 * 10)
    jest.runOnlyPendingTimers()
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(taskQueue.info().executing.length).toEqual(1)
    expect(taskQueue.info().waitExecute.length).toEqual(2)
    jest.advanceTimersByTime(1000)
    expect(taskQueue.info().waitExecute.length).toEqual(1)
    // jest.advanceTimersByTime(1000)
    // expect(taskQueue.info().waitExecute.length).toEqual(0)
  })
})
