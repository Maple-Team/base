import React, { useCallback, useState } from 'react'
import Child from './child'

const App = () => {
  const [key, updateKey] = useState<number>(1)
  const cb = useCallback(() => {
    updateKey(Math.random())
  }, [])

  // console.log('parent', key)

  return <>{key > 0.5 && <Child cb={cb} key1={key} />}</>
}

export default App
