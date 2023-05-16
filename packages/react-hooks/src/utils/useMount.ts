import { useEffect } from 'react'

export const useMount = (fn: Fn | undefined = undefined) => {
  useEffect(() => {
    const asyncFn = async () => {
      await fn?.()
    }
    asyncFn().catch(console.log)
  }, [fn])
}
