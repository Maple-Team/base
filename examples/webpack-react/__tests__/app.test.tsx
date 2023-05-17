import { act, renderHook, waitFor, screen } from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'
import { server } from '../setupTests'
import { createWrapper, renderWithClient } from './utils'
import mockData from '@/mockData.json'
import { useCustomHook } from '@/hooks'
import { Example1, Example2 } from '@/pages/ReactQueryTest'

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

  // working, but warning act not setup right
  // it('successful query component when component initial exist case 1', async () => {
  //   const result = renderWithClient(<Example2 />)
  //   const target = result.getByTestId('test-id')
  //   expect(target).toHaveTextContent('')

  //   await waitFor(() => {
  //     const element = result.getByTestId('test-id')
  //     return element.innerHTML === mockData.info.seed
  //   })
  //   await act(async () => {
  //     await waitFor(() => {})
  //   })

  //   expect(target).toHaveTextContent(mockData.info.seed)
  // })

  it('successful query component when component initial exist case 2', async () => {
    await act(() => {
      renderWithClient(<Example2 />)
    })

    expect(screen.getByTestId('test-id')).toHaveTextContent('')

    await waitFor(() => {
      const element = screen.getByTestId('test-id')
      return element.innerHTML !== ''
    })

    await waitFor(() => {
      const target = screen.getByTestId('test-id')
      return target.innerHTML === mockData.info.seed
    })
    const target = screen.getByTestId('test-id')
    expect(target).toHaveTextContent(mockData.info.seed)
  })

  it('successful query component when component initial not exist', async () => {
    const result = renderWithClient(<Example1 />)
    // NOTE case 2: 使用异步查询: 元素一开始不存在
    const target = await result.findByTestId('test-id')
    expect(target).toHaveTextContent(mockData.info.seed)
  })
})
