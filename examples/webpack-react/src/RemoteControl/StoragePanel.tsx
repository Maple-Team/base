import { message } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FunctionButton } from './FunctionButton'
import {
  FETCH_REMOTE_CONTROL_TIMEOUT,
  TIME_TO_NOT_USE_REALTIME_DATA,
  useRemoteControlResult,
  useVehicleRealtimeControlInfo,
} from './useRemoteControl'
import { showMesage } from './utils'
import { remoteCommandTypeEnum, remoteResultEnum, vehicleDeviceSwitchStateEnum } from '@/enums'
import { sendRemoteCommand } from '@/hooks'

const StoragePanel = () => {
  const vin = ''

  const commandIdRef = useRef<string | null>(null)
  const { result, noUsingRTdataTimeout, resetTimeout, resetFetchTimeout } = useRemoteControlResult(commandIdRef.current)

  // 实时数据
  const { locker1, locker2, setLocker1CB, setLocker2CB } = useVehicleRealtimeControlInfo(noUsingRTdataTimeout, vin)

  /**
   * 等待远控结果loading
   */
  const [locker1Loading, setLocker1Loading] = useState<boolean>()
  const [locker2Loading, setLocker2Loading] = useState<boolean>()

  useEffect(() => {
    const handler = async () => {
      if (!result) return
      const { resultCode, resultMsg, commandType } = result.controlResultList[0]
      if (resultCode === remoteResultEnum.SUCCESS) {
        switch (commandType) {
          case remoteCommandTypeEnum.VEHICLE_LOCKER1:
            setLocker1CB((_: boolean) => !_)
            break
          case remoteCommandTypeEnum.VEHICLE_LOCKER2:
            setLocker2CB((_: boolean) => !_)
            break
          default:
            break
        }
        await message.success('执行成功')
      } else {
        await message.error(resultMsg)
      }
      // 有远控结果，loading状态重置，// NOTE 简单处理，同一时期只有一个loading
      setLocker1Loading(false)
      setLocker2Loading(false)
    }
    handler().catch(console.log)
  }, [result, setLocker1CB, setLocker2CB])

  const onLocker1Change = useCallback(
    (checked: boolean) => {
      if (!vin) return
      if (!checked) {
        showMesage('储物柜不支持远程关闭', 'info').catch(console.log)
        return
      }
      resetTimeout(TIME_TO_NOT_USE_REALTIME_DATA)

      sendRemoteCommand({
        deviceType: '1',
        vin,
        instructionDtoList: [
          {
            commandType: remoteCommandTypeEnum.VEHICLE_LOCKER1,
            switchOrder: checked ? vehicleDeviceSwitchStateEnum.OPEN : vehicleDeviceSwitchStateEnum.CLOSE,
          },
        ],
      })
        .then(async (id) => {
          resetFetchTimeout(FETCH_REMOTE_CONTROL_TIMEOUT)
          commandIdRef.current = id
          setLocker1Loading(true)
          await message.success('发送成功')
        })
        .catch(() => {
          setLocker1CB(false)
          // message.error(<MsgSendErr e={e} />)
        })
    },
    [resetFetchTimeout, resetTimeout, setLocker1CB]
  )

  const onLocker2Change = useCallback(
    (checked: boolean) => {
      if (!vin) return
      if (!checked) {
        showMesage('储物柜不支持远程关闭', 'info').catch(console.log)
        return
      }
      resetTimeout(TIME_TO_NOT_USE_REALTIME_DATA)

      sendRemoteCommand({
        deviceType: '1',
        vin,
        instructionDtoList: [
          {
            commandType: remoteCommandTypeEnum.VEHICLE_LOCKER2,
            switchOrder: checked ? vehicleDeviceSwitchStateEnum.OPEN : vehicleDeviceSwitchStateEnum.CLOSE,
          },
        ],
      })
        .then(async (id) => {
          resetFetchTimeout(FETCH_REMOTE_CONTROL_TIMEOUT)
          commandIdRef.current = id
          setLocker2Loading(true)
          await message.success('发送成功')
        })
        .catch(() => {
          setLocker2CB(false)
          // message.error(<MsgSendErr e={e} />)
        })
    },
    [resetFetchTimeout, resetTimeout, setLocker2CB]
  )

  return (
    <div className="pt-[14px] pl-4 flex-1">
      <header className="text-lg border-0 border-b-[1px] pb-3 border-b-[rgba(0,0,0,0.1)] border-solid">储物功能</header>
      <div className="flex justify-between flex-wrap pt-3 pr-4">
        <FunctionButton
          name="储物柜-锁1"
          loading={locker1Loading}
          checked={locker1 as boolean}
          type="storage"
          icon="icon-storage-locker"
          onChange={onLocker1Change}
        />
        <FunctionButton
          name="储物柜-锁2"
          loading={locker2Loading}
          checked={locker2 as boolean}
          type="storage"
          icon="icon-storage-locker"
          onChange={onLocker2Change}
        />
      </div>
    </div>
  )
}

export default StoragePanel
