import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'

const fetchData = (): Promise<BaseResponse<{ name: string }>> =>
  fetch('http://localhost:3001/api/zyc-blog', {}).then((res) => res.json())

export const ReactQueryDemo = () => {
  const [flag, setFlag] = useState(0)
  const [num, setNum] = useState(0)
  console.log(flag)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNum((_) => _ + 1)
    }, 3000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['zyc-blog'],
    queryFn: fetchData,
    refetchInterval: 1000 * 30 * 1,
    // refetchIntervalInBackground: true,
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
    gcTime: 20 * 1000,
    staleTime: 10 * 1000,
  })
  useEffect(() => {
    if (data) console.log('fetched: ', dayjs().format('YYYY-MM-DD HH:mm:ss'))
  }, [data])

  const onRefetch = useCallback(() => {
    refetch({ cancelRefetch: false }).catch(console.log)
  }, [refetch])
  const onRefresh = useCallback(() => {
    setFlag((_) => _ + 1)
  }, [])
  const increaseNum = useCallback(() => {
    setNum((_) => _ + 1)
  }, [])

  if (isLoading) return <div>{isLoading}</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  return (
    <div>
      <span className="text-red-300">{num}</span>
      <button onClick={onRefetch}>Refetch</button>
      <button onClick={onRefresh}>Refresh flag</button>
      <button onClick={increaseNum}>setNum</button>
      <div className="text-green-300">{JSON.stringify(data)}</div>
    </div>
  )
}
