import axios from 'axios'
import { remoteCommandTypeEnum, vehicleDeviceSwitchStateEnum } from '@/enums'
import { RemoteControlResult, VehicleResult, SendCommandParams } from '@liutsing/types-utils'
import { useQuery } from '@tanstack/react-query'

const Api = {
  sendControlCommand: '/vehicle-control/sendCmd', // 远控下发
  fetchControlResult: '/vehicle-control/getVehConResult', // 某次下发命令结果
  getLatestTracking: '/vehicle-control/getLatestTracking',
}

/**
 * 远控下发命令
 * @param data 命令参数
 * @returns
 */
export const sendRemoteCommand = (data: SendCommandParams) => {
  return axios.post<unknown, BaseResponse<string>>(Api.sendControlCommand, data)
}

export const closeShoutBeaconRequest = (vin?: string) => {
  if (!vin) return
  const data = JSON.stringify({
    deviceType: '1',
    vin,
    instructionDtoList: [
      {
        commandType: remoteCommandTypeEnum.REMOTE_SHOUTS,
        switchOrder: vehicleDeviceSwitchStateEnum.CLOSE,
      },
    ],
  })
  navigator.sendBeacon(`/api/vehicle-core-data/${Api.sendControlCommand}`, data)
}
/**
 * 车辆实况数据查询
 * @param params { vin?: string }
 * @returns
 */
export const useLatestVehicleResultQuery = (vin?: string) =>
  useQuery(
    ['getLatestTrackingQueryKey', vin],
    (): Promise<VehicleResult> => axios.get(Api.getLatestTracking, { params: { vin } }),
    {
      enabled: !!vin,
    }
  )

/**
 * 获取单个commandID的执行结果
 * @param commandId 任务id
 * @param timeout 是否到时间
 * @returns
 */
export const useFetchCommandResult = (timeout: number, commandId?: string | null) => {
  return useQuery(
    ['fetchRemoteCommandResultKey', commandId],
    () => axios.get<AnyToFix, RemoteControlResult>(Api.fetchControlResult, { params: { commandId } }),
    {
      enabled: !!commandId && timeout === 0,
      staleTime: Infinity,
    }
  )
}
