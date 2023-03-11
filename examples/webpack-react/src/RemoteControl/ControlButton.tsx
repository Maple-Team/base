import React, { useCallback, useState, memo } from 'react'
import { Icon } from '@/components'
import { RemoteControlCard } from './RemoteCard'

/**
 * 车辆远控按钮
 *
 * 数据来源：车辆实况数据ws，单次指令数据ws，轮询结果数据http
 * @returns
 */
export const VehicleControlButton = memo(({ distance }: { distance: number }) => {
  const [panelVisible, setPanelVisible] = useState<boolean>(false)
  const onPaneVisibleChange = useCallback(() => setPanelVisible((visible) => !visible), [])
  const onClosePanel = useCallback(() => {
    setPanelVisible(false)
  }, [])
  // NOTE tailwind-css static analysis ['left-[322px]', 'left-[16px]']
  return (
    <div
      className={`z-[999] absolute rounded-lg bg-white flex items-center bottom-4 left-[${distance}px] transition-all duration-300 ease-in will-change-transform`}
    >
      <div
        className="flex flex-col items-center pb-[11px] cursor-pointer"
        onClick={onPaneVisibleChange}
      >
        <Icon
          name="icon-car"
          className="w-[64px] h-[64px]"
        />
        <span className="font-ph65 text-xs">车辆远控</span>
      </div>
      <Icon
        name={panelVisible ? 'icon-fold-right' : 'icon-fold-left'}
        className="w-[14px] h-[16px] cursor-pointer"
        onClick={onPaneVisibleChange}
      />
      {panelVisible && <RemoteControlCard onClosePanel={onClosePanel} />}
    </div>
  )
})
