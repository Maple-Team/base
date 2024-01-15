import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sleep, uuid } from '@liutsing/utils'

const fetchTest = async (id: string | null) => {
  await sleep(100)
  return `${id}_${Math.random()}`
}

const _useCountDown = () => {
  const [t, setT] = useState<number>()

  useEffect(() => {
    const id = setInterval(() => {
      setT(new Date().getTime())
    }, 1000)

    return () => {
      id && clearInterval(id)
    }
  }, [])
  return t
}
// 组件重新渲染时会读取最新的ref的值，同时ref会保持值在多次渲染之间不变
export const RefExample = () => {
  const idRef = useRef<string | null>(null)
  const [num, setNum] = useState<number>(0)
  const [num1, setNum1] = useState<number>(0)
  // const time = useCountDown()

  const { data } = useQuery(['fetch', idRef.current], () => fetchTest(idRef.current), {
    enabled: !!idRef.current,
    keepPreviousData: true,
  })

  const onChange = useCallback(() => {
    // idRef的值改变了但是没有触发重新render
    idRef.current = uuid()
    setNum((n) => n + 1)
    setNum1((n) => n + 1)
  }, [])

  console.count('render') // 点击change更新两次

  return (
    <div>
      <div>render content: {data}</div>
      <p>
        {/* {time} */}
        {num1}-{num}
      </p>
      <button onClick={onChange}>change id</button>
    </div>
  )
}
