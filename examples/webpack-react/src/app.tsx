import React, { StrictMode, useCallback, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Button } from 'antd'
import { IconParking } from '@/assets/svg-icons'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
})
// NOTE 热加载不能是入口模块!!!!
const Example3 = () => {
  const [num, setNum] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(num)
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
      测试 准备一下
      <IconParking />
      哈哈 123
    </div>
  )
}
export const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        {/* <Example1 />
    <Example2 /> */}
        <Example3 />
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </StrictMode>
  )
}
