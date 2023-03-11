import axios from 'axios'
import { remoteCommandTypeEnum, vehicleDeviceSwitchStateEnum } from '@/enums'
import { VehicleResult } from '@/types'
import { useQuery } from '@tanstack/react-query'

export type RemoteCommandType =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '0601'
  | '0602'
  | 'A01'
  | 'A02'
  | 'A03'
  | 'A04'
  | 'B01'
export type RemoteCommandName = '强光灯' | '警灯' | '警笛' | '紧急驻车' | '恢复行驶' | '储物柜1' | '储物柜2'
export type SwitchOrder = '1' | '2' // 开关指令, 1:开启，2:关闭
export type RemoteControlDeviceType = '1' | '2' // 设备类型，1：BCU设备，2：终端设备,默认值1
export type RemotePanelType = 'alarm' | 'storage' | 'led' | 'audio' | 'video' | 'image' | 'drive' | 'divider'

export interface CommandInstruction {
  commandType: RemoteCommandType // 01-强光灯，02-警灯，03-警笛
  switchOrder: SwitchOrder
}
interface SendCommandParams {
  instructionDtoList: CommandInstruction[]
  deviceType: RemoteControlDeviceType
  vin: string
}
const Api = {
  sendControlCommand: '/v1/vehicle/control/sendCmd', // 远控下发
  fetchControlResult: '/v1/vehicle/control/getVehConResult', // 某次下发命令结果
  getLatestTracking: '',
}

/**
 * 远控下发命令
 * @param data 命令参数
 * @returns
 */
export const sendRemoteCommand = (data: SendCommandParams) => {
  return axios.post<unknown, string>(Api.sendControlCommand, data)
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
