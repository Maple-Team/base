import React, { useEffect, useState } from 'react'
import type { Root } from '../hooks/types'
import { useCustomHook } from '@/hooks'

export const useFetchInfo = () => {
  const [info, setInfo] = useState<Root>()
  const { data, isSuccess } = useCustomHook()
  useEffect(() => {
    if (isSuccess) setInfo(data)
  }, [isSuccess, data])

  return info
}
export default () => {
  const { isLoading, error, data, isFetching } = useCustomHook()

  if (isLoading) return <div>Loading...</div>

  if (error instanceof Error) return <div>An error has occurred: {error.message}</div>

  return (
    <div>
      <div data-testid="test-id">{data?.info.seed}</div>
      <div>{isFetching ? 'Updating...' : ''}</div>
    </div>
  )
}
