export type DeviceSwitchOrder = 0 | 1
export interface DeviceStatusData {
  /**
   * 强光灯,1-开，0-关
   */
  majorLight?: DeviceSwitchOrder
  /**
   * 警灯,1-开，0-关
   */
  warningLamp?: DeviceSwitchOrder
  /**
   * 警笛,1-开，0-关
   */
  alarmWhistle?: DeviceSwitchOrder
  /**
   *  储物柜1,1-开，0-关
   */
  locker1?: DeviceSwitchOrder
  /**
   * 储物柜2,1-开，0-关
   */
  locker2?: DeviceSwitchOrder
  /**
   * 远程喊话
   */
  remoteCall?: any // TODO
  /**
   * 音频文件
   */
  audioSerial?: string
  /**
   * 视频文件
   */
  videoSerial?: string
  /**
   * 图片文件
   */
  pictureSerial?: string
}

/**
 * 远控下发类型
 * 01: 强光灯
 * 02: 警灯
 * 03: 警笛
 * 04: 紧急驻车
 * 05: 恢复行驶
 * 0601: 储物柜-柜1
 * 0602: 储物柜-柜2
 * A01:点阵屏
 * A02:音频
 * A03:视频
 * A04:图片
 */
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
/**
 * 远控执行结果code
 * 1000：待执行，1001：待下发，1002：执行中 1：执行成功，2：执行失败 等其他，其他错误码待定义
 */
export type ControlExecuteCode = '1000' | '1001' | '1002' | '1' | '2'
export interface ControlResultItem {
  commandType: RemoteCommandType
  resultCode: ControlExecuteCode
  /**
   * 远控执行结果描述
   */
  resultMsg: string
  /**
   * 详细错误码
   */
  errorDetailCode: string | null
  /**
   * 详情错误码描述
   */
  errorDetailMsg: string | null
}
/**
 * 远控结果
 */
export interface RemoteControlResult {
  /**
   * vehicleId
   */
  vehicleId: null | string
  /**
   * 车架号
   */
  vin: string
  /**
   * 远控命令唯一标识
   */
  commandId: string
  controlResultList: ControlResultItem[]
}

export interface ControlItem {
  /**
   * 是否开启
   */
  checked: boolean
  /**
   * 远控类型
   */
  type: RemoteCommandType
  /**
   * 是否等待执行结果
   */
  loading: boolean
  /**
   * 是否被禁用
   */
  disabled?: boolean
}

/**
 * 车辆状态
 */
export type DrivingState = 'drivingState' | 'idleState'
export type RemoteControlKey = keyof DeviceStatusData | DrivingState

export interface VehicleControlSkill {
  id: string
  code: string
  describe: string
}
export interface VehicleData {
  /**
   * 总里程
   */
  mileage: string
  /**
   * 速度
   */
  vehicleSpeed: string
  /**
   * 剩余电量
   */
  soc: string
  /**
   * 充电状态
   */
  chargeStatus: number
  /**
   * 电机温度
   */
  motorTemperature: number
  /**
   * 电池温度
   */
  batteryTemperature: number
  /**
   * 车辆工作模式，1-待机模式，2-遥控模式，3-自动驾驶模式，4-远程控制模式，5-紧急模式
   */
  workStats: number
}
export interface VehicleResult {
  /**
   * 今日里程（km）
   */
  todayMiles: number
  /**
   * 总里程（km）
   */
  totalMiles: number
  /**
   * 车架号
   */
  vin: string
  /**
   * 终端编号
   */
  terminalCode: string
  /**
   * 终端上报时间
   */
  terminalTime: string
  /**
   * 数据采集时间
   */
  collectionTime: string
  /**
   * 平台接收时间
   */
  receiveTime: string
  /**
   * 基础数据
   */
  vehicleData: VehicleData
  /**
   * gps数据
   */
  gpsData: GpsData
  deviceStatusData: DeviceStatusData
  driveData: DriveData
  vehicleId?: string
}
export interface GpsData {
  /**
   * 经度
   */
  gpsLng: string
  /**
   * 纬度
   */
  gpsLat: string
  /**
   * GPS海拔
   */
  gpsAlt: string
  /**
   * GPS速度
   */
  gpsSpeed: string
  /**
   * GPS总里程
   */
  gpsMileage: string
  /**
   * 方向角
   */
  turningAngle: string
}
export interface DriveData {
  drivingState: VehicleDrivingState
}

/**
 * 行驶状态
 * -1、STANDBY:待机，无规划
 * -2、READY: 有规划，坐标启动
 * -3、STARTING:启动中
 * -4、RUNNING:行驶中
 * -5、ARRIVING:即将到站
 * -6、WATCHING:车辆处于观察状态，观察路口、红绿灯、障碍物等
 * -7、PAUSING:即将停车
 * -8、PAUSED: 停车
 * -9、DESTINATION_ARRIVED:到达目的地
 * -10、MANUAL: 人工驾驶
 **/
export type VehicleDrivingState = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export interface Message {
  vin: string
  msgType: MessageType
  data: string
}

export type MessageType = 'rtStatus' | 'remoteControl'
