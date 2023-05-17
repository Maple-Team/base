import nock from 'nock'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import mockData from '@/mockData.json'
import { baseURL, fetchApiInfo, useCustomHook } from '@/pages/ReactQueryTest'

describe('react query test case', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  beforeEach(() => {
    nock.restore()

    nock(baseURL, {
      reqheaders: {
        Origin: 'http://localhost',
      },
    })
      .get('/api')
      .query(true)
      .reply(200, mockData, {
        'Access-Control-Allow-Origin': 'http://localhost',
      })
  })

  afterEach(() => {
    // nock.restore()
    nock.cleanAll()
    // nock.enableNetConnect()
    // nock.emitter.removeAllListeners()
    // nock.activate()
    // nock.enableNetConnect()
  })

  it('CustomHook test', async () => {
    const res = await fetchApiInfo()

    expect(res).toStrictEqual(mockData)

    const { result } = renderHook(() => useCustomHook(), { wrapper })

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => result.current.isSuccess)
    console.log(result.current.data, 'data', result.current.isLoading, result.current.isSuccess)
    // expect(result.current.data).toEqual(mockData)
  })
})
