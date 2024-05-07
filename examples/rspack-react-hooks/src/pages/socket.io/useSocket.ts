import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

type ServerToClientEvents = AnyToFix
type ClientToServerEvents = AnyToFix

export const useSocket = (onMessage: (e: AnyToFix) => void, url?: string | null) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
  const [wsReady, setWsReady] = useState<boolean>()

  useEffect(() => {
    if (wsReady || !url) return

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url, {
      closeOnBeforeunload: true,
    }) // 转发

    socket.on('connect', () => {
      console.log(`socket.io on ${url} conencted!`)
      setWsReady(true)
      socket.on('message', onMessage)
      socket.on('disconnect', () => {
        // TODO 提示?
      })
      socketRef.current = socket
    })
  }, [onMessage, wsReady, url])

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect()
      console.log('useSocket unmounted')
    }
  }, [])

  // console.log(wsReady, socketRef.current?.id)

  return {
    socket: socketRef.current,
    ready: wsReady,
  }
}
