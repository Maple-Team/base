// import { useQuery } from '@tanstack/react-query'
import { Button, Card, Input, Space } from 'antd'
// import axios from 'axios'
import { debounce } from 'lodash-es'
import type { ChangeEvent } from 'react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { IconParking } from '@/assets/svg-icons'

const Example4 = memo(() => {
  const [num, setNum] = useState<number>(0)
  // const { data } = useQuery(['fetchInfo'], () => axios.get('/api/auth/profile'))
  // const { data } = useQuery(['fetchInfo'], () => axios.get('/api/lzz/all'))
  // console.log('useQuery发起请求', data)
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

  const onIncrease = useMemo(
    () => debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  // working but with eslint error
  // React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _onIncrease2 = useCallback(
    debounce(() => setNum((num) => num + 1), 500, { leading: true, trailing: false }),
    []
  )
  const [value, setValue] = useState<string>()
  const [code, setCode] = useState<string>()

  // TODO 需要更新在输入完
  // 输入完需要清空已有的值
  const onChange = useMemo(() => {
    return debounce(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value) {
          console.log('xhr', value)
          setCode(value)
        }
        setValue(value)
        setTimeout(() => {
          setValue(undefined)
        }, 0)
      },
      300,
      { trailing: true }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // console.log('render', value)

  return (
    <div className="p-3">
      <Card>
        <Space>
          <span>当前状态：{num}</span>
          <Button onClick={onIncrease}>+</Button>
          <Button onClick={onIncrease}>测试自定义组件是否能注入data属性</Button>
          <IconParking />
        </Space>
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
      </Card>
      <Card title="扫码输入测试" className="mt-4">
        <span className="block">输入值: {code}</span>
        <Input onChange={onChange} autoFocus value={value} className="w-[200px]" />
      </Card>
    </div>
  )
})

export default Example4
