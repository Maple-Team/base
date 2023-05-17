import { renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { server } from '../setupTests'
import { createWrapper } from './utils'
import mockData from '@/mockData.json'
import { useCustomHook } from '@/hooks'

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
  // test('successful query component', async () => {
  //   const result = renderWithClient(<Example />)

  //   result.debug()
  //   const target = result.getByTestId('test-id')
  //   expect(target).toHaveTextContent('b01addd22b4fc007')
  // })
})
