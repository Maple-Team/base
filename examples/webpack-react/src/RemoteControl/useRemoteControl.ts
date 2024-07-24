import type { DeviceStatusData, DriveData, RemoteControlResult, VehicleResult } from '@liutsing/types-utils'
import { useInterval } from 'ahooks'
import type { SetStateAction } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { emitter } from '@/events'
import { useFetchCommandResult } from '@/hooks'
import { vehicleDeviceSwitchStateEnum } from '@/enums'

/**
 * 基于commandId的倒计时
 * @param commandId
 * @param timeout
 * @returns
 */
const useCountdown = (commandId: string | null | undefined, timeout: number) => {
  const [num, setNum] = useState(0)

  useInterval(() => {
    if (!commandId) return
    setNum((t) => Math.max(t - 1, 0)) // 倒计时到0为止
  }, 1000)

  useEffect(() => {
    if (commandId) {
      // 有新的远控任务时，重置commandId对应的⏲
      console.debug('倒计时重置', timeout)
      setNum(timeout)
    }
  }, [commandId, timeout])

  // console.log(`=====倒计时: ${num}/${timeout}`, commandId)

  const reset = useCallback((num: number) => {
    setNum(num)
  }, [])

  return { timeout: num, reset }
}

/**
 * 主动轮询远控结果
 */
export const FETCH_REMOTE_CONTROL_TIMEOUT = 65
/**
 * NOTE 为避免远控结果过来后的闪动，需要维持若干秒远控结果的状态，在这一时间段里面不使用实时状态的数据
 */
export const TIME_TO_NOT_USE_REALTIME_DATA = 10
/**
 * 获取车辆实时数据的Hook
 * @returns
 */
export const useVehicleRtInfo = (vin?: string) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleResult>()
  // const { data, isSuccess } = useLatestVehicleResultQuery(vin)

  // useEffect(() => {
  //   if (isSuccess && vin === data.vin) {
  //     setVehicleInfo(data)
  //   }
  // }, [isSuccess, data, vin])

  useEffect(() => {
    const handler = (result: VehicleResult) => {
      if (vin === result.vin) setVehicleInfo(result)
    }

    emitter.on('rtStatus', handler)
    return () => {
      emitter.off('rtStatus', handler)
    }
  }, [vin])

  return vehicleInfo
}
/**
 * 根据commandId获取对应的远控结果
 * @param commandID 命令ID
 * @returns
 */
export const useRemoteControlResult = (commandID?: string | null) => {
  const [result, setResult] = useState<RemoteControlResult>()
  const [hasWSData, setHasWSData] = useState<boolean>()
  /**
   * 是否到时间去主动拉取远控状态
   */
  const { timeout: fetchTimeout, reset: resetFetchTimeout } = useCountdown(commandID, FETCH_REMOTE_CONTROL_TIMEOUT)

  useEffect(() => {
    if (commandID) {
      // 重置状态
      setHasWSData(false)
    }
  }, [commandID])

  /**
   * 倒计时结束发送xhr请求
   */
  const { isError, isSuccess, data } = useFetchCommandResult(fetchTimeout, commandID)

  // 等待ws数据推送
  useEffect(() => {
    const handler = (info: RemoteControlResult) => {
      if (info.commandId === commandID) {
        setResult(info)
        console.log('远控结果: ws')
        // 有了ws数据的话，则不再使用xhr数据
        setHasWSData(true)
      }
    }
    emitter.on('remoteControlResult', handler)
    return () => {
      emitter.off('remoteControlResult', handler)
    }
  }, [commandID])

  // 等待xhr数据返回, 有ws数据的话，则不再使用xhr数据
  useEffect(() => {
    // @ts-expect-error: 忽略不处理
    if (isSuccess && commandID === data?.commandId) {
      console.debug('获取到xhr远控结果')
      resetFetchTimeout(FETCH_REMOTE_CONTROL_TIMEOUT)
      if (!hasWSData) {
        // @ts-expect-error: 忽略不处理
        setResult(data)
        console.log('远控结果: xhr')
      }
    }
  }, [isSuccess, commandID, data, hasWSData, resetFetchTimeout])
  /**
   *  有commandId时才开始倒计时
   *  远控下发命令的10s内不使用实况数据
   */
  const { timeout: noUsingRTdataTimeout, reset: resetTimeout } = useCountdown(commandID, TIME_TO_NOT_USE_REALTIME_DATA)

  return { result, isError, isSuccess, noUsingRTdataTimeout, resetTimeout, resetFetchTimeout }
}
/**
 * 车辆实时远控状态
 *
 * 远控结果竞态数据
 * @param vin
 */
