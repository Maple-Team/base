import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { useQuery } from '@tanstack/react-query'
import { server } from '../setupTests'
import { createWrapper } from './utils'
import { fetchApiInfo, useFetchInfo } from '@/hooks'

export function useCustomHook2() {
  return useQuery(['customHook'], fetchApiInfo)
}

describe('useFetchInfo cases', () => {
  afterEach(() => {
    cleanup()
  })

  it('useFetchInfo test case 1', async () => {
    const { result } = renderHook(() => useFetchInfo(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isLoading).toBe(false)
    expect(result.current.seed).toBe('b01addd22b4fc007')
  })

  it('failure query hook', async () => {
    server.use(
      rest.get('*', (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    const { result } = renderHook(() => useFetchInfo(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.seed).toBe('')
    expect(result.current.isError).toBe(true)
  })
})
