import React, { StrictMode, Suspense, lazy, useCallback, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Link, Outlet, Route, Routes, createBrowserRouter } from 'react-router-dom'
import { Button } from 'antd'
import ReactDOM from 'react-dom/client'
import { debounce } from 'lodash-es'
import { ErrorBoundary } from './ErrorBoundary'
import { IconParking } from '@/assets/svg-icons'
import './main.css'

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
const Root = () => {
  return (
    <div className="flex w-full" style={{ display: 'flex' }}>
      <aside className="w-[240px]" style={{ width: 240 }}>
        <ul>
          <li>
            <Link to="/example">example3</Link>
          </li>
          <li>
            <Link to="/mc">MarkerCluster</Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1" style={{ paddingLeft: 24, paddingTop: 24, flex: 1 }}>
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
const Example4 = () => {
  const [num, setNum] = useState<number>(0)

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log(num)
  //   }, 1000)
  //   return () => {
  //     intervalId && clearInterval(intervalId)
  //   }
  // }, [num])

  const onIncrease = debounce(
    useCallback(() => setNum((num) => num + 1), []),
    500 * 10,
    { leading: true }
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
}
// const RemoteApp = React.lazy(() => import('module_federation/App'))

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
              </Route>
            </Routes>
          </BrowserRouter>
          <Example4 />
          {/* <Suspense fallback={<Spin spinning />}>
            <RemoteApp />
          </Suspense> */}
          <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}
ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(<App />)
