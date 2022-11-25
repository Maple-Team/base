import React from 'react'
import { AreaChart } from './area'
import { useAsync } from '@liutsing/rc-hooks'
const App = () => {
  useAsync('https://randomuser.me/api')
  return <div>app entry</div>
  // return <AreaChart />
}

export default App
