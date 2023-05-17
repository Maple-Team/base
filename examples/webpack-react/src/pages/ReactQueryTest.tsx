import React, { useEffect, useState } from 'react'
import { useCustomHook } from '@/hooks'

export const useFetchInfo = () => {
  const [seed, setSeed] = useState<string>('')
  const { data, isSuccess } = useCustomHook()

  useEffect(() => {
    if (isSuccess) setSeed(data.info.seed)
  }, [isSuccess, data])

  return seed
}
// export default () => {
//   const { isLoading, data } = useCustomHook()
//   if (isLoading) return <div>Loading...</div>
//   return <div data-testid="test-id">{data?.info.seed}</div>
// }

export default () => {
  const seed = useFetchInfo()
  return <div data-testid="test-id">{seed}</div>
}
