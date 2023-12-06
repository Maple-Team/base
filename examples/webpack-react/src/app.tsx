import React, { StrictMode, useCallback, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Button } from 'antd'
import { Dialog } from '@liutsing/rc-components'
import '@liutsing/rc-components/dist/index.css'
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
  const onShowDialog = useCallback(() => {
    Dialog.show({ title: '这是一个标题', content: '一大段的文本内容' })
  }, [])

  return (
    <div>
      {num}
      <Button onClick={onIncrease}>+</Button>
      测试字体文本
      <IconParking />
      <div onClick={onShowDialog}>显示弹窗</div>
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
        {/* <MarkerCluster /> */}
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </StrictMode>
  )
}
