import { useCallback } from 'react'
import { useState } from 'react'
import { hydrateRoot } from 'react-dom/client'

// working

function App({ counter }) {
  const [num, setNum] = useState(0)
  const onIncrease = useCallback(() => {
    setNum((_) => _ + 1)
  }, [])

  return (
    <>
      <h1>
        Hello, world! {counter}-{num}
      </h1>
      <input placeholder="Type something here" />
      <button onClick={onIncrease}>+</button>
    </>
  )
}

const root = hydrateRoot(document.getElementById('root'), <App counter={0} />)

let i = 1
// setInterval(() => {
root.render(<App counter={i} />)
//   i++
// }, 1000)
