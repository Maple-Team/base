import React, { useCallback, useState } from 'react'
import Child from './child'

const App = () => {
  const [key, updateKey] = useState<number>(Math.random())
  const cb = useCallback(() => {
    updateKey(Math.random())
  }, [])

  console.log('parent', key)

  return (
    <>
      <Child cb={cb} key1={key} />
    </>
  )
}

export default App