export const useVehicleRealtimeControlInfo = (noUsingRTdataTimeout: number, vin?: string) => {
  const [strongLight, setStrongLight] = useState<SetStateAction<boolean> | boolean>()
  const [alarmLight, setAlarmLight] = useState<SetStateAction<boolean> | boolean>()
  const [alarmRing, setAlarmRing] = useState<SetStateAction<boolean> | boolean>()
  const [locker1, setLocker1] = useState<SetStateAction<boolean> | boolean>()
  const [locker2, setLocker2] = useState<SetStateAction<boolean> | boolean>()
  const [audioFile, setAudioFile] = useState<string>()
  const [videoFile, setVideoFile] = useState<string>()
  const [imageFile, setImageFile] = useState<string>()
  // const [remoteCall, setRemoteCall] = useState<string>()

  const [drivingState, setDrivingState] = useState<SetStateAction<boolean> | boolean>()
  const rtVehicleInfo = useVehicleRtInfo(vin)

  useEffect(() => {
    if (!(noUsingRTdataTimeout === 0)) {
      console.debug('不使用实况数据', noUsingRTdataTimeout)
      return
    }
    if (!rtVehicleInfo) return
    // console.debug('使用实况数据', rtVehicleInfo.deviceStatusData.majorLight, noUsingRTdataTimeout)
    const driveData: DriveData | undefined = rtVehicleInfo?.driveData
    const deviceStatusData: DeviceStatusData | undefined = rtVehicleInfo?.deviceStatusData

    if (driveData) {
      const drivingState = driveData.drivingState
      // 只有在行驶中（4） 和 ARRIVING（5）  WATCHING（6）的时候， 才能**紧急驻车**   其他状态的置灰，按钮不可用
      // 只有在PAUSED: 停车8状态下，才能恢复行驶
      switch (drivingState) {
        case 1:
        case 2:
        case 3:
        case 9:
        case 10:
          setDrivingState(undefined)
          break
        case 8:
          setDrivingState(false)
          break
        case 4:
        case 5:
        case 6:
          setDrivingState(true)
          break
        default:
          break
      }
    }
    if (deviceStatusData) {
      const openState = vehicleDeviceSwitchStateEnum.OPEN.toString()
      const strongLight = deviceStatusData.majorLight

      setStrongLight(strongLight?.toString() === openState)
      const alarmRing = deviceStatusData.alarmWhistle
      setAlarmRing(alarmRing?.toString() === openState)
      const alarmLight = deviceStatusData.warningLamp
      setAlarmLight(alarmLight?.toString() === openState)
      const locker1 = deviceStatusData.locker1
      setLocker1(locker1?.toString() === openState)
      const locker2 = deviceStatusData.locker2
      setLocker2(locker2?.toString() === openState)
      setAudioFile(deviceStatusData.audioSerial)
      setVideoFile(deviceStatusData.videoSerial)
      setImageFile(deviceStatusData.pictureSerial)
      // setRemoteCall(deviceStatusData.remoteCall)
    }
  }, [rtVehicleInfo, noUsingRTdataTimeout])

  const setStrongLightCB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setStrongLight(bool)
  }, [])
  const setAlarmLightCB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setAlarmLight(bool)
  }, [])
  const setAlarmRingCB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setAlarmRing(bool)
  }, [])
  const setLocker1CB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setLocker1(bool)
  }, [])
  const setLocker2CB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setLocker2(bool)
  }, [])
  const setDrivingCB = useCallback((bool: SetStateAction<boolean> | boolean) => {
    setDrivingState(bool)
  }, [])

  return {
    locker1,
    locker2,
    strongLight,
    alarmLight,
    alarmRing,

    audioFile,
    videoFile,
    imageFile,
    // remoteCall,

    setStrongLightCB,
    setAlarmLightCB,
    setAlarmRingCB,
    setLocker1CB,
    setLocker2CB,

    drivingState,
    setDrivingCB,
  }
}
interface WebSocketMsg {
  data: string
  vin: string
  msgType: 'rsStatus' | 'remoteControl'
}
export const useWebSocket = (url: string) => {
  const WS_URL = process.env.WS_URL!
  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket(`${WS_URL}${url}`)
      wsRef.current.onopen = () => {
        console.log(`ws: ${url} open`)
      }
      wsRef.current.onmessage = (msg) => {
        const dataStr: string = msg.data
        let msgObj: WebSocketMsg | undefined
        try {
          msgObj = JSON.parse(dataStr) as WebSocketMsg
        } catch (error) {}
        let realData: AnyToFix
        const realDataStr = msgObj?.data || '{}'
        try {
          realData = JSON.parse(realDataStr)
        } catch (error) {}
        switch (msgObj?.msgType) {
          case 'rsStatus':
            emitter.emit('rtStatus', realData as VehicleResult)
            break
          case 'remoteControl':
            emitter.emit('remoteControlResult', realData as RemoteControlResult)
            break
          default:
            break
        }
      }
    }
  }, [WS_URL, url])

  return {
    ws: wsRef.current,
  }
}
