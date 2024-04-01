import React, { StrictMode, Suspense, lazy, memo, useCallback, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Link, Outlet, Route, Routes, createBrowserRouter } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Space } from 'antd'
import { debounce } from 'lodash-es'
import type { DebouncedFuncLeading } from 'lodash'
import axios from 'axios'
import { GlobalOutlined } from '@ant-design/icons'
import { ErrorBoundary } from './ErrorBoundary'
import { IconParking } from '@/assets/svg-icons'
import i18n from '@/i18n'

// const RemoteApp = React.lazy(() => import('module_federation/App'))

const MarkerCluster = lazy(() => import(/* webpackChunkName: "markerCluster" */ './markerCluster'))
const Example3 = lazy(() => import(/* webpackChunkName: "example3" */ './Components/example3'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
})
const Language = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-HK': '繁体中文',
}
type LanguageKey = keyof typeof Language
const Root = () => {
  const [lng, setLng] = useState<LanguageKey>('zh-CN')

  const items: MenuProps['items'] = (Object.keys(Language) as LanguageKey[]).map((key) => {
    return {
      label: Language[key],
      key,
      onClick: () => {
        i18n.changeLanguage(key).catch(console.error)
        setLng(key)
      },
    }
  })

  return (
    <div className="flex w-full" style={{ display: 'flex' }}>
      <aside className="w-[240px]" style={{ width: 240 }}>
        <ul>
          <li>
            <Link to="/example">example3</Link>
          </li>
          <li>
            <Link to="/example4">example4</Link>
          </li>
          <li>
            <Link to="/example5">example5</Link>
          </li>
          <li>
            <Link to="/mc">MarkerCluster</Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1" style={{ paddingLeft: 24, paddingTop: 0, flex: 1 }}>
        <div className="h-12 flex justify-between items-center px-5">
          <i />
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <GlobalOutlined />
                {Language[lng]}
              </Space>
            </a>
          </Dropdown>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
// https://reactrouter.com/en/main/route/error-element
const _router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/mc',
        element: (
          <Suspense fallback={<div>loading...</div>}>
            <MarkerCluster />
          </Suspense>
        ),
        errorElement: <div>error</div>,
      },
      {
        path: '/example',
        errorElement: <div>error</div>,
        element: (
          <Suspense fallback={<div>loading...</div>}>
            <Example3 />
          </Suspense>
        ),
      },
    ],
  },
])
// https://hacker-news.firebaseio.com/v0/item/8863.json?print=pretty
// https://api.publicapis.org/entries

const Example4 = memo(() => {
  const [num, setNum] = useState<number>(0)
  // const { data } = useQuery(['fetchInfo'], () => axios.get('/api/auth/profile'))
  const { data } = useQuery(['fetchInfo'], () => axios.get('/api/lzz/all'))
  console.log('useQuery发起请求', data)
  // const { mutate } = useMutation(['directives'], (data) => axios.post('/api/directives', data))
  // useEffect(() => {
  //   mutate(
  //     // @ts-expect-error: xx
  //     { message: '', address: '' },
  //     {
  //       onSuccess(data) {
  //         console.log(data)
  //       },
  //     }
  //   )
  // }, [mutate])
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log(num)
  //   }, 1000)
  //   return () => {
  //     intervalId && clearInterval(intervalId)
  //   }
  // }, [num])

  const onIncrease = useMemo<DebouncedFuncLeading<() => void>>(
    () => debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  // working but with eslint error
  // React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _onIncrease2 = useCallback<DebouncedFuncLeading<() => void>>(
    debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  return (
    <div>
      当前状态：{num}
      <Button onClick={onIncrease}>+</Button>
      <IconParking />
      <div>
        <header>字体测试</header>
        <hr />
        <div className="local-ttf w-fit bg-green-500">
          {/* 魑魅魍魉 */}
          文言文字形对比
        </div>
        <div className="font-ph55  w-fit bg-red-500">
          {/* 魑魅魍魉 */}
          文言文字形对比
        </div>
      </div>
    </div>
  )
})

const fetchData = async () => {
  // 模拟异步请求
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { message: 'Hello, React Query!' }
}
const Example5 = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['exampleQueryKey'], fetchData)

  const handleUpdateData = () => {
    const newData = { message: 'Updated Data!' }
    queryClient.setQueryData(['exampleQueryKey'], newData)
  }

  return (
    <div>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          <p>{data?.message}</p>
          <button onClick={handleUpdateData}>Update Data</button>
        </div>
      )}
    </div>
  )
}

export const App = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          {/* <RouterProvider router={router} fallbackElement={<div>loading...</div>} /> */}
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Root />}>
                <Route
                  path="mc"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <MarkerCluster />
                    </Suspense>
                  }
                />
                <Route
                  path="example"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <Example3 />
                    </Suspense>
                  }
                />
                <Route
                  path="example4"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <Example4 />
                    </Suspense>
                  }
                />
                <Route
                  path="example5"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <Example5 />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
          {/* <Suspense fallback={<Spin spinning />}>
            <RemoteApp />
          </Suspense> */}
          <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}
