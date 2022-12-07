import { useState, useCallback, memo, useRef } from 'react'
import { useMount, useUnmount, useAsync, useScroll } from '@liutsing/rc-hooks'
import { RippleButton, Button } from '@liutsing/rc-components'
import '@liutsing/rc-components/dist/esm/index.css'

const BigNumber = ({ number }: { number: number }) => {
  useUnmount(() => {
    console.log('BigNumber unmount')
  })
  return <div style={{ fontWeight: 700, fontSize: 36 }}>{number}</div>
}
const SomeDecoration = memo(({ cb1, cb2 }: { cb1?: () => void; cb2?: () => void }) => {
  cb1 && cb1()
  cb2 && cb2()
  return <div>Hooray! {Math.random()}</div>
})

const Counter = () => {
  const [count, setCount] = useState(0)
  const handleButtonClick = useCallback(() => setCount((count) => count + 1), [])
  const ref = useRef<number[]>([])

  const _cb1 = useCallback(() => {
    console.log('123', new Date().getTime())
  }, []) // -> same fn
  const cb2 = useCallback(() => {
    console.log('456', new Date().getTime())
  }, [[]]) // -> different fn
  const _cb3 = useCallback(() => {
    console.log('456', new Date().getTime())
  }, [ref.current]) // -> same fn

  useMount(() => {
    console.count('execute times')
  })

  const [visible, setVisible] = useState<boolean>(true)
  const { data, isLoading, error } = useAsync('https://randomuser.me/api')

  useScroll((e: Event) => console.log(e))
  return (
    <div>
      <>
        {isLoading ? <span>loading</span> : ''}
        {error ? <span>{error.message}</span> : ''}
        {data && <span>{JSON.stringify(data)}</span>}
        {visible && <BigNumber number={count} />}
        <button onClick={handleButtonClick}>Increment</button>
        <button
          onClick={() => {
            setVisible((_) => !_)
          }}
        >
          Toggle Visible
        </button>
        <SomeDecoration
          // cb1={cb1}
          cb2={cb2}
        />
        <Button>Normal Button</Button>
        <RippleButton>Ripple Button</RippleButton>
        <div style={{ height: 1500 }}></div>
      </>
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
