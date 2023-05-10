import { Drawer } from '@liutsing/rc-components'
import { Button } from 'antd'
import React, { useCallback, useState } from 'react'

export default () => {
  // tailwindcss w-[200px]
  const [open, setOpen] = useState<boolean>(false)
  const onToggleOpen = useCallback(() => {
    setOpen((_) => !_)
  }, [])

  console.log(open, 'parent')

  return (
    <div className="relative h-full bg-gray-300 overflow-hidden">
      <Drawer
        direction="horizontal"
        contentWidth={200}
        position="left"
        topContentWrapperClassNames="translate-x-[calc(100%+8px)]"
        topContent={<div className="bg-green-300 rounded p-2">top extra</div>}
      >
        <div className="rounded bg-blue-300 h-full flex justify-center items-center flex-col">内容区域</div>
      </Drawer>

      <div className="flex justify-end bg-blue-300">
        <Button onClick={onToggleOpen}>折叠/收缩</Button>
      </div>
      <div className="relative w-[200px] ml-[400px] bg-green-200">
        <Drawer direction="vertical" position="top" contentWidth={200} drawerClassNames="" collapsed={open}>
          <div className="rounded bg-white h-full flex justify-center items-center flex-col">内容区域</div>
        </Drawer>
      </div>
    </div>
  )
}
