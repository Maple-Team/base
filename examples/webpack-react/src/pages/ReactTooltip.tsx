import React from 'react'
import { Tooltip } from '@liutsing/rc-components'
import '@liutsing/rc-components/dist/esm/index.css'

export const ReactTooltip = () => {
  return (
    <div>
      <div className="mb-20">
        <Tooltip
          placement="bottom"
          title="This tooltip does not fit above the button. This is why it's displayed below instead!"
        >
          Hover over me(tooltip above)
        </Tooltip>
      </div>
      <div className="mb-20">
        <Tooltip
          placement="top"
          title="This tooltip fit above the button."
        >
          Hover over me(tooltip above)
        </Tooltip>
      </div>
      <div className="mb-20">
        <Tooltip
          placement="bottom"
          title="This tooltip fit above the button."
        >
          Hover over me(tooltip below)
        </Tooltip>
      </div>
    </div>
  )
}
