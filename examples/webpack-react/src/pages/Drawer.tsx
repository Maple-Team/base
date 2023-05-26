import { Drawer } from '@liutsing/rc-components'
import React from 'react'

const DrawerPage = () => {
  // tailwindcss w-[200px]

  return (
    <div className="relative h-full bg-gray-300 overflow-hidden">
      <Drawer
        contentWidth={200}
        position="left"
        topContentWrapperClassNames="translate-x-[calc(100%+8px)]"
        topContent={<div className="bg-green-300 rounded p-2">top extra</div>}
      >
        <div className="rounded bg-blue-300 h-full flex justify-center items-center flex-col">内容区域</div>
      </Drawer>
    </div>
  )
}

export default DrawerPage
