import React, { Suspense, useState } from 'react'

const RemoteButton = React.lazy(() => import('mfprovider/Button'))

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>React + TypeScript</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Suspense fallback="loading...">
        <RemoteButton />
      </Suspense>
    </div>
  )
}

export default App
