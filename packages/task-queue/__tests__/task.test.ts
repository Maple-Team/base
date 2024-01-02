import { sleep } from '@liutsing/utils'
import TaskQueue from '../src'

jest.useFakeTimers()
describe('task queue test cases', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })
  it('case 1', () => {
    expect(1 + 1).toEqual(2)
    const taskQueue = new TaskQueue<string, string>({
      async taskCommand() {
        await sleep(100)
        console.log(new Date())
      },
      autoStart: false,
      wait: true,
      interval: 100,
    })

    taskQueue.addQueue('1')
    taskQueue.addQueue('2')
    taskQueue.addQueue('3')
    taskQueue.start()
    const progress1 = taskQueue.progress()
    expect(progress1.waitExecute.length).toEqual(3)
    expect(progress1.executed.length).toEqual(0)
    expect(progress1.executing.length).toEqual(0)
    jest.advanceTimersByTime(1000)
    const progress2 = taskQueue.progress()
    expect(progress2.waitExecute.length).toEqual(0)
    expect(progress2.executed.length).toEqual(0)
    expect(progress2.executing.length).toEqual(0)
  })
})
