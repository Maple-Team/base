import React, { useCallback, useState } from 'react'
import { useUnmount } from './hooks'

const Demo = ({ cb, key1 }: { cb?: () => void; key1: number }) => {
  const [count, setCount] = useState(0)

  console.count('Child')

  useUnmount(() => {
    console.log('count', count)
  })
  const onIncrease = useCallback(() => {
    setCount((c) => c + 1)
    cb?.()
  }, [cb])

  return (
    <div>
      {count}-{key1}
      <br />
      <button onClick={onIncrease}>+</button>
    </div>
  )
}

export default Demo
