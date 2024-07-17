import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, Space } from 'antd'
import { io } from 'socket.io-client'
import { useHooks } from './useHooks'

const socket = io('http://localhost:4003/default')

export const ChildComponent = memo(({ id }: { id?: string }) => {
  const [isStopped, setStopped] = useState<boolean>()
  console.log('child id: ', id, isStopped)

  // ws 更新状态
  useEffect(() => {
    function handler(status: boolean) {
      console.log('收到socket.io stopStatus消息', status)
      setStopped(status)
    }
    socket.on('stopStatus', handler)
    return () => {
      socket.off('stopStatus', handler)
    }
  }, [])

  useEffect(() => {
    function handler() {
      console.log('socket.io connect')
      socket.send('hello server')
    }
    socket.on('connect', handler)
    return () => {
      socket.off('connect', handler)
    }
  }, [])
  useEffect(() => {
    function handler(msg: string) {
      console.log(msg)
    }
    socket.on('message', handler)
    return () => {
      socket.off('message', handler)
    }
  }, [])

  useEffect(() => {
    console.log('child mounted')

    return () => {
      console.log('child unmounted')
    }
  }, [])

  // NOTE 先按顺序执行effect body里面的代码
  // 然后再按顺序执行return里面的代码
  // hooks里面的hook代码的执行顺序也是一致的
  // effect之间的顺序则是与其所在的代码位置保持一致
  useEffect(() => {
    console.log('child useEffect')
    setStopped(undefined)
    return () => {
      console.log('child useEffect cleanup')
    }
  }, [id])

  // NOTE 内部状态会保持
  useHooks(id, isStopped)

  const onSendStop = useCallback(() => {
    if (isStopped || !id) return
    console.log('send stop command')
    socket.emit('stopCmd')
  }, [id, isStopped])

  const onSendUnStop = useCallback(() => {
    if (!isStopped || !id) return
    console.log('send un stop command')
    socket.emit('unStopCmd')
  }, [id, isStopped])

  return (
    <div>
      <div>
        <span>current id: {id}</span>
      </div>
      <Space>
        <Button onClick={onSendStop}>stop</Button>
        <Button onClick={onSendUnStop}>unstop</Button>
      </Space>
    </div>
  )
})
