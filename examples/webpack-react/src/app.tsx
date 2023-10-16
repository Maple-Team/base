import React, { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Button } from 'antd'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
})

const rootElement = document.getElementById('app')
const root = createRoot(rootElement!)

const Example3 = () => {
  const [num, setNum] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.debug(num)
    }, 1000)
    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [num])

  const onIncrease = useCallback(() => setNum((num) => num + 1), [])

  return (
    <div>
      {num}
      <Button onClick={onIncrease}>+</Button>
      测试-测试HMR国人测试
    </div>
  )
}
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Example1 />
      <Example2 /> */}
      <Example3 />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </StrictMode>
)
