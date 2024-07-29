import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { debounce, throttle } from 'lodash-es'
import { Tiny } from '@ant-design/plots'

const socket = io(`${process.env.SOCKET_IO_URL!}/default`)

const GapArea = ({ data }: { data: number[] }) => {
  const modifyData = data.map((value, index) => ({ value, index }))

  const config = {
    data: modifyData,
    width: 480,
    height: 80,
    padding: 8,
    shapeField: 'smooth',
    xField: 'index',
    yField: 'value',
    style: {
      fill: '#d6e3fd',
      fillOpacity: 0.6,
    },
  }

  return <Tiny.Area {...config} data={[...modifyData]} />
}

interface Data {
  ts: number
  payload: { uuid: string }
}

const ThrottleDemo = () => {
  const [msg, setMsg] = useState<Data>()
  const [data, setData] = useState<number[]>([])

  const throttleFn = useMemo(() => {
    return throttle(
      (msg: Data) => {
        setMsg((m) => {
          if (msg?.payload.uuid === m?.payload.uuid) return m
          return msg
        })

        setData((prev) => {
          if (prev.length > 500) prev.shift()
          return [...prev, msg.ts]
        })
      },
      1000,
      { leading: true }
    )
  }, [])
  console.count('ThrottleDemo render time')
  useEffect(() => {
    function onMessage(msg: Data) {
      // console.log('[ Data ] >', msg, new Date().getTime())
      throttleFn(msg) // 相隔固定时间重新执行一次
    }
    socket.on('message', onMessage)
    return () => {
      socket.off('message', onMessage)
    }
  }, [throttleFn])

  return (
    <div>
      [throttle] time: {msg?.payload.uuid}
      <GapArea data={data} key={data.join('')} />
    </div>
  )
}

const DebounceDemo = () => {
  const [msg, setMsg] = useState<{ ts: number }>()

  const debounceFn = useMemo(() => {
    return debounce(
      (msg) => {
        console.log('throttle', msg)
        setMsg(msg)
      },
      1000,
      { trailing: true, leading: true }
      // trailing: true 只执行最后一次
      // leading: true 只执行第一次
    )
  }, [])
  useEffect(() => {
    function onMessage(msg: AnyToFix) {
      // console.log('2', msg)
      debounceFn(msg) //
    }
    socket.on('message', onMessage)
    return () => {
      socket.off('message', onMessage)
    }
  }, [debounceFn])

  return <div>[debounce] time: {msg?.ts}</div>
}
const SocketIOScenario = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [])
  return (
    <>
      <div>Socket is {isConnected ? 'connected' : 'disconnected'}</div>
      <ThrottleDemo />
      <DebounceDemo />
    </>
  )
}

export default SocketIOScenario
