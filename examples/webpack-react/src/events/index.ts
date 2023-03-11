import { Message, RemoteControlResult, VehicleResult } from '@/types'
import mitt from 'mitt'

type Events = {
  /**
   * websocket事件
   */
  websocketMsg: Message & {
    /**
     * 是否单车
     */
    isSingle: boolean
  }

  /**
   * 远控结果
   */
  remoteControlResult: RemoteControlResult
  /**
   * 实时车况
   */
  rtStatus: VehicleResult
}

export const emitter = mitt<Events>()
