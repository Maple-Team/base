import React, { useState } from 'react'
import { Button } from '@liutsing/component-demo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button label="123" />
    </div>
  )
}

export default App
