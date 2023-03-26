import { Icon, IconClose } from '@/Components'
import { RemotePanelType } from '@liutsing/types-utils'
import { Empty, Skeleton, Timeline } from 'antd'
import React, { Suspense, useCallback, useState, ElementType, memo, lazy, useEffect } from 'react'
import { DividerLine } from './DividerLine'
import { useWebSocket } from './useRemoteControl'
// @ts-ignore
import styles from './style.module.less'

interface ItemProps {
  name: string
  icon?: string
  checked?: boolean
  type?: 'divider'
  code?: RemotePanelType
  onClick?: (code: RemotePanelType) => void
  children?: ElementType
}
const AlarmPanel = lazy(() => import('./AlarmPanel'))
const StoragePanel = lazy(() => import('./StoragePanel'))
const DrivePanel = lazy(() => import('./DrivePanel'))

const TabItem = memo(({ name, icon, checked, type, code, onClick, children: _children }: ItemProps) => {
  if (type === 'divider') {
    return (
      <div className="px-4 mb-4">
        <DividerLine />
      </div>
    )
  }
  return (
    <div
      className={`${
        checked ? 'bg-[#D6E2FF] text-[#2766FF]' : 'bg-transparent text-[#000000A6]'
      } flex items-center pt-[5px] pb-[3px] px-4 mb-4 cursor-pointer first:mt-4`}
      onClick={() => onClick?.(code!)}
    >
      <Icon
        name={checked ? `${icon}-on` : `${icon}-off`}
        className="w-[20px] h-[20px]"
      />
      <span className="ml-3">{name}</span>
    </div>
  )
})

const CircleDot = () => (
  <i className="inline-block w-4 h-4 border-[2px] border-solid rounded-lg border-[#C8CACD] bg-transparent" />
)
export const RemoteControlCard = memo(() => {
  const vin = 'TESTVIN111111'

  useWebSocket(`/ws/patrol/vehicle?vin=${vin}`)
  useWebSocket(`/ws/patrol/common?vin=${vin}`)

  const items: ItemProps[] = [
    { icon: 'icon-rc-alarm', name: '警用设备', checked: true, code: 'alarm', children: AlarmPanel },
    { icon: 'icon-rc-storage', name: '储物设备', checked: false, code: 'storage', children: StoragePanel },
    { type: 'divider', name: 'divider2', code: 'divider' },
    { icon: 'icon-rc-drive', name: '自动驾驶', checked: false, code: 'drive', children: DrivePanel },
  ]
  const [currentPanelType, setCurrentPanelType] = useState<RemotePanelType>('alarm')
  const handleClick = useCallback((type: RemotePanelType) => {
    setCurrentPanelType(type)
  }, [])
  const Component: ElementType | undefined = items.find(({ code }) => code === currentPanelType)?.children
  const [showProgress, setProgress] = useState<boolean>(false) // TODO 待下期需求

  return (
    //  w-[669px] h-[637px]
    <div
      className={`${styles.container} absolute rounded top-0
      transition-all duration-500 ease-in will-change-transform`}
    >
      <header className="justify-between flex items-center px-4 pt-[11px] pb-[10px] border-0 border-b-[1px] border-solid border-[#0000001A]">
        <span
          className="font-ph65 text-lg"
          onClick={() => {
            setProgress(false)
          }}
        >
          车辆远控
        </span>
        <IconClose />
      </header>
      <div
        className={`${
          showProgress ? 'w-[672px]' : ' w-[426px]'
        } flex  transition-all duration-500 ease-in will-change-auto pb-3`} // !h-[489px]
      >
        <div className="w-[130px] border-0 border-r-[1px] border-solid border-[#DDDDDD] relative z-20">
          {items.map((item) => (
            <TabItem
              {...item}
              key={item.name}
              onClick={handleClick}
              checked={item.code === currentPanelType}
            />
          ))}
        </div>
        {!Component ? (
          <Empty />
        ) : (
          <>
            <Suspense
              fallback={
                <div className="flex flex-col items-center w-full pt-[14px] px-4 max-w-[302px] h-[489px] box-border">
                  <Skeleton
                    paragraph={{ rows: 5 }}
                    active
                  />
                </div>
              }
            >
              <Component />
            </Suspense>
            {showProgress && ( // NOTE 下发进度条
              <div
                className={`h-full w-[243px] border-0 border-l-[1px] border-l-[#D2D3D5] border-solid
              will-change-transform transition-all duration-300 ease-in
              `}
              >
                <div className="pt-[14px] pl-4 flex-1 relative">
                  <header className="text-lg border-0 mb-5 border-b-[1px] pb-3 border-b-[rgba(0,0,0,0.1)] border-solid">
                    执行详情
                  </header>
                  <Timeline>
                    <Timeline.Item
                      color="#C8CACD"
                      dot={<CircleDot />}
                    >
                      <div className="pb-[88px]">平台发送：待执行</div>
                    </Timeline.Item>
                    <Timeline.Item
                      color="#C8CACD"
                      dot={<CircleDot />}
                    >
                      <div className="pb-[88px]">车辆接收:待执行</div>
                    </Timeline.Item>
                    <Timeline.Item color="#C8CACD">
                      <div className="pb-[88px]">车辆下载:待执行</div>
                    </Timeline.Item>
                    <Timeline.Item color="#C8CACD">
                      <div className="pb-[28px]">车辆执行:待执行</div>
                    </Timeline.Item>
                  </Timeline>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
})
