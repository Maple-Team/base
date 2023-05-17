import { act, renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'
import { server } from '../setupTests'
import { createWrapper, renderWithClient } from './utils'
import mockData from '@/mockData.json'
import { useCustomHook } from '@/hooks'
import Example from '@/pages/ReactQueryTest'

describe('react query test case', () => {
  it('CustomHook test', async () => {
    const { result } = renderHook(() => useCustomHook(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    expect(result.current.data).toStrictEqual(mockData)
  })
  it('failure query hook', async () => {
    server.use(
      rest.get('*', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const { result } = renderHook(() => useCustomHook(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })
  it('successful query component', async () => {
    console.time('label')
    const result = renderWithClient(<Example />)

    // NOTE case 1: 元素一开始就存在，需要等待
    const target = result.getByTestId('test-id')
    expect(target).toHaveTextContent('')

    await waitFor(() => {
      const element = result.getByTestId('test-id')
      return element.innerHTML === mockData.info.seed
    })

    await act(async () => {
      await waitFor(() => {})
    })

    expect(result.getByTestId('test-id')).toHaveTextContent(mockData.info.seed)

    // NOTE case 2: 使用异步查询: 元素一开始不存在
    // const target = await result.findByTestId('test-id')
    // expect(target).toHaveTextContent(mockData.info.seed)
  })
})
