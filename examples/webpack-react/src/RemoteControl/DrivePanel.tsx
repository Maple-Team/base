import { sendRemoteCommand } from '@/hooks'
import { remoteCommandTypeEnum, remoteResultEnum } from '@/enums'
import { message } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { FunctionButton } from './FunctionButton'
import {
  FETCH_REMOTE_CONTROL_TIMEOUT,
  TIME_TO_NOT_USE_REALTIME_DATA,
  useRemoteControlResult,
  useVehicleRealtimeControlInfo,
} from './useRemoteControl'

const DrivePanel = () => {
  const vin = ''

  const commandIdRef = useRef<string>(null)
  // 远控结果
  const { result, noUsingRTdataTimeout, resetTimeout, resetFetchTimeout } = useRemoteControlResult(commandIdRef.current)
  // 实时数据
  const { drivingState, setDrivingCB } = useVehicleRealtimeControlInfo(noUsingRTdataTimeout, vin)

  const [drivingLoading, setDrivingLoading] = useState<boolean>()
  useEffect(() => {
    if (!result) return
    const { resultCode, resultMsg, commandType } = result.controlResultList[0]

    if (resultCode === remoteResultEnum.SUCCESS) {
      switch (commandType) {
        case remoteCommandTypeEnum.VEHICLE_CONTINUE:
          setDrivingCB((_) => !_)
          message.success('执行成功')
          break
        case remoteCommandTypeEnum.VEHICLE_STOP:
          setDrivingCB((_) => !_)
          message.success('执行成功')
          break
        default:
          break
      }
    } else {
      message.error(resultMsg)
    }
    setDrivingLoading(false)
  }, [result, setDrivingCB])

  const onDrivingChange = useCallback(
    async (checked: boolean) => {
      if (!vin) return
      resetTimeout(TIME_TO_NOT_USE_REALTIME_DATA)

      sendRemoteCommand({
        deviceType: '1',
        vin,
        instructionDtoList: [
          {
            commandType: checked ? remoteCommandTypeEnum.VEHICLE_CONTINUE : remoteCommandTypeEnum.VEHICLE_STOP,
            switchOrder: '1',
          },
        ],
      })
        .then((id) => {
          message.success('发送成功')
          resetFetchTimeout(FETCH_REMOTE_CONTROL_TIMEOUT)
          // @ts-ignore
          commandIdRef.current = id
          setDrivingLoading(true)
        })
        .catch(() => {
          setDrivingCB(false)
        })
    },
    [vin]
  )

  return (
    <div className="pt-[14px] pl-4 flex-1">
      <header className="text-lg border-0 border-b-[1px] pb-3 border-b-[rgba(0,0,0,0.1)] border-solid">紧急驻车</header>
      <div className="flex justify-between flex-wrap pt-3 pr-4">
        <FunctionButton
          name={drivingState ? '紧急驻车' : '恢复行驶'}
          checked={drivingState as boolean}
          type="drive"
          icon={drivingState ? 'icon-driving' : 'icon-parking'}
          onChange={onDrivingChange}
          loading={drivingLoading}
        />
      </div>
    </div>
  )
}

export default DrivePanel
