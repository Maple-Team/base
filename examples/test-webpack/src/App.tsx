import React, { Suspense, lazy, useState } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

const Button = lazy(() => import('./Button'))
function App() {
  const [count, setCount] = useState(0)

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>React + TypeScript</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              <Button />
            </Suspense>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
