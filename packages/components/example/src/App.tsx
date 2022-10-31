import React, { useState } from 'react'
import { Button, Scrollbar } from '@liutsing/components'
import '@liutsing/components/dist/esm/index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button label="123" />
    </div>
  )
}

export default App
