import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { useCustomHook } from '@/pages/ReactQueryTest'

const createWrapper = () => {
  const queryClient = new QueryClient({
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
    defaultOptions: {
      queries: {
        retry: false, // 测试react-query首先我们必须得拥有queryClient，所以我们初始化queryClient，
        // 因为默认是重试三次，这意味着如果想测试错误的查询，测试可能会超时。所以可以在初始化时关闭
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('react query test case', () => {
  // beforeEach(() => {
  //   nock.restore()

  //   nock(baseURL, {
  //     reqheaders: {
  //       Origin: 'http://localhost',
  //     },
  //   })
  //     .get('/api')
  //     .query(true)
  //     .reply(200, mockData, {
  //       'Access-Control-Allow-Origin': 'http://localhost',
  //     })
  // })

  // afterEach(() => {
  //   // nock.restore()
  //   nock.cleanAll()
  //   // nock.enableNetConnect()
  //   // nock.emitter.removeAllListeners()
  //   // nock.activate()
  //   // nock.enableNetConnect()
  // })

  it('CustomHook test', async () => {
    const { result } = renderHook(() => useCustomHook(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
    console.log(result.current.data, result.current.isLoading, result.current.isSuccess)
    expect(result.current.data).toBeDefined()
  })
})
