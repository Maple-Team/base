import React, { StrictMode, useState } from 'react'
import { Button, Space } from 'antd'
import useForceUpdate from './hooks/useForceUpdate'
import usePervious from './hooks/usePervious'
import useReactUsePervious from './hooks/react-use-usePervious'
import useAHooksPervious from './hooks/ahooks-usePervious'
import usePreviousNext from './hooks/usePreviousNext'

export function App() {
  const forceUpdate = useForceUpdate()
  const [count, setCount] = useState(0)
  const prevCount1 = usePervious(count)
  const prevCount2 = useReactUsePervious(count)
  const prevCount3 = useAHooksPervious(count)
  const prevCount4 = useAHooksPervious(count, (prev, next) => {
    console.log(prev, next)
    return prev !== next
  })
  const prevCount5 = usePreviousNext(count, [count])
  return (
    <>
      <div className="App">
        <Space>
          <Button type="primary" onClick={() => setCount(count + 1)}>
            Click Me
          </Button>
          <Button type="primary" onClick={() => forceUpdate()}>
            ForceUpdate
          </Button>
        </Space>
        <p>count: {count}</p>
        <p>usePervious: {prevCount1}</p>
        <p>react-use/usePervious: {prevCount2}</p>
        <p>ahooks/usePervious: {prevCount3}</p>
        <p>ahooks/usePervious with compare function: {prevCount4}</p>
        <p>prevCount5: {prevCount5}</p>
      </div>
    </>
  )
}

export default () => {
  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Normal</h2>
      <App />
      <StrictMode>
        <h2 style={{ textAlign: 'center' }}>StriceMode</h2>
        <App />
      </StrictMode>
    </>
  )
}
