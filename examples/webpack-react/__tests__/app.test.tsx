import { useCustomHook } from '@/pages/ReactQueryTest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import nock from 'nock'
import mockData from '@/mockData.json'
import axios from 'axios'

describe('react query test case', () => {
  // const queryClient = new QueryClient()
  // const wrapper = ({ children }: { children: ReactNode }) => (
  //   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  // )
  beforeEach(() => {
    // 模拟 HTTP 请求和响应
    nock('https://randomuser.me').get('/api').reply(200, mockData)
  })

  it('CustomHook test', async () => {
    return Promise.resolve(123)
    return axios.get('https://randomuser.me/api').then((res) => res.data)

    // const { result } = renderHook(() => useCustomHook(), { wrapper })

    // expect(result.current.isLoading).toBe(true)

    // await waitFor(() => {})

    // console.log(result.current.data, 'data', result.current.error)

    // // expect(result.current.data).toEqual(mockData)
    // expect(result.current.isLoading).toBe(false)
  })
  // describe('useFetchInfo test cases', () => {
  //   it('case 1', () => {
  //     //
  //   })
  // })
})
