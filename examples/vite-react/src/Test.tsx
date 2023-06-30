/*
 * @Description: useState vs useReducer example
 * @Author: Liutsing
 */
import React, { useReducer, useState } from 'react'
import { RippleButton } from '@liutsing/rc-components'
const ComponentWithUseState = () => {
  const [count, setCount] = useState(0)
  console.count('ComponentWithUseState render')
  return (
    <div>
      {count} <RippleButton onClick={() => setCount((c) => c + 0)}>{count}</RippleButton>
    </div>
  )
}

const ComponentWithUseReducer = () => {
  const [count, setCount] = useReducer((prev: number, action: (arg0: number) => number) => action(prev), 0)
  console.count('ComponentWithUseReducer render')
  return (
    <div>
      {count} <RippleButton onClick={() => setCount((c: number) => c + 0)}>{count}</RippleButton>
    </div>
  )
}

export const TestDemo1 = () => (
  <div className="App">
    <h1>With useState</h1>
    <ComponentWithUseState />
    <h1>With useReducer</h1>
    <ComponentWithUseReducer />
  </div>
)
