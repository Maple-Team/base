import { useEffect, useState } from 'react'
import { useCustomHook } from './query'

export const useFetchInfo = () => {
  const [seed, setSeed] = useState<string>('')
  const { data, isSuccess, isError, isLoading } = useCustomHook()

  useEffect(() => {
    if (isSuccess) setSeed(data.info.seed)
  }, [isSuccess, data])

  return { seed, isSuccess, isError, isLoading }
}
