import { useFullScreen } from '@ecar/hooks'
import React, { useCallback } from 'react'
import type { CameraPosition } from '@ecar/types'
import { useTranslation } from 'react-i18next'
import { message } from 'antd'

export function Component() {
  useFullScreen(process.env.NODE_ENV === 'production')

  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const onRemoteVideoUnPublish = useCallback(
    (plateNo: string, position: CameraPosition) => {
      const positionStr = t(`camera-${position}`)
      messageApi.warning({
        content: `${plateNo}${positionStr}视频推流异常`,
        key: `${plateNo}-${position}`,
      })
    },
    [messageApi, t]
  )

  console.log(onRemoteVideoUnPublish)
  const plateNo = 'VIN123'
  return (
    <div>
      {contextHolder}
      <div>{`${plateNo}已急停`}</div>
    </div>
  )
}

Component.displayName = 'MonitorLazyPage'
