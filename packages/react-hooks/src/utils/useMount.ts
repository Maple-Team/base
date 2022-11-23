import { useRef, useEffect } from 'react'
import { useEffectOnce } from './useEffectOnce'

export const useMount = (fn: Fn) => {
  useEffect(() => {
    fn?.()
  }, [])
}

const _useMount = (fn: Fn) => {
  const ref = useRef(fn)
  useEffect(() => {
    fn?.()
  }, [ref.current])
}

export const useMount2 = (fn: Fn) => {
  useEffectOnce(() => {
    fn?.()
  })
}
