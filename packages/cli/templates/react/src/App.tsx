import React, { useState } from 'react'
import styles from './App.module.css'
// https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md
function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className={`${styles.container}`}>
      <h1>React + TypeScript</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
