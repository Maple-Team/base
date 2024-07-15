import { act, renderHook } from '@testing-library/react'

// import { useInterval } from 'ahooks'
import { useInterval, useInterval2, useTimeout } from '@/utils'

describe('useExample test cases', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('useTimeout test cases', () => {
    it('case1', () => {
      const { result } = renderHook(() => useTimeout())
      act(() => {
        jest.runAllTimers()
      })
      expect(result.current).toBe(1)
    })
    it('case2', () => {
      const { result } = renderHook(() => useTimeout())
      expect(result.current).toBe(0)

      act(() => {
        jest.advanceTimersByTime(1100)
      })
      expect(result.current).toBe(1)
    })
  })
  describe('useInterval test cases', () => {
    // unmount, rerender cases
    it('case 1', () => {
      const fn = jest.fn()
      renderHook(() => useInterval(fn, 1000))
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('case 2', () => {
      const fn = jest.fn()

      renderHook(() => useInterval(fn, 4000))
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).not.toBeCalled()
    })
  })
  describe('useInterval2 test cases', () => {
    it('should been called right times in specific timeout', () => {
      const fn = jest.fn()
      renderHook(() => useInterval2(fn, 1000))
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should been called right times in specific timeout with multiple rerender', () => {
      const fn = jest.fn()
      const hooks = renderHook(() => useInterval2(fn, 1000))
      hooks.rerender()
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      hooks.rerender()
      hooks.rerender()
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should be called right times in specific timeout with initialProps', () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      const hooks = renderHook((fn) => useInterval2(fn, 1000), { initialProps: fn1 })
      act(() => {
        jest.advanceTimersByTime(3000)
      })

      hooks.rerender(fn2)
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn1).toHaveBeenCalledTimes(3)
      expect(fn2).toHaveBeenCalledTimes(3)
    })

    it('should not called when hooks unmount', () => {
      const fn = jest.fn()
      const { unmount } = renderHook(() => useInterval2(fn, 1000))
      unmount()
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).not.toBeCalled()
    })

    it('should called when hooks unmount and set immediate invoked', () => {
      const fn = jest.fn()
      const { unmount } = renderHook(() => useInterval2(fn, 1000, { immediate: true }))
      unmount()
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should called when no time', () => {
      const fn = jest.fn()

      renderHook(() => useInterval2(fn, 4000))
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(fn).not.toBeCalled()
    })
  })
})
