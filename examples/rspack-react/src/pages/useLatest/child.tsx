import React, { useCallback, useState } from 'react'
import { useUnmount } from './hooks'

const Demo = ({ cb, key1 }: { cb?: () => void; key1: number }) => {
  const [count, setCount] = useState(0)

  console.count('Child render times')

  console.log('count value: ', count)

  useUnmount(() => {
    // NOTE 闭包问题
    console.log('useUnmount count value: ', count)
  })
  const onIncrease = useCallback(() => {
    setCount((c) => c + 1)
    setTimeout(() => {
      cb?.()
    }, 1000)
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
