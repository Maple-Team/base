import React, { Suspense, lazy, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Link, Outlet, Route, Routes, createBrowserRouter } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { StyleProvider } from '@ant-design/cssinjs'
import { ErrorBoundary } from './ErrorBoundary'
import Hooks from './pages/hooks'
import HooksLifecycle from './pages/hooks-lifecycle'
import i18n from '@/i18n'

// const RemoteApp = React.lazy(() => import('module_federation/App'))

const MarkerCluster = lazy(() => import(/* webpackChunkName: "markerCluster" */ './markerCluster'))
const Example3 = lazy(() => import(/* webpackChunkName: "example3" */ './Components/example3'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: false,
      refetchOnReconnect: true,
    },
  },
})
const Language = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-HK': '繁体中文',
}
type LanguageKey = keyof typeof Language
const existLocale = localStorage.getItem('language') as LanguageKey
// NOTE 测试多种方式注入的环境变量
// console.log(process.env.customArg, process.env.args2)

const Root = () => {
  const [lng, setLng] = useState<LanguageKey>(existLocale || 'zh-CN')
  const items: MenuProps['items'] = (Object.keys(Language) as LanguageKey[]).map((key) => {
    return {
      label: Language[key],
      key,
      onClick: () => {
        i18n.changeLanguage(key).catch(console.error)
        localStorage.setItem('language', key)
        setLng(key)
      },
    }
  })

  return (
    <div className="flex w-full" style={{ display: 'flex' }}>
      <aside className="w-[240px]">
        <ul className="p-0 px-2 capitalize m-0 h-full">
          <Link to="/example">
            <li className="nav-list">example3</li>
          </Link>
          <Link to="/example4">
            <li className="nav-list">example4</li>
          </Link>
          <Link to="/example5">
            <li className="nav-list">example5</li>
          </Link>
          <Link to="/socket.io">
            <li className="nav-list">socket.io</li>
          </Link>
          <Link to="/mc">
            <li className="nav-list">MarkerCluster</li>
          </Link>
          <Link to="/hooks">
            <li className="nav-list">Hooks</li>
          </Link>
          <Link to="/hooks-lifecycle">
            <li className="nav-list">Hooks-lifecycle</li>
          </Link>
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

const Example4 = lazy(() => import(/* webpackChunkName: "example4" */ '@/pages/example4'))
const Example5 = lazy(() => import(/* webpackChunkName: "example5" */ '@/pages/example5'))
const SocketIO = lazy(() => import(/* webpackChunkName: "example5" */ '@/pages/Socket.io'))

export const App = () => {
  return (
    // <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* <RouterProvider router={router} fallbackElement={<div>loading...</div>} /> */}
        <StyleProvider hashPriority="high">
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
                      <Example3>测试自定义组件</Example3>
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
                <Route
                  path="socket.io"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <SocketIO />
                    </Suspense>
                  }
                />
                <Route
                  path="hooks"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <Hooks />
                    </Suspense>
                  }
                />
                <Route
                  path="hooks-lifecycle"
                  element={
                    <Suspense fallback={<div>loading...</div>}>
                      <HooksLifecycle />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
          {/* <Suspense fallback={<Spin spinning />}>
            <RemoteApp />
          </Suspense> */}
        </StyleProvider>

        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </ErrorBoundary>
    // </StrictMode>
  )
}
