import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './main.css'
import './assets/svg-icons'
import Root from './routes/root'
import ErrorPage from './error-page'

import { RemoteControlCard } from './RemoteControl'
import { ReactQueryDemo } from './pages/ReactQuery'
import { ReactAmap } from './pages/ReactAmap'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/rc',
        element: <RemoteControlCard />,
      },
      {
        path: '/react-amap',
        element: <ReactAmap />,
      },
      {
        path: '/react-query',
        element: <ReactQueryDemo />,
      },
    ],
  },
])

const queryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        retry: false,
      },
    },
  })

const rootElement = document.getElementById('app')
const root = createRoot(rootElement!)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient()}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </StrictMode>
)
