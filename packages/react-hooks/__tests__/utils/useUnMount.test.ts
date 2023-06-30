import { renderHook } from '@testing-library/react'
import { useUnmount } from '@/utils'

describe('useUnMount test cases', () => {
  it('should the function called when unMounted', () => {
    const fn = jest.fn()
    const { unmount } = renderHook(() => useUnmount(fn))
    unmount()
    expect(fn).toBeCalledTimes(1)
  })
  it('should the function not called when not unMounted', () => {
    const fn = jest.fn()
    renderHook(() => useUnmount(fn))
    expect(fn).not.toHaveBeenCalled()
  })
  it('should not call provided callback on re-renders', () => {
    const fn = jest.fn()
    const hook = renderHook(() => useUnmount(fn))

    hook.rerender()
    hook.rerender()
    hook.rerender()
    hook.rerender()

    expect(fn).not.toHaveBeenCalled()
  })

  it('should call provided callback if is has been changed', () => {
    const fn = jest.fn()
    const fn2 = jest.fn()
    const fn3 = jest.fn()
    const hook = renderHook((cb) => useUnmount(cb), { initialProps: fn })

    hook.rerender(fn2)
    hook.rerender(fn3)
    hook.unmount()

    expect(fn).not.toHaveBeenCalled()
    expect(fn2).not.toHaveBeenCalled()
    expect(fn3).toHaveBeenCalledTimes(1)
  })

  it('should the function not called when no callback function', () => {
    renderHook(() => useUnmount(undefined))
    expect(true).toBeTruthy()
  })
  it('should the async function called when unMounted', () => {
    const fn = jest.fn().mockResolvedValue(
      () =>
        new Promise<void>((resolve) => {
          resolve()
        })
    )
    const { unmount } = renderHook(() => useUnmount(fn))
    unmount()
    expect(fn).toBeCalledTimes(1)
  })
})
