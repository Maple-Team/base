import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../setupTests'
import { createWrapper } from './utils'
import { useCustomHook } from '@/hooks'
import mockData from '@/mockData.json'

describe('useCustomHook test cases', () => {
  afterEach(() => {
    cleanup()
  })

  it('useCustomHook test case 1', async () => {
    const { result } = renderHook(() => useCustomHook(), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
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
})
