import { Scrollbar } from '@liutsing/rc-components'
import React from 'react'
import '@liutsing/rc-components/dist/cjs/index.css'

export default () => {
  return (
    // @ts-ignore
    <Scrollbar containerHeight={300}>
      <ul>
        {Array.from({ length: 1000 }, (_, i) => i).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Scrollbar>
  )
}
