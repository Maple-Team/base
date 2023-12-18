import React, { useCallback, useRef, useState } from 'react'
import { throttle } from 'lodash-es'
import { useSocket } from './useSocket'

function defaultShouldUpdate<T>(a: T, b: T) {
  return !Object.is(a, b)
}

/**
 * 双指针法？
 * @param num
 * @returns
 */
function usePrevious2<T>(num: T, cb?: (a?: T, b?: T) => boolean) {
  if (!cb) cb = defaultShouldUpdate

  const prevRef = useRef<T>()
  const currRef = useRef<T>()
  if (cb(currRef.current, num)) {
    prevRef.current = currRef.current
    currRef.current = num
  }

  return prevRef.current
}

const SocketIO = () => {
  const [num, setNum] = useState<number>(0)
  const prevNum = usePrevious2(num)

  const updateNum = useCallback((num: number) => {
    setNum(num)
  }, [])

  const throttleUpdate = throttle(updateNum, 500)

  useSocket((e) => {
    throttleUpdate(e.ts)
  }, 'http://localhost:4003/default')

  return (
    <div>
      <h1>SocketIO test page</h1>
      <div>
        <span>previous time: </span>
        <span>{prevNum}</span>
      </div>
      <div>
        <span>current time: </span>
        <span>{num}</span>
      </div>
      <div>gap: {num - (prevNum || 0)}</div>
    </div>
  )
}

export default SocketIO
