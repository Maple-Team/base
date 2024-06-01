import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import type { BaseResponse } from '@liutsing/types-utils'
import { debounce, throttle } from 'lodash-es'

const socket = io('http://localhost:4003/default')

const fetchData = (): Promise<BaseResponse<{ name: string }>> =>
  fetch('http://localhost:4003/api/lzz/all', {}).then((res) => res.json())

const ReactQueryDemo = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [msg, setMsg] = useState<{ ts: number }>()
  const debounceFn = useMemo(() => {
    return debounce(
      function (msg) {
        console.log('debounce', msg)
      },
      1000,
      { leading: true }
    )
  }, [])
  const throttleFn = useMemo(() => {
    return throttle(
      function (msg) {
        console.log('throttle', msg)
      },
      1000,
      { leading: true }
    )
  }, [])
  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message', (msg) => {
      setMsg(msg)
      // console.log('2', msg)
      debounceFn(msg) // 只执行开头的一次
      throttleFn(msg) // 相隔固定时间重新执行一次
    })
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])
  //   一定范围内
  // 每隔一定的间隔
  // -> 重复请求数据
  // console.count('render-count')
  const { data, isLoading, error } = useQuery({
    queryKey: ['fetchData'],
    queryFn: fetchData,
    staleTime: 30 * 1000,
    // staleTime: Infinity,
    gcTime: 3 * 1000,
    // gcTime: Infinity,
    refetchOnWindowFocus: false, // 切换屏幕working
  })
  // console.log(data?.data)

  if (isLoading) return <div>{isLoading}</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  return (
    <div>
      <div>Socket is {isConnected ? 'connected' : 'disconnected'}</div>
      <div>socket message time: {msg?.ts}</div>
      <div className="text-green-300">{JSON.stringify(data)}</div>
    </div>
  )
}

export default ReactQueryDemo
