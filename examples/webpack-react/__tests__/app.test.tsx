import { act, cleanup, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { renderWithClient } from './utils'
import mockData from '@/mockData.json'
import { Example1, Example2 } from '@/pages/ReactQueryTest'
import '../setupTests'

describe('react query test case', () => {
  afterEach(() => {
    cleanup()
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

  it('successful query component when component initial exist case', async () => {
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
