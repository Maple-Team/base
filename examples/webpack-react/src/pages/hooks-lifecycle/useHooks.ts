// import { usePrevious } from 'ahooks'
import { useEffect, useRef } from 'react'

function useModifyPrevious<T>(state: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = state
    console.log('previous assign', state, ref.current)
    // 只影响下一次render时的执行逻辑，不会影响当前渲染
  })

  return ref.current
}

export const useHooks = (id?: string, isStopped?: boolean) => {
  const previousStopped = useModifyPrevious(isStopped)

  // 内部状态需要跟随id重置
  useEffect(() => {
    // render后的结果
    console.log('useHooks effect', {
      previousStopped,
      id,
      isStopped,
    })
    return () => {
      console.log('useHooks effect cleanup', {
        previousStopped,
        id,
        isStopped,
      })
    }
  }, [id, isStopped, previousStopped])

  useEffect(() => {
    console.log('useHooks effect stop', {
      previousStopped,
      id,
      isStopped,
    })
    if (isStopped === true && previousStopped === false)
      console.log(`%c stop success: ${id || ''}`, 'background: #0f0;color: #fff')
  }, [isStopped, previousStopped, id])

  useEffect(() => {
    console.log('useHooks effect unstop', {
      previousStopped,
      id,
      isStopped,
    })
    if (isStopped === false && previousStopped === true)
      console.log(`%c unstop success: ${id || ''}`, 'background: #0f0;color: #fff')
  }, [isStopped, previousStopped, id])
}
