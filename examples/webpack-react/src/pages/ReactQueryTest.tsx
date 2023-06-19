import React, { useEffect } from 'react'
import { getIps } from '@liutsing/utils'
import { useCustomHook, useFetchInfo } from '@/hooks'

export const Example2 = () => {
  const { seed } = useFetchInfo()
  return <div data-testid="test-id">{seed}</div>
}

export const Example1 = () => {
  const { isLoading, data } = useCustomHook()
  useEffect(() => {
    getIps().then(console.log)
  }, [])
  if (isLoading) return <div>Loading...</div>
  return <div data-testid="test-id">{data?.info.seed}</div>
}
export { useFetchInfo }
