import type { RemoteControlResult, SendCommandParams, VehicleResult } from '@liutsing/types-utils'
import { useQuery } from '@tanstack/react-query'
import { axios } from '@/http'
import { remoteCommandTypeEnum, vehicleDeviceSwitchStateEnum } from '@/enums'

const Api = {
  sendControlCommand: '/api/vehicle-control/sendCmd', // 远控下发
  fetchControlResult: '/api/vehicle-control/getVehConResult', // 某次下发命令结果
  getLatestTracking: '/api/vehicle-control/getLatestTracking',
}

/**
 * 远控下发命令
 * @param data 命令参数
 * @returns
 */
export const sendRemoteCommand = (data: SendCommandParams) => {
  return axios.post<unknown, string, SendCommandParams>(Api.sendControlCommand, data)
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
    // @ts-expect-error: 忽略不处理
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
    // @ts-expect-error: 忽略不处理
    {
      enabled: !!commandId && timeout === 0,
      staleTime: Infinity,
    }
  )
}
