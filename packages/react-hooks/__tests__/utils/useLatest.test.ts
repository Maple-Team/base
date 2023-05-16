import { renderHook } from '@testing-library/react'
import { useLatest } from '@/utils'

const setUp = <T>(val: T) => renderHook((state) => useLatest<T>(state), { initialProps: val })

describe('useLatest test cases', () => {
  it('useLatest with basic variable should work', () => {
    const { result, rerender } = setUp(0)
    rerender(1)
    expect(result.current.current).toBe(1)
    rerender(2)
    expect(result.current.current).toBe(2)
    rerender(3)
    expect(result.current.current).toBe(3)
  })

  it('useLatest with reference variable should work', () => {
    const { result, rerender } = setUp({})
    expect(result.current.current).toEqual({})
    rerender([])
    expect(result.current.current).toEqual([])
  })

  test('should return the latest object reference', () => {
    const obj1 = { foo: 'bar' }
    const obj2 = { foo: 'qux' }

    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: obj1 },
    })

    expect(result.current.current).toBe(obj1)

    rerender({ value: obj2 })
    expect(result.current.current).toBe(obj2)
  })
})
