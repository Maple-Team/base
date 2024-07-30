/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { uuid } from '@liutsing/utils'
// import React, { useCallback, useState } from 'react'
// import ReactDOM from 'react-dom/client'

// const myMap = new WeakMap()
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root') as HTMLElement
  const id = uuid()
  console.log(id)
})

// async function stuff() {
//   const greeting = await Promise.resolve('hi')
//   return greeting
// }

// const Counter = () => {
//   const [count, updateCount] = useState<number>(0)

//   const handleClick = useCallback(() => {
//     updateCount((c) => c + 1)
//   }, [])

//   return (
//     <button id="counter" onClick={handleClick}>
//       {count}
//     </button>
//   )
// }

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<Counter />)
