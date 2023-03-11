export enum remoteCommandTypeEnum {
  STRONG_LIGHT = '01',
  ALARM_LIGHT = '02',
  ALARM_RING = '03',
  VEHICLE_STOP = '04',
  VEHICLE_CONTINUE = '05',
  VEHICLE_LOCKER1 = '0601',
  VEHICLE_LOCKER2 = '0602',
  VEHICLE_LED = 'A01',
  VEHICLE_AUDIO = 'A02',
  VEHICLE_VIDEO = 'A03',
  VEHICLE_IMAGE = 'A04',
  REMOTE_SHOUTS = 'B01',
}
/**
 * 远控结果
 * 参考设计：@https://kt0zpcqesk.feishu.cn/docx/doxcnjgx89ttDVgGVj1X9rla1Vb
 */
export enum remoteResultEnum {
  VEHICLE_CONTROL_TO_BE_EXECUTED = '1000',
  VEHICLE_CONTROL_TO_BE_ISSUED = '1001',
  VEHICLE_CONTROL_IN_EXECUTION = '1002',
  FAIL_VEHICLE_NOT_ONLINE = '1003',
  VEHICLE_WAKE_UP_FAILED = '1004',
  VEHICLE_CONTROL_BEYOND_MAX_RETRY_ERROR = '1005',
  VEHICLE_CONTROL_RESULT_REPORTING_TIMEOUT = '1006',
  VEHICLE_CONTROL_PARAMETER_ERROR = '1007',
  FAIL_ACK_UNKNOWN = '9996',
  VEHICLE_CONTROL_RESULT_NOT_UP_ERROR = '9997',
  FAIL_MEANING_LESS_ERROR = '9998',
  FAIL_UNKNOWN = '9999',
  SUCCESS = '1',
  FAIL = '2',
  ACK_SUCCESS = '3',
  ACK_FAIL = '4',
  ACK_MESSAGE_PARSE_ERROR = '5',
  ACK_CODE_DEFAULT_ERROR = '6',
}

export enum remoteControlSourceEnum {
  PATROL_TASK = 'PATROL_TASK',
  WEB = 'WEB',
  APP = 'APP',
}

export enum vehicleOnlineStatusEnum {
  ALL = 3,
  OFFLINE = 2,
  ONLINE = 1,
}
export enum vehicleDrivingStateEnum {
  /**
   * 待机，无规划
   */
  STANDBY = 1,
  /**
   * 有规划，坐标启动
   */
  READY = 2,
  /**
   * 启动中
   */
  STARTING = 3,
  /**
   * 行驶中
   */
  RUNNING = 4,
  /**
   * 即将到站
   */
  ARRIVING = 5,
  /**
   * 车辆处于观察状态，观察路口、红绿灯、障碍物等
   */
  WATCHING = 6,
  /**
   * 即将停车
   */
  PAUSING = 7,
  /**
   * 停车
   */
  PAUSED = 8,
  /**
   * 到达目的地
   */
  DESTINATION_ARRIVED = 9,
  /**
   * 人工驾驶
   */
  MANUAL = 10,
}

export enum vehicleDeviceSwitchStateEnum {
  OPEN = '1',
  CLOSE = '2',
}

export enum vehicleRemoteControlResultEnum {
  SUCCESS = '1',
  FAILED = '2',
  WAITING = '1000',
  SENDING = '1001',
  PENDING = '1002',
}
