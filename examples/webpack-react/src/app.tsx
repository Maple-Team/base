import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Example from './pages/ReactQueryTest'

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
      <Example />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </StrictMode>
)
