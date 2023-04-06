import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './main.css'
import './assets/svg-icons'
import Root from './routes/root'
import ErrorPage from './error-page'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
        path: '/react-query',
        element: <ReactQueryDemo />,
      },
      {
        path: '/react-amap',
        element: <ReactAmap />,
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
