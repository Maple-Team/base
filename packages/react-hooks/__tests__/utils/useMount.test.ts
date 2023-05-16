import { renderHook } from '@testing-library/react'
import { useMount } from '@/utils'

describe('useMount test cases', () => {
  describe('useMount test cases with normal function', () => {
    let fn: () => void
    beforeEach(() => {
      fn = jest.fn()
    })
    it('should call the function on mount', () => {
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
    })
    it('should not call the function if it is not provided', () => {
      renderHook(() => useMount())
      expect(true).toBeTruthy()
    })

    it('should not call provided callback on unmount', () => {
      const { unmount } = renderHook(() => useMount(fn))
      expect(fn).toHaveBeenCalledTimes(1)
      unmount()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should not call provided callback on rerender', () => {
      const { rerender } = renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
      rerender()
      expect(fn).toBeCalledTimes(1)
    })
    it('should call the function twice on useMount called twice', () => {
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(2)
    })
  })
  describe('useMount test cases with async function', () => {
    let fn: () => void
    beforeEach(() => {
      fn = jest.fn().mockResolvedValue(
        new Promise<void>((resolve) => {
          resolve()
        })
      )
    })
    it('should call the function on mount', () => {
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
    })
    it('should not call the function if it is not provided', () => {
      renderHook(() => useMount())
      expect(true).toBeTruthy()
    })

    it('should not call provided callback on unmount', () => {
      const { unmount } = renderHook(() => useMount(fn))
      expect(fn).toHaveBeenCalledTimes(1)
      unmount()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should not call provided callback on rerender', () => {
      const { rerender } = renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
      rerender()
      expect(fn).toBeCalledTimes(1)
    })
    it('should call the function twice on useMount called twice', () => {
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(1)
      renderHook(() => useMount(fn))
      expect(fn).toBeCalledTimes(2)
    })
  })
})
