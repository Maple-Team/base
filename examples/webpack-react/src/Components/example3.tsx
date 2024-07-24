// import { Dialog, Message } from '@liutsing/rc-components'
import { Button, message } from 'antd'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { IconParking } from '@/assets/svg-icons'
// FIXME 优化这个导入问题
import '@liutsing/rc-components/dist/index.css'

const Example3: React.FC<PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
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
    // Dialog.show({ title: '这是一个标题', content: '一大段的文本内容' })
  }, [])
  const onShowMessage = useCallback(() => {
    // Message.success('测试下')
  }, [])
  const plateNo = 'No.123'
  const price = '￥20W'
  const var1 = `车牌号: ${plateNo}, ${price}`
  const obj = {
    plateNo: '12323',
  }
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    message.success(
      {
        content: `车牌号: ${obj.plateNo}, ${price}`,
      },
      0
    )
  }, [obj.plateNo])

  return (
    <div {...rest}>
      {num}
      <Button onClick={onIncrease}>+</Button>
      <div>触发chunk content-hash change</div>
      <div>触发chunk content-hash change</div>
      <IconParking />
      <div onClick={onShowDialog}>显示Dialog</div>
      <div onClick={onShowMessage}>显示Message</div>
      <div>{var1}</div>
      {children}
    </div>
  )
}

export default Example3
