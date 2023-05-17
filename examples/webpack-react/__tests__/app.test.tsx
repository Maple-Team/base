import nock from 'nock'
import axios from 'axios'
import mockData from '@/mockData.json'

// import https from 'node:https'
// const agent = new https.Agent({
//   rejectUnauthorized: false,
// })

describe('react query test case', () => {
  // const queryClient = new QueryClient()
  // const wrapper = ({ children }: { children: ReactNode }) => (
  //   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  // )
  beforeEach(() => {
    // nock.disableNetConnect()
  })

  afterEach(() => {
    // nock.restore()
    // nock.cleanAll()
    // nock.enableNetConnect()
    // nock.emitter.removeAllListeners()
    // nock.activate()
    // nock.enableNetConnect()
  })

  it('CustomHook test', async () => {
    const scope = nock('https://randomuser.me', {
      reqheaders: {
        Origin: 'http://localhost',
      },
    })
      .get('/api')
      .reply(200, mockData, {
        'Access-Control-Allow-Origin': 'http://localhost',
      })

    const res = await axios
      .get('https://randomuser.me/api', {
        // httpsAgent: agent,
      })
      .then((res) => res.data)
    console.log(res)
    expect(res).toStrictEqual(mockData)

    // const { result } = renderHook(() => useCustomHook(), { wrapper })
    // expect(result.current.isLoading).toBe(true)
    // await waitFor(() => {})
    // console.log(result.current.data, 'data', result.current.error)
    // expect(result.current.data).toEqual(mockData)
    // expect(result.current.isLoading).toBe(false)
    scope.done()
  })
  // describe('useFetchInfo test cases', () => {
  //   it('case 1', () => {
  //     //
  //   })
  // })
})
