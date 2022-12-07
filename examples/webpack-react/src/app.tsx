import { useScroll, useAsync } from '@liutsing/rc-hooks'
import React from 'react'
import { AreaChart } from './area'

const App = () => {
  useAsync('https://randomuser.me/api')
  useScroll((e) => {
    console.log(e)
  })
  return (
    <>
      <div>app entry</div>11
      <AreaChart />
    </>
  )
}

export default App
