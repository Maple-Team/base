import React, { useCallback, useState } from 'react'
import '@liutsing/rc-components/dist/esm/index.css'
import { ListWithMore } from './List'

export const UseCount = () => {
  const [num, setNum] = useState<number>(0)
  const increase = useCallback(() => {
    setNum((_) => _ + 1)
  }, [])
  const decrease = useCallback(() => {
    setNum((_) => _ - 1)
  }, [])
  return {
    num,
    increase,
    decrease,
  }
}
export const CounterRenderProps = ({
  children, // children特殊属性
}: {
  children: ({ num, increase, decrease }: { num: number; increase: () => void; decrease: () => void }) => JSX.Element
}) => {
  const { num, increase, decrease } = UseCount()
  return children({ num, increase, decrease })
}

const App = () => {
  // const { num, increase, decrease } = UseCount()
  const [data, _setData] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])

  return (
    <>
      <ListWithMore
        data={data}
        max={5}
        renderItem={(item) => <span key={item}>{item}</span>}
      />
      {/* <RenderComponent render={() => <div>render function component</div>} /> */}
      {/* <Counter /> */}
      {/* <div>
        <span>num: {num}</span>
        <RippleButton onClick={increase}>+</RippleButton>
        <RippleButton onClick={decrease}>-</RippleButton>
      </div>
      <CounterRenderProps>
        {({ num, increase, decrease }) => {
          return (
            <>
              {num}
              <button onClick={increase}>+</button>
              <button onClick={decrease}>-</button>
            </>
          )
        }}
      </CounterRenderProps> */}
      {/* <footer>
        <a href="https://skk.moe/">Sukka</a>
      </footer> */}
    </>
  )
}

export default App
