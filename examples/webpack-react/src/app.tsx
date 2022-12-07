import { useScroll, useAsync } from '@liutsing/rc-hooks'
import React, { useEffect } from 'react'
// import { AreaChart } from './area'
// import { groupBy } from 'lodash'
import { join } from 'lodash-es'
// import { groupBy } from 'lodash'
// import groupBy from 'lodash.groupby'

const App = () => {
  useAsync('https://randomuser.me/api')
  useScroll((e) => {
    console.log(e)
  })
  useEffect(() => {
    join([], 'id')
  }, [])
  return (
    <>
      <div>app entry</div>11
      {/* <AreaChart /> */}
    </>
  )
}

export default App
