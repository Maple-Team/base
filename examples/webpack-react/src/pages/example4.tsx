import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import axios from 'axios'
import type { DebouncedFuncLeading } from 'lodash'
import { debounce } from 'lodash'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { IconParking } from '@/assets/svg-icons'

const Example4 = memo(() => {
  const [num, setNum] = useState<number>(0)
  // const { data } = useQuery(['fetchInfo'], () => axios.get('/api/auth/profile'))
  const { data } = useQuery(['fetchInfo'], () => axios.get('/api/lzz/all'))
  console.log('useQuery发起请求', data)
  // const { mutate } = useMutation(['directives'], (data) => axios.post('/api/directives', data))
  // useEffect(() => {
  //   mutate(
  //     // @ts-expect-error: xx
  //     { message: '', address: '' },
  //     {
  //       onSuccess(data) {
  //         console.log(data)
  //       },
  //     }
  //   )
  // }, [mutate])
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log(num)
  //   }, 1000)
  //   return () => {
  //     intervalId && clearInterval(intervalId)
  //   }
  // }, [num])

  const onIncrease = useMemo<DebouncedFuncLeading<() => void>>(
    () => debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  // working but with eslint error
  // React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _onIncrease2 = useCallback<DebouncedFuncLeading<() => void>>(
    debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  return (
    <div>
      当前状态：{num}
      <Button onClick={onIncrease}>+</Button>
      <IconParking />
      <div>
        <header>字体测试</header>
        <hr />
        <div className="local-ttf w-fit bg-green-500">
          {/* 魑魅魍魉 */}
          文言文字形对比
        </div>
        <div className="font-ph55  w-fit bg-red-500">
          {/* 魑魅魍魉 */}
          文言文字形对比
        </div>
      </div>
    </div>
  )
})

export default Example4
