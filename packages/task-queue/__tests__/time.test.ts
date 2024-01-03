function timerGame(callback) {
  setTimeout(() => {
    callback && callback()
  }, 1000)
}

describe('test timer', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('test with settimeout', () => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    jest.spyOn(global, 'setInterval')
    const cb = jest.fn()
    timerGame(cb)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(cb).not.toHaveBeenCalled()
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)

    jest.runAllTimers() // 执行所有的定时器
    // jest.advanceTimersByTime(1200) // 时间往前推进，更精确
    expect(cb).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledTimes(1)
  })
  it('test with nested settimeout', () => {
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    jest.spyOn(global, 'setInterval')
    let a = 0
    const cb = jest.fn(() => {
      setTimeout(() => {
        setTimeout(() => {
          a = 2
        }, 1000)
      }, 1000)
    })

    timerGame(cb)

    expect(setTimeout).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(500)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(500)
    expect(cb).toHaveBeenCalled()
    expect(setTimeout).toHaveBeenCalledTimes(2)
    jest.runAllTimers() // 确保settimeout回调函数执行
    expect(a).toEqual(2)
  })
})
