import { message } from 'antd'
import type { NoticeType } from 'antd/es/message/interface'

export const showMesage = async (msg: string, level: NoticeType) => {
  await message[level](msg)
}
