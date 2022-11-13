import { useState, useCallback, memo } from 'react'

const BigNumber = ({ number }: { number: number }) => <div style={{ fontWeight: 700, fontSize: 36 }}>{number}</div>
const SomeDecoration = memo(() => <div>Hooray! {Math.random()}</div>)

const Counter = () => {
  const [count, setCount] = useState(0)
  const handleButtonClick = useCallback(() => setCount((count) => count + 1), [])

  return (
    <div>
      <BigNumber number={count} />
      <button onClick={handleButtonClick}>Increment</button>
      <SomeDecoration />
    </div>
  )
}

const App = () => (
  <>
    <Counter />
    <footer>
      <a href="https://skk.moe/">Sukka</a>
    </footer>
  </>
)

export default App
